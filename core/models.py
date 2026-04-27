from django.db import models
from django.contrib.auth.models import User
from django.contrib.contenttypes.models import ContentType
from django.contrib.contenttypes.fields import GenericForeignKey

class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    supabase_uid = models.UUIDField(unique=True, db_index=True)

    region = models.CharField(max_length=100, blank=True, null=True)
    domain = models.CharField(max_length=100, blank=True, null=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.user.username}'s Profile"

class SoftDeleteModel(models.Model):
    is_deleted = models.BooleanField(default=False)
    deleted_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        abstract = True

class Shelf (SoftDeleteModel):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='shelves')
    name = models.CharField(max_length=128)
    description = models.TextField(blank=True)
    color = models.CharField(max_length=7, default="#B193DC")
    icon = models.CharField(max_length=32, default="library-outline")
    position = models.IntegerField(default=0)
    is_archived = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Shelf: {self.name}"

class Deck(SoftDeleteModel):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='decks')
    name = models.CharField(max_length=128)
    description = models.TextField(blank=True)
    color = models.CharField(max_length=7, default="#B193DC")
    icon = models.CharField(max_length=32, default="layers-outline")
    position = models.IntegerField(default=0)
    is_archived = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Deck: {self.name}"

class Card(SoftDeleteModel):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='cards')
    card_type = models.CharField(
        max_length=16,
        choices=[('basic', 'Basic'), ('reversed', 'Reversed')],
        default='basic',
    )
    front = models.TextField()
    back = models.TextField()
    image_url = models.URLField(blank=True, null=True)
    notes = models.TextField(blank=True)
    is_suspended = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Card: {self.card_type}"

class ShelfDeck(models.Model):
    shelf = models.ForeignKey(Shelf, on_delete=models.CASCADE, related_name='shelf_decks')
    deck = models.ForeignKey(Deck, on_delete=models.CASCADE, related_name='deck_shelves')
    position = models.IntegerField(default=0)
    added_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('shelf', 'deck')

class DeckCard(models.Model):
    deck = models.ForeignKey(Deck, on_delete=models.CASCADE, related_name='deck_cards')
    card = models.ForeignKey(Card, on_delete=models.CASCADE, related_name='card_decks')
    position = models.IntegerField(default=0)
    added_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('deck', 'card')

class CardReview(models.Model):
    card = models.OneToOneField(Card, on_delete=models.CASCADE, related_name='fsrs_state')
    stability = models.FloatField(default=0.0)
    difficulty = models.FloatField(default=0.0)
    elapsed_days = models.IntegerField(default=0)
    scheduled_days = models.IntegerField(default=0)
    reps = models.IntegerField(default=0)
    lapses = models.IntegerField(default=0)
    state = models.IntegerField(default=0)
    due = models.DateTimeField(auto_now_add=True)
    last_review = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return f"FSRS: {self.card.front[:20]}"

class ReviewLog(models.Model):
    card = models.ForeignKey(Card, on_delete=models.CASCADE, related_name='review_logs')
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='review_logs')
    rating = models.IntegerField()
    state = models.IntegerField()
    elapsed_days = models.IntegerField()
    reviewed_at = models.DateTimeField(auto_now_add=True)

class Tag(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='tags')
    name = models.CharField(max_length=64)
    color = models.CharField(max_length=7, default="#B193DC")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'name')

    def __str__(self):
        return self.name

class TaggedItem(models.Model):
    tag = models.ForeignKey(Tag, on_delete=models.CASCADE, related_name='tagged_items')
    content_type = models.ForeignKey(ContentType, on_delete=models.CASCADE)
    object_id = models.PositiveIntegerField()
    content_objecct = GenericForeignKey('content_type', 'object_id')

    class Meta:
        unique_together = ('tag', 'content_type', 'object_id')

