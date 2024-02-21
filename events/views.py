from rest_framework import generics, status
from rest_framework.response import Response
from .models import Event, Comment, Participant
from auth_api.models import User
from .serializers import EventSerializer, UserSerializer, CommentSerializer, ParticipantSerializer

class UserList(generics.ListCreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer

class UserDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer

class UserID(generics.RetrieveUpdateDestroyAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer

    def get_object(self):
        user_username = self.kwargs['username']
        return User.objects.get(username=user_username)

class EventList(generics.ListCreateAPIView):
    queryset = Event.objects.all()
    serializer_class = EventSerializer

class EventDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Event.objects.all()
    serializer_class = EventSerializer

class CommentList(generics.ListCreateAPIView):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer

class CommentDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer

class CommentEvent(generics.ListCreateAPIView):
    serializer_class = CommentSerializer

    def get_queryset(self):
        event_id = self.kwargs['pk']
        return Comment.objects.filter(event__id=event_id)
    
class ParticipantList(generics.ListCreateAPIView):
    queryset = Participant.objects.all()
    serializer_class = ParticipantSerializer

    def perform_create(self, serializer):
        user_id = self.request.data.get('user', None)

        if Participant.objects.filter(user=user_id).exists():
            response_data = {'detail': 'User is already participating'}
            return Response(response_data, status=status.HTTP_400_BAD_REQUEST)
        serializer.save()

class ParticipantDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Participant.objects.all()
    serializer_class = ParticipantSerializer
    
class ParticipantEvent(generics.ListCreateAPIView):
    serializer_class = ParticipantSerializer

    def get_queryset(self):
        event_id = self.kwargs['pk']
        return Participant.objects.filter(event__id=event_id)
