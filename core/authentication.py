# Used AI

from django.conf import settings
from rest_framework import authentication
from rest_framework import exceptions
from supabase import create_client, Client


class SupabaseJWTAuthentication(authentication.BaseAuthentication):
    def authenticate_header(self, request):
        return 'Bearer realm="api"'

    def authenticate(self, request):
        auth_header = request.headers.get('Authorization')

        if not auth_header or not auth_header.startswith('Bearer '):
            return None

        token = auth_header.split(' ')[1]

        if not token or token == "undefined":
            return None

        # 1. Initialize Supabase Client
        supabase: Client = create_client(settings.SUPABASE_URL, settings.SUPABASE_SERVICE_ROLE_KEY)

        try:
            # 2. Automatically cryptographically verify the token and get the user
            user_res = supabase.auth.get_user(token)
            supabase_user = user_res.user
            if not supabase_user:
                raise exceptions.AuthenticationFailed('Invalid token.')

            supabase_uid = supabase_user.id
            payload = {'sub': supabase_uid, 'email': supabase_user.email}

        except Exception as e:
            raise exceptions.AuthenticationFailed(f'Supabase rejected token: {str(e)}')

        # 3. Securely map them to our Django Model
        try:
            from core.models import Profile
            profile = Profile.objects.get(supabase_uid=supabase_uid)
            user = profile.user
        except Exception:
            user = None

        return (user, payload)
