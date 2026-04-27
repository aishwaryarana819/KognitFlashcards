from rest_framework import serializers
from .models import Shelf, Deck, Card, Tag, TaggedItem, ShelfDeck, DeckCard, CardReview, ReviewLog
from django.contrib.contenttypes.models import ContentType

class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = ['id', 'name', 'color']

class CardReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = CardReview
        fields = ['stability', 'difficulty', 'state', 'due', 'reps', 'lapses']

class ReviewLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = ReviewLog
        fields = '__all__'

class CardSerializer(serializers.ModelSerializer):
    fsrs_state = CardReviewSerializer(read_only=True)
    tags = serializers.SerializserMethodField()
    deck_ids = serializers.SerializerMethodField()

    class Meta:
        model = Card
        fields = ['id', 'front', 'back', 'card_type', 'image_url', 'notes', 'is_suspended', 'fsrs_state', 'tags', 'deck_ids', 'created_at', 'updated_at']

        def get_tags(self, obj):
            ctype = ContentType.objects.get_for_model(Card)
            tag_ids = TaggedItem.objects.filter(content_type=ctype, object_id=obj.id).values_list('tag_id', flat=True)
            tags = Tag.objects.filter(id__in=tag_ids)
            return TagSerializer(tags, many=True).data

        def get_deck_ids(self, obj):
            return list(DeckCard.objects.filter(card=obj).values_list('deck_id', flat=True))

class DeckSerializer(serializers.ModelSerializer):
    tags = serializers.SerializerMethodField()
    shelf_ids = serializers.SerializerMethodField()
    card_count = serializers.IntegerField(read_only=True)

    class Meta:
        model = Deck
        fields = ['id', 'name', 'description', 'color', 'icon', 'position', 'is_archived', 'tags', 'shelf_ids', 'card_count', 'created_at', 'updated_at']

    def get_tags(self, obj):
        ctype = ContentType.objects.get_for_model(Deck)
        tag_ids = TaggedItem.objects.filter(content_type=ctype, object_id=obj.id).values_list('tag_id', flat=True)
        tags = Tag.objects.filter(id__in=tag_ids)
        return TagSerializer(tags, many=True).data

    def get_shelf_ids(self, obj):
        return list(ShelfDeck.objects.filter(deck=obj).values_list('shelf_id', flat=True))

class ShelfSerializer(serializers.ModelSerializer):
    tags = serializers.SerializerMethodField()
    deck_count = serializers.IntegerField(read_only=True)

    class Meta:
        model = Shelf
        fields = ['id', 'name', 'description', 'color', 'icon', 'position', 'is_archived', 'tags', 'deck_count', 'created_at', 'updated_at']

        def get_tags(self, obj):
            ctype = ContentType.objects.get_for_model(Shelf)
            tag_ids = TaggedItem.objects.filter(content_type=ctype, object_id=obj.id).values_list('tag_id', flat=True)
            tags = Tag.objects.filter(id__in=tag_ids)
            return TagSerializer(tags, many=True).data

class ShelfCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Shelf
        fields = ['name', 'description', 'color', 'icon']

class DeckCreateSerializer(serializers.ModelSerializer):
    shelf_ids = serializers.ListField(child=serializers.IntegerField(), required=False, write_only=True)

    class Meta:
        model = Deck
        fields = ['name', 'description', 'color', 'icon', 'shelf_ids']

class CardCreateSerializer(serializers.ModelSerializer):
    deck_ids = serializers.ListField(child=serializers.IntegerField(), required=False, write_only=True)

    class Meta:
        model = Card
        fields = ['front', 'back', 'card_type', 'image_url', 'notes', 'deck_ids']














