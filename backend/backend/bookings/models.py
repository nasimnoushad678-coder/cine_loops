
# Create your models here.
from django.db import models
from django.conf import settings
from movies.models import Show

User = settings.AUTH_USER_MODEL


class Booking(models.Model):
    STATUS_CHOICES = (
        ('booked', 'Booked'),
        ('cancelled', 'Cancelled'),
    )

    user = models.ForeignKey(User, on_delete=models.CASCADE)
    show = models.ForeignKey(Show, on_delete=models.CASCADE)
    seats = models.IntegerField()
    total_price = models.DecimalField(max_digits=8, decimal_places=2)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='booked')
    booked_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user} - {self.show}"