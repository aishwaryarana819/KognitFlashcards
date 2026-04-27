import profile
import requests
import secrets
import string
import jwt
from django.conf import settings
from supabase import Client, create_client
from django.shortcuts import render

from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.models import User
from .models import Profile

@api_view(['GET'])
@permission_classes([AllowAny])

def check_username(request):
    username = request.query_params.get('q', '').strip().lower()

    if not username:
        return Response({'error': 'No username provided'}, status=status.HTTP_400_BAD_REQUEST)
    if len(username) < 4 or len(username) > 12:
        return Response({"error" : "Username must be between 4 and 12 characters long"}, status=status.HTTP_400_BAD_REQUEST)

    import re
    if not re.match(r'^[a-z0-9_-]{4,12}$', username):
        return Response({"error": "Invalid characters used. It must be letters, numbers, underscore or hyphen."}, status=status.HTTP_400_BAD_REQUEST)

    is_taken = User.objects.filter(username__iexact=username).exists()

    return Response({"available": not is_taken}, status=status.HTTP_200_OK)

@api_view(['POST'])
@permission_classes([AllowAny])

def finalize_profile(request):
    if not request.auth:
        return Response({'error': 'No valid Supabase token provided.'}, status=status.HTTP_401_UNAUTHORIZED)

    data = request.data
    username = data.get('username')
    first_name = data.get('firstName', '')
    last_name = data.get('lastName' ,'')
    region = data.get('region', '')
    domain = data.get('domain', '')

    if not username:
        return Response({'error': 'No username provided'}, status=status.HTTP_400_BAD_REQUEST)

    if User.objects.filter(username__iexact=username).exists():
        return Response({'error': 'Username already exists'}, status=status.HTTP_400_BAD_REQUEST)

    supabase_uid = request.auth.get('sub')
    email = request.auth.get('email', '')

    if not supabase_uid:
        return Response({'error': 'Invalid token payload'}, status=status.HTTP_401_UNAUTHORIZED)

    try:
        profile = Profile.objects.get(supabase_uid=supabase_uid)
        if username.lower() != profile.user.username.lower() and User.objects.filter(username__iexact=username).exists():
            return Response({'error': 'Username already exists'}, status=status.HTTP_400_BAD_REQUEST)

        user = profile.user
        user.username = username
        user.first_name = first_name
        user.last_name = last_name
        user.save()

        profile.region = region
        profile.domain = domain
        profile.save()

    except Profile.DoesNotExist:
        if User.objects.filter(username__iexact=username).exists():
            return Response({'error': 'Username already exists'}, status=status.HTTP_400_BAD_REQUEST)

        user = User.objects.create(
            username=username,
            first_name=first_name,
            last_name=last_name,
            email=email
        )
        Profile.objects.create(
            user=user,
            supabase_uid=supabase_uid,
            region=region,
            domain=domain
        )
    return Response({"message": "Profile finalized successfully."}, status=status.HTTP_200_OK)

@api_view(['POST'])
@permission_classes([AllowAny])

def hackclub_callback(request):
    import traceback
    try:
        return _hackclub_callback_inner(request)
    except Exception as e:
        tb = traceback.format_exc()
        return Response({"error": str(e), "traceback": tb}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

def _hackclub_callback_inner(request):
    code = request.data.get('code')
    if not code:
        return Response({"error": "Authorization code is required."}, status=status.HTTP_400_BAD_REQUEST)

    """
    code = request.data.get('code')
    if not code:
        return Response({"error": "Authorization code is required."}, status=status.HTTP_400_BAD_REQUEST)
    """

    token_url = "https://auth.hackclub.com/oauth/token"

    dynamic_redirect_uri = request.data.get('redirect_uri')

    token_data = {
        "client_id": settings.HACKCLUB_CLIENT_ID,
        "client_secret": settings.HACKCLUB_CLIENT_SECRET,
        "redirect_uri": dynamic_redirect_uri,
        "code": code,
        "grant_type": "authorization_code"
    }

    token_res = requests.post(token_url, json=token_data)
    if not token_res.ok:
        return Response({"error": "Failed to exchange HackClub token"}, status=status.HTTP_400_BAD_REQUEST)

    tokens = token_res.json()
    id_token = tokens.get('id_token')

    if not id_token:
        return Response({"error": "No ID token returned by HackClub"}, status=status.HTTP_400_BAD_REQUEST)

    try:
        decoded_id = jwt.decode(id_token, options={"verify_signature": False})
    except Exception:
        return Response({"error": "Invalid HackClub ID token"}, status=status.HTTP_400_BAD_REQUEST)

    email = decoded_id.get('email')

    if not email:
        return Response({"error": "Valid email required from HackClub"}, status=status.HTTP_400_BAD_REQUEST)

    supabase_admin: Client = create_client(settings.SUPABASE_URL, settings.SUPABASE_SERVICE_ROLE_KEY)

    alphabet = string.ascii_letters + string.digits + string.punctuation
    secure_password = ''.join(secrets.choice(alphabet) for i in range(32))

    admin_auth = supabase_admin.auth.admin
    try:
        user_response = admin_auth.create_user({
            "email": email,
            "password": secure_password,
            "email_confirm": True
        })
    except Exception as e:
        try:
            users = admin_auth.list_users()
            existing_user = next((u for u in users if u.email == email), None)

            if existing_user:
                admin_auth.update_user_by_id(existing_user.id, {
                    "password": secure_password,
                    "email_confirm": True
                })
            else:
                return Response({"error": "Failed to map HackClub user to Supabase"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        except Exception as inner_e:
            return Response({"error": str(inner_e)},
                            status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    try:
        session_data = supabase_admin.auth.sign_in_with_password({
            "email": email,
            "password": secure_password
        })

        return Response({
            "access_token": session_data.session.access_token,
            "refresh_token": session_data.session.refresh_token,
            "user": session_data.user.model_dump()
        }, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({"error": "Failed to generate Supabase session: " + str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

