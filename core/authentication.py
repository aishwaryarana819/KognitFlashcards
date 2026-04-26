import jwt
from django.conf import settings
from rest_framework import authentication
from rest_framework import exceptions
from django.contrib.auth.models import User

class SupabaseJWTAuthentication(authentication.BaseAuthentication):
    def authenticate(self, request):
        auth_header = request.headers.get('Authorization')

        if not auth_header or not auth_header.startswith('Bearer '):
            return None

        token = auth_header.split(' ')[1]

        try:
            payload = jwt.decode(
                token,
                settings.SUPABASE_JWT_SECRET,
                algorithms=['HS256'],
                audience="authenticated"
            )
        except jwt.ExpiredSignatureError:
            raise exceptions.AuthenticationFailed('Token has expired.')
        except jwt.InvalidTokenError:
            raise exceptions.AuthenticationFailed('Invalid token.')

        supabase_uid = payload.get('sub')
        if not supabase_uid:
            raise exceptions.AuthenticationFailed('User identifier not found in token.')

        try:
            from core.models import Profile
            profile = Profile.objects.get(supabase_uid=supabase_uid)
            user = profile.user
        except Exception:
            user = None

        return (user, payload)

REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'core.authentication.SupabaseJWTAuthentication',
        'rest_framework.authentication.SessionAuthentication',
    ],
}









