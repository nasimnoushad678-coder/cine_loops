from django.urls import path
from .views import *

urlpatterns = [
    path('book/', create_booking),
    path('my-bookings/', my_bookings),
    path('cancel/<int:booking_id>/', cancel_booking),
]