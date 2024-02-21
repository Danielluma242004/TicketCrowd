from django.contrib import admin
from .models import *
from auth_api.models import User

admin.site.register(Event)
admin.site.register(User)
admin.site.register(Comment)
admin.site.register(Participant)