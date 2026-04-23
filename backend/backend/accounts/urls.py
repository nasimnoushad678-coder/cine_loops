from django.urls import path
from .views import profile_view, register_view, login_view

urlpatterns = [
    path('register/', register_view),
    path('login/', login_view),
    path('profile/', profile_view), 
]