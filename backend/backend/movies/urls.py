from django.urls import path
from .views import *

urlpatterns = [
    path('movies/', get_movies),
    path('movies/create/', create_movie),
    path('shows/create/', create_show),
    path('shows/<int:movie_id>/', get_shows),
    path('shows/delete/<int:show_id>/', delete_show),
]