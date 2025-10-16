from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework.authtoken import views as auth_views

# Import views from myapp
from myapp.views_auth import login_view, check_auth

# Initialize the router
router = DefaultRouter()

# Only register viewsets if they exist
# router.register(r'users', views.UserViewSet, basename='user')
# router.register(r'posts', views.PostViewSet, basename='post')

urlpatterns = [
    # Admin site
    path('admin/', admin.site.urls),
    
    # API endpoints
    path('api/', include(router.urls)),
    path('api/auth/login/', login_view, name='login'),
    path('api/auth/check/', check_auth, name='check_auth'),
    path('api-token-auth/', auth_views.obtain_auth_token, name='api_token_auth'),
    
    # Include app URLs
    path('', include('myapp.urls')),
]