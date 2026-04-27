from rest_framework import viewsets, mixins, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import PermissionDenied, NotFound
from rest_framework.decorators import action
from django.utils import timezone
from .models import Shelf, Deck, Card, Tag, TaggedItem, ShelfDeck, DeckCard
from .serializers import (
    ShelfSerializer, ShelfCreateSerializer,
    DeckSerializer, DeckCreateSerializer,
    CardSerializer, CardCreateSerializer,
    TagSerializer
)
from django.contrib.contenttypes.models import ContentType

class OwnershipMixin:
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        if not self.request.user or not self.request.user.is_authenticated:
            return self.get_queryset.none()

        qs = self.queryset.filter(user=self.request.user)
        if hasattr(self.queryset.model, 'is_deleted'):
            qs = qs.filter(is_deleted=False)
        return qs

    def perform_create(self, serializer):
        if not self.request.user or not self.request.user.is_authenticated:
            raise PermissionDenied("Profile finalization required.")
        serializer.save(user=self.request.user)

class ShelfViewSet(OwnershipMixin, viewsets.ModelViewSet):
    queryset = Shelf.objects.all()

    def get_serializer_class(self):
        if self.action in ['create', 'update', 'partial_update']:
            return ShelfCreateSerializer
        return ShelfSerializer

    def perform_destroy(self, instance):
        instance.is_deleted = True
        instance.deleted_at = timezone.now()
        instance.save()

class DeckViewSet(OwnershipMixin, viewsets.ModelViewSet):
    queryset = Deck.objects.all()

    def get_serializer_class(self):
        if self.action in ['create', 'update', 'partial_update']:
            return DeckCreateSerializer
        return DeckSerializer

    def perform_create(self, serializer):
        super().perform_create(serializer)
        shelf_ids = self.request.data.get('shelf_ids', [])
        for shelf_id in shelf_ids:
            try:
                shelf = Shelf.objects.get(id=shelf_id, user=self.request.user)
                ShelfDeck.objects.create(shelf=shelf, deck=serializer.instance)
            except ShelfDeck.DoesNotExist:
                pass

    def perform_destroy(self, instance):
        instance.is_deleted = True
        instance.deleted_at = timezone.now()
        instance.save()

class CardViewSet(OwnershipMixin, viewsets.ModelViewSet):
    queryset = Card.objects.all()
    def get_serializer_class(self):
        if self.action in ['create', 'update', 'partial_update']:
            return CardCreateSerializer
        return CardSerializer

    def perform_create(self, serializer):
        super().perform_create(serializer)
        card = serializer.instance

        deck_ids = self.request.data.get('deck_ids', [])
        for deck_id in deck_ids:
            try:
                deck = Deck.objects.get(id=deck_id, user=self.request.user)
                DeckCard.objects.create(deck=deck, card=card)
            except DeckCard.DoesNotExist:
                pass

        if card.card_type == 'reversed':
            mirror_card = Card.objects.create(
                user=self.request.user,
                card_type='reversed',
                front=card.back,
                back=card.front,
                image_url=card.image_url,
                notes=card.notes
            )

            for deck_id in deck_ids:
                try:
                    deck = Deck.objects.get(id=deck_id, user=self.request.user)
                    DeckCard.objects.create(deck=deck, card=mirror_card)
                except DeckCard.DoesNotExist:
                    pass

    def perform_destroy(self, instance):
        instance.is_deleted = True
        instance.deleted_at = timezone.now()
        instance.save()

class TagViewSet(OwnershipMixin, viewsets.ModelViewSet):
    queryset = Tag.objects.all()
    serializer_class = TagSerializer

    @action(detail=False, methods=['post'])
    def assign(self, request):
        tag_id = request.data.get('tag_id')
        item_type = request.data.get('content_type')
        obj_id = request.data.get('object_id')

        try:
            tag = Tag.objects.get(id=tag_id, user=request.user)
        except Tag.DoesNotExist:
            raise NotFound("Tag not found.")

        model_map = {'shelf' : Shelf, 'deck' : Deck, 'card' : Card}
        TargetModel = model_map.get(item_type)
        if not TargetModel:
            return Response({"detail": "Invalid content_type"},
                            status=status.HTTP_400_BAD_REQUEST)

        try:
            target_obj = TargetModel.objects.get(id=obj_id, user=request.user)
        except TargetModel.DoesNotExist:
            raise NotFound("Target object not found.")

        ctype = ContentType.objects.get_for_model(TargetModel)
        TaggedItem.objects.get_or_create(tag=tag, content_type=ctype, object_id=target_obj.id)

        return Response({"status": "assigned"})

    @action(detail=False, methods=['post'])
    def unassign(self, request):
        tag_id = request.data.get('tag_id')
        item_type = request.data.get('content_type')
        obj_id = request.data.get('object_id')

        model_map = {'shelf' : Shelf, 'deck' : Deck, 'card' : Card}
        TargetModel = model_map.get(item_type)

        if not TargetModel:
            return Response({"detail": "Invalid content_type"}, status=status.HTTP_400_BAD_REQUEST)

        ctype = ContentType.objects.get_for_model(TargetModel)
        TaggedItem.objects.filter(
            tag_id=tag_id,
            tag__user=request.user,
            content_type=ctype,
            object_id=obj_id
        ).delete()

        return Response({"status": "unassigned"})

class TrashViewSet(viewsets.ViewSet):
    permission_classes = [IsAuthenticated]

    def list(self, request):
        shelves = Shelf.objects.filter(user=request.user, is_deleted=True)
        decks = Deck.objects.filter(user=request.user, is_deleted=True)
        cards = Card.objects.filter(user=request.user, is_deleted=True)

        return Response({
            'shelves': ShelfSerializer(shelves, many=True).data,
            'decks': DeckSerializer(decks, many=True).data,
            'cards': CardSerializer(cards, many=True).data
        })

    @action(detail=False, methods=['post'], url_path='(?P<item_type>[^/.]+)/(?P<item_id>[^/.]+)/restore')
    def restore(self, request, item_type=None, item_id=None):
        model_map = {'shelf' : Shelf, 'deck' : Deck, 'card' : Card}
        TargetModel = model_map.get(item_type)
        if not TargetModel:
            return Response({"detail": "Invalid content_type"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            item = TargetModel.objects.get(id=item_id, user=request.user, is_deleted=True)
            item.is_deleted = False
            item.save()
            return Response({"status": "restored"})
        except TargetModel.DoesNotExist:
            raise NotFound("Target object not found.")

    @action(detail=False, methods=['delete'], url_path='(?P<item_type>[^/.]+)/(?P<item_id>[^/.]+)/permanent')
    def permanent_delete(self, request, item_type=None, item_id=None):
        model_map = {'shelf' : Shelf, 'deck' : Deck, 'card' : Card}
        TargetModel = model_map.get(item_type)
        if not TargetModel:
            return Response({"detail": "Invalid content_type"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            item = TargetModel.objects.get(id=item_id, user=request.user, is_deleted=True)
            item.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except TargetModel.DoesNotExist:
            raise NotFound("Deleted item not found.")
















