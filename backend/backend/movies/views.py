from django.shortcuts import render

# Create your views here.
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework import status
from .models import Movie, Show
from .serializers import MovieSerializer, ShowSerializer
from .permissions import IsTheater


# 🎥 CREATE MOVIE (THEATER ONLY)
@api_view(['POST'])
@permission_classes([IsAuthenticated, IsTheater])
def create_movie(request):
    serializer = MovieSerializer(data=request.data)

    if serializer.is_valid():
        serializer.save(created_by=request.user)
        return Response(serializer.data, status=201)

    return Response(serializer.errors, status=400)


# 📃 GET ALL MOVIES (PUBLIC)
@api_view(['GET'])
@permission_classes([AllowAny])
def get_movies(request):
    movies = Movie.objects.all()
    serializer = MovieSerializer(movies, many=True)
    return Response(serializer.data)


# 🎭 CREATE SHOW (THEATER ONLY)
@api_view(['POST'])
@permission_classes([IsAuthenticated, IsTheater])
def create_show(request):
    data = request.data.copy()
    data['available_seats'] = data.get('total_seats')

    serializer = ShowSerializer(data=data)

    if serializer.is_valid():
        serializer.save(theater=request.user)
        return Response(serializer.data, status=201)

    return Response(serializer.errors, status=400)


# 📃 GET SHOWS BY MOVIE
@api_view(['GET'])
@permission_classes([AllowAny])
def get_shows(request, movie_id):
    shows = Show.objects.filter(movie_id=movie_id)
    serializer = ShowSerializer(shows, many=True)
    return Response(serializer.data)


# ❌ DELETE SHOW (THEATER ONLY - OWN SHOW)
@api_view(['DELETE'])
@permission_classes([IsAuthenticated, IsTheater])
def delete_show(request, show_id):
    try:
        show = Show.objects.get(id=show_id, theater=request.user)
    except Show.DoesNotExist:
        return Response({"error": "Show not found"}, status=404)

    show.delete()
    return Response({"message": "Show deleted"})