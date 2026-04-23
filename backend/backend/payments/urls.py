from django.urls import path
from .views import create_checkout_session, verify_payment

urlpatterns = [
    path('create-session/', create_checkout_session),
    path('verify-payment/', verify_payment),
]