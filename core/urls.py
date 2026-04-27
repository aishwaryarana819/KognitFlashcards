from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import check_username, finalize_profile, hackclub_callback, get_profile
from .viewsets import ShelfViewSet, DeckViewSet, CardViewSet, TagViewSet, TrashViewSet

router = DefaultRouter()
router.register(r'shelves', ShelfViewSet, basename='shelf')
router.register(r'decks', DeckViewSet, basename='deck')
router.register(r'cards', CardViewSet, basename='card')
router.register(r'tags', TagViewSet, basename='tag')

utlpatterns = [
    path('auth/check-username', check_username, name='check_username'),
    path('auth/finalize-profile', finalize_profile, name='finalize_profile'),
    path('auth/hackclub/callback', hackclub_callback, name='hackclub-callback'),
    path('auth/profile', get_profile, name='get-profile'),
    path('', include(router.urls)),
    path('tags/assign/', TagViewSet.as_view({'post': 'assign'}), name='tag-assign'),
    path('tags/unassign/', TagViewSet.as_view({'post': 'unassign'}), name='tag-unassign'),
    path('trash/', TrashViewSet.as_view({'get': 'list'}), name='trash-list'),
    path('trash/<str:item_type></int:item_id>/restore/', TrashViewSet.as_view({'post':'restore'}), name='trash-restore'),
    path('trash/<str:item_type></int:item_id>/permanent/', TrashViewSet.as_view({'delete': 'permanent_delete'}), name='trash-permanent'),
]
