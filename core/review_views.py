from datetime import datetime, timezone
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status

from django.db.models import Q
from .models import Card, CardReview, ReviewLog
from .serializers import CardSerializer
from .services.fsrs_service import review_card, get_preview_intervals, format_interval, get_scheduler, card_review_to_fsrs_card
from fsrs import Rating
import logging

logger = logging.getLogger(__name__)

scheduler = get_scheduler()

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def review_queue(request):
    user = request.user
    if not user or not user.is_authenticated:
        return Response({"detail": "Authentication required."}, status=status.HTTP_403_FORBIDDEN)

    now = datetime.now(timezone.utc)
    limit = int(request.query_params.get('limit', 20))
    deck_id = request.query_params.get('deck_id')

    cards_qs = Card.objects.filter(user=user, is_deleted=False)

    if deck_id:
        cards_qs = cards_qs.filter(card_decks__deck_id=deck_id).distinct()

    cards_without_review = cards_qs.filter(fsrs_state__isnull=True)
    new_reviews = [CardReview(card=card, due=now, state=0, step=0) for card in cards_without_review]
    if new_reviews:
        CardReview.objects.bulk_create(new_reviews)

    due_cards_qs = cards_qs.filter(
        fsrs_state__due__lte=now
    ).select_related('fsrs_state').prefetch_related(
        'card_decks', 'card_decks__deck'
    ).order_by('fsrs_state__due')

    due_cards = due_cards_qs[:limit]
    results = []
    for card in due_cards:
        card_data = CardSerializer(card).data
        try:
            cr = card.fsrs_state
        except CardReview.DoesNotExist:
            cr = None

        previews = get_preview_intervals(cr, scheduler)
        card_data['preview_intervals'] = {
            str(k): format_interval(v) for k, v in previews.items()
        }
        results.append(card_data)

    total_due = due_cards_qs.count()

    return Response({
        'cards': results,
        'total_due': total_due,
    })

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def review_submit(request):
    user = request.user
    card_id = request.data.get('card_id')
    rating = request.data.get('rating')

    if not card_id or not rating:
        return Response(
            {"detail": "card_id and rating are required."},
            status=status.HTTP_400_BAD_REQUEST
        )

    rating = int(rating)
    if rating not in (1, 2, 3, 4):
        return Response(
            {"detail": "rating must be 1 (Again), 2 (Hard), 3 (Good), or 4 (Easy)."},
            status=status.HTTP_400_BAD_REQUEST
        )

    try:
        card = Card.objects.get(id=card_id, user=user, is_deleted=False)
    except Card.DoesNotExist:
        return Response({"detail": "Card not found."}, status=status.HTTP_404_NOT_FOUND)

    card_review, created = CardReview.objects.get_or_create(
        card=card,
        defaults={'due': datetime.now(timezone.utc), 'state': 0, 'step': 0}
    )

    updated_fields, log_data = review_card(card_review, rating)

    for field, value in updated_fields.items():
        setattr(card_review, field, value)
    card_review.save(update_fields=list(updated_fields.keys()))
    card_review.refresh_from_db()
    logger.debug(f"DEBUG: Card {card.id} saved. State={card_review.state}, Due={card_review.due}, Stability={card_review.stability}")

    ReviewLog.objects.create(
        card=card,
        user=user,
        rating=log_data['rating'],
        state=log_data['state'],
        elapsed_days=log_data['elapsed_days'],
        scheduled_days=updated_fields.get('scheduled_days', 0),
    )

    previews = get_preview_intervals(card_review, scheduler)

    return Response({
        'status': 'ok',
        'card_id': card.id,
        'next_due': updated_fields['due'].isoformat(),
        'state': updated_fields['state'],
    })

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def review_stats_today(request):
    user = request.user
    now = datetime.now(timezone.utc)
    today_start = now.replace(hour=0, minute=0, second=0, microsecond=0)

    cards_reviewed_today = ReviewLog.objects.filter(
        user=user,
        reviewed_at__gte=today_start
    ).count()

    total_due = Card.objects.filter(
        user=user,
        is_deleted=False
    ).filter(
        Q(fsrs_state__due__lte=now) | Q(fsrs_state__isnull=True)
    ).count()

    daily_goal = 20
    try:
        if hasattr(user, 'profile'):
            daily_goal = getattr(user.profile, 'daily_goal', 20) or 20
    except Exception:
        pass

    return Response({
        'cards_reviewed_today': cards_reviewed_today,
        'cards_due': total_due,
        'daily_goal': daily_goal,
    })
