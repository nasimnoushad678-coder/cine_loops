from django.shortcuts import render

import stripe
from django.conf import settings
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from django.db import transaction  # ✅ ADD THIS
from movies.models import Show
from bookings.models import Booking  # ✅ ADD THIS

stripe.api_key = settings.STRIPE_SECRET_KEY


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_checkout_session(request):
    user = request.user
    show_id = request.data.get("show")
    seats = int(request.data.get("seats"))

    try:
        show = Show.objects.get(id=show_id)
    except Show.DoesNotExist:
        return Response({"error": "Show not found"}, status=404)

    if show.available_seats < seats:
        return Response({"error": "Not enough seats"}, status=400)

    session = stripe.checkout.Session.create(
        payment_method_types=['card'],
        line_items=[{
            'price_data': {
                'currency': 'inr',
                'product_data': {
                    'name': f"{show.movie.title} Ticket",
                },
                'unit_amount': int(show.price * seats * 100),
            },
            'quantity': 1,
        }],
        mode='payment',
        success_url='http://localhost:5173/success?session_id={CHECKOUT_SESSION_ID}',
        cancel_url='http://localhost:5173/cancel',

        metadata={
            "user_id": user.id,
            "show_id": show.id,
            "seats": seats
        }
    )

    return Response({"id": session.id})


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def verify_payment(request):
    session_id = request.data.get("session_id")

    try:
        session = stripe.checkout.Session.retrieve(session_id)
    except Exception:
        return Response({"error": "Invalid session"}, status=400)

    # ✅ Check payment status
    if session.payment_status != "paid":
        return Response({"error": "Payment not completed"}, status=400)

    user_id = session.metadata["user_id"]
    show_id = session.metadata["show_id"]
    seats = int(session.metadata["seats"])

    with transaction.atomic():
        show = Show.objects.select_for_update().get(id=show_id)

        if show.available_seats < seats:
            return Response({"error": "Seats unavailable"}, status=400)

        show.available_seats -= seats
        show.save()

        booking = Booking.objects.create(
            user_id=user_id,
            show=show,
            seats=seats,
            total_price=session.amount_total / 100
        )

    return Response({
        "message": "Booking confirmed",
        "booking_id": booking.id
    })