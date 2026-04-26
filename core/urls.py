from django.urls import path
from . import views

urlpatterns = [
    path('auth/check-username', views.check_username, name='check-username'),
    path('auth/finalize-profile', views.finalize_profile, name='finalize-profile'),
    path('auth/hackclub/callback', views.hackclub_callback, name='hackclub-callback'),
]