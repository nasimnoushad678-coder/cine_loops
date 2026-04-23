from django.shortcuts import render

# Create your views here.
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from django.db import transaction
from django.utils import timezone
from datetime import timedelta

from .models import Booking
from .serializers import BookingSerializer
from movies.models import Show


# 🎟 CREATE BOOKING
@api_view(['POST'])
@permission_classes([IsAuthenticated])
@transaction.atomic
def create_booking(request):
    user = request.user
    show_id = request.data.get('show')
    seats = int(request.data.get('seats'))

    try:
        show = Show.objects.select_for_update().get(id=show_id)
    except Show.DoesNotExist:
        return Response({"error": "Show not found"}, status=404)

    # 🚫 Prevent overbooking
    if show.available_seats < seats:
        return Response({"error": "Not enough seats"}, status=400)

    # 💰 Calculate price
    total_price = show.price * seats

    # 🔒 Lock seats
    show.available_seats -= seats
    show.save()

    booking = Booking.objects.create(
        user=user,
        show=show,
        seats=seats,
        total_price=total_price
    )

    return Response(BookingSerializer(booking).data, status=201)


# 📃 GET USER BOOKINGS
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def my_bookings(request):
    bookings = Booking.objects.filter(user=request.user)
    serializer = BookingSerializer(bookings, many=True)
    return Response(serializer.data)


# ❌ CANCEL BOOKING (WITH TIME RULE)
@api_view(['POST'])
@permission_classes([IsAuthenticated])
@transaction.atomic
def cancel_booking(request, booking_id):
    try:
        booking = Booking.objects.select_for_update().get(
            id=booking_id,
            user=request.user
        )
    except Booking.DoesNotExist:
        return Response({"error": "Booking not found"}, status=404)

    if booking.status == 'cancelled':
        return Response({"error": "Already cancelled"}, status=400)

    show_time = booking.show.show_time
    now = timezone.now()

    # ⏰ Cancel only before 3 hours
    if show_time - now < timedelta(hours=3):
        return Response({"error": "Cannot cancel within 3 hours"}, status=400)

    # 🔁 Restore seats
    show = booking.show
    show.available_seats += booking.seats
    show.save()

    booking.status = 'cancelled'
    booking.save()

    return Response({"message": "Booking cancelled"})