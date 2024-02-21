from auth_api.models import User
from django.contrib.auth import login, authenticate, logout
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
from django.core.exceptions import ValidationError
from django.core.validators import validate_email
from django.contrib.auth.hashers import make_password, check_password

@csrf_exempt
def register(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        username = data.get('username')
        password = data.get('password')
        email = data.get('email').lower()
        first_name = data.get('first_name')
        last_name = data.get('last_name')

        try:
            validate_email(email)
        except ValidationError:
            return JsonResponse({'message': '* Invalid email address', 'errorType': 1}, status=409)

        if not (1 <= len(username) <= 30) or not any(char.isupper() for char in username) or not any(char.isdigit() for char in username):
            return JsonResponse({'message': '* Username must be between 1 and 15 characters and contain at least one uppercase letter and one digit', 'errorType': 2}, status=409)

        if not (8 <= len(password)) or not any(char.isupper() for char in password) or not any(char.isdigit() for char in password):
            return JsonResponse({'message': '* Password must be at least 8 characters and contain at least one uppercase letter and one digit', 'errorType': 3}, status=409)

        if not User.objects.filter(username=username).exists():
            if not User.objects.filter(email=email).exists():
                user = User.objects.create_user(username=username, email=email, password=password, first_name=first_name, last_name=last_name)
                return JsonResponse({'message': '* Registration successful', 'user': username})
            else:
                return JsonResponse({'message': '* Email already taken', 'errorType': 4}, status=409)
        elif not User.objects.filter(email=email).exists():
            return JsonResponse({'message': '* Username already taken', 'errorType': 5}, status=409)
        else:
            return JsonResponse({'message': '* Username and email already taken', 'errorType': 6}, status=409)
    else:
        return JsonResponse({'message': 'Invalid request method'}, status=400)

@csrf_exempt
def login_view(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        username = data.get('username')
        password = data.get('password')

        user = authenticate(request, username=username, password=password)

        if user is not None:
            login(request, user)
            return JsonResponse({'message': 'Login successful', 'user': username})
        else:
            return JsonResponse({'message': 'Invalid credentials'}, status=401)
    else:
        return JsonResponse({'message': 'Invalid request method'}, status=400)


@csrf_exempt
def logout_view(request):
    logout(request)
    return JsonResponse({'message': 'Logout successful', 'user': ''})
