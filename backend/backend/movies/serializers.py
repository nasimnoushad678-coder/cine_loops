from rest_framework import serializers
from .models import Movie, Show


class MovieSerializer(serializers.ModelSerializer):
    class Meta:
        model = Movie
        fields = '__all__'
        read_only_fields = ['created_by']


class ShowSerializer(serializers.ModelSerializer):
    class Meta:
        model = Show
        fields = '__all__'
        read_only_fields = ['theater', 'available_seats']