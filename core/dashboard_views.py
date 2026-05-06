from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.utils import timezone
from django.db.models import Count, Q, Avg
from django.db.models.functions import TruncDate
from datetime import timedelta
from .models import Card, CardReview, ReviewLog


def format_interval(days):
    if not days or days < 0: return "0d"
    days = int(days)
    years = days // 365
    days %= 365
    months = days // 30
    days %= 30

    parts = []
    if years: parts.append(f"{years}y")
    if months: parts.append(f"{months}m")
    if days or not parts: parts.append(f"{days}d")

    return " ".join(parts[:2])


def get_avg_age(qs, field, now):
    dates = qs.values_list(field, flat=True)
    valid_dates = [d for d in dates if d]
    if not valid_dates: return "0d"
    total_days = sum((now - d).days for d in valid_dates)
    return format_interval(total_days / len(valid_dates))


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def dashboard_stats(request):
    user = request.user
    now = timezone.now()
    today = now.date()
    thirty_days_ago = today - timedelta(days=30)
    sixty_days_ago = today - timedelta(days=60)

    logs_today = ReviewLog.objects.filter(user=user, reviewed_at__date=today)
    today_stats = logs_today.aggregate(
        cards_reviewed=Count('id'),
        inaccuracy=Count('id', filter=Q(rating__in=[1, 2]))
    )
    cards_reviewed_today = today_stats['cards_reviewed']
    inaccuracy_today = today_stats['inaccuracy']

    estimated_seconds = cards_reviewed_today * 30
    hours, remainder = divmod(estimated_seconds, 3600)
    minutes, _ = divmod(remainder, 60)
    time_spent_str = f"{int(hours)}h {int(minutes)}m" if hours > 0 else f"{int(minutes)}m"

    cards_qs = Card.objects.filter(user=user, is_deleted=False)
    card_counts = cards_qs.aggregate(
        without_review=Count('id', filter=Q(fsrs_state__isnull=True)),
        remaining_due=Count('id', filter=Q(fsrs_state__due__lte=now) | Q(fsrs_state__isnull=True)),
        new_count=Count('id', filter=Q(fsrs_state__state=0) | Q(fsrs_state__isnull=True)),
        n_last_30=Count('id', filter=(Q(fsrs_state__state=0) | Q(fsrs_state__isnull=True)) & Q(created_at__gte=thirty_days_ago)),
        n_prev_30=Count('id', filter=(Q(fsrs_state__state=0) | Q(fsrs_state__isnull=True)) & Q(created_at__gte=sixty_days_ago, created_at__lt=thirty_days_ago)),
    )
    cards_without_review = card_counts['without_review']
    remaining_due = card_counts['remaining_due']
    new_count = card_counts['new_count']
    new_trend = round(((card_counts['n_last_30'] - card_counts['n_prev_30']) / (card_counts['n_prev_30'] or 1)) * 100)

    user_card_reviews = CardReview.objects.filter(card__user=user, card__is_deleted=False)
    review_stats = user_card_reviews.aggregate(
        mastered_count=Count('id', filter=Q(stability__gt=21)),
        mastered_avg=Avg('scheduled_days', filter=Q(stability__gt=21)),
        m_last_30=Count('id', filter=Q(stability__gt=21, last_review__gte=thirty_days_ago)),
        m_prev_30=Count('id', filter=Q(stability__gt=21, last_review__gte=sixty_days_ago, last_review__lt=thirty_days_ago)),
        
        learning_count=Count('id', filter=Q(state__in=[1, 3])),
        learning_avg=Avg('scheduled_days', filter=Q(state__in=[1, 3])),
        l_last_30=Count('id', filter=Q(state__in=[1, 3], last_review__gte=thirty_days_ago)),
        l_prev_30=Count('id', filter=Q(state__in=[1, 3], last_review__gte=sixty_days_ago, last_review__lt=thirty_days_ago)),
    )

    mastered_count = review_stats['mastered_count']
    mastered_int = review_stats['mastered_avg'] or 0
    mastered_trend = round(((review_stats['m_last_30'] - review_stats['m_prev_30']) / (review_stats['m_prev_30'] or 1)) * 100)

    learning_count = review_stats['learning_count']
    learning_int = review_stats['learning_avg'] or 0
    learning_trend = round(((review_stats['l_last_30'] - review_stats['l_prev_30']) / (review_stats['l_prev_30'] or 1)) * 100)

    total_relevant_today = cards_reviewed_today + remaining_due

    heatmap_logs = ReviewLog.objects.filter(
        user=user,
        reviewed_at__date__gte=thirty_days_ago
    ).annotate(
        date=TruncDate('reviewed_at')
    ).values('date').annotate(count=Count('id')).order_by('date')

    heatmap_dict = {str(item['date']): item['count'] for item in heatmap_logs}

    heatmap_data = []
    for i in range(29, -1, -1):
        d = today - timedelta(days=i)
        date_str = str(d)
        heatmap_data.append({
            "date": date_str,
            "count": heatmap_dict.get(date_str, 0)
        })

    is_active_today = cards_reviewed_today > 0

    recent_review_dates = set(
        ReviewLog.objects.filter(
            user=user,
            reviewed_at__date__gte=today - timedelta(days=365)
        ).values_list('reviewed_at__date', flat=True).distinct()
    )

    streak_count = 0
    check_date = today if is_active_today else today - timedelta(days=1)
    while check_date in recent_review_dates:
        streak_count += 1
        check_date -= timedelta(days=1)

    mastered_qs = user_card_reviews.filter(stability__gt=21)
    learning_qs = user_card_reviews.filter(state__in=[1, 3])
    new_qs = cards_qs.filter(Q(fsrs_state__state=0) | Q(fsrs_state__isnull=True))

    return Response({
        "today": {
            "reviewed": cards_reviewed_today,
            "inaccuracy": inaccuracy_today,
            "time_spent": time_spent_str,
            "daily_goal": total_relevant_today
        },
        "states": {
            "mastered": {
                "count": mastered_count,
                "trend": mastered_trend,
                "avg_interval": format_interval(mastered_int),
                "avg_age": get_avg_age(mastered_qs, 'card__created_at', now)
            },
            "learning": {
                "count": learning_count,
                "trend": learning_trend,
                "avg_interval": format_interval(learning_int),
                "avg_age": get_avg_age(learning_qs, 'card__created_at', now)
            },
            "new": {
                "count": new_count,
                "trend": new_trend,
                "avg_interval": "1d",
                "avg_age": get_avg_age(new_qs, 'created_at', now)
            }
        },
        "heatmap": heatmap_data,
        "streak": {
            "current": streak_count,
            "is_active": is_active_today
        }
    })
