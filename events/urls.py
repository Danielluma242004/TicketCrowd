from django.urls import path
from .views import *

app_name = 'events'

urlpatterns = [
    path('users/', UserList.as_view(), name='users-list'),
    path('users/<int:pk>/', UserDetail.as_view(), name='user-detail'),
    path('users/username/<str:username>/', UserID.as_view(), name='user-by-username'),
    path('events/', EventList.as_view(), name='events-list'),
    path('events/<int:pk>/', EventDetail.as_view(), name='event-detail'),
    path('comments/', CommentList.as_view(), name='comments-list'),
    path('comments/<int:pk>/', CommentDetail.as_view(), name='comment-detail'),
    path('comments/event/<int:pk>/', CommentEvent.as_view(), name='comment-detail'),
    path('participants/', ParticipantList.as_view(), name='participant-list'),
    path('participants/<int:pk>/', ParticipantDetail.as_view(), name='participant-detail'),
    path('participants/event/<int:pk>/', ParticipantEvent.as_view(), name='participant-detail'),

]