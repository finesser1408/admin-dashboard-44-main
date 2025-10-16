from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from django.contrib.auth import get_user_model
from .serializers import UserSerializer, UserUpdateSerializer
from rest_framework.permissions import IsAuthenticated, IsAdminUser

User = get_user_model()

class UserViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows users to be viewed or edited.
    """
    queryset = User.objects.all().order_by('-date_joined')
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated, IsAdminUser]

    def get_serializer_class(self):
        if self.action in ['update', 'partial_update']:
            return UserUpdateSerializer
        return UserSerializer

    @action(detail=True, methods=['post'])
    def suspend(self, request, pk=None):
        """Suspend a user account"""
        user = self.get_object()
        if user.is_superuser:
            return Response(
                {'error': 'Cannot suspend superuser account'},
                status=status.HTTP_403_FORBIDDEN
            )
        user.is_active = False
        user.save()
        return Response({'status': 'user suspended'})

    @action(detail=True, methods=['post'])
    def unsuspend(self, request, pk=None):
        """Unsuspend a user account"""
        user = self.get_object()
        user.is_active = True
        user.save()
        return Response({'status': 'user unsuspended'})

    @action(detail=True, methods=['get'])
    def stats(self, request, pk=None):
        """Get user statistics"""
        user = self.get_object()
        stats = {
            'total_orders': 0,  # Replace with actual order count
            'revenue': 0,      # Replace with actual revenue calculation
            'user_id': user.id,
            'username': user.username
        }
        return Response(stats)
