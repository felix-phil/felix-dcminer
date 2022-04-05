from django.db import models
from django.contrib.auth import get_user_model
from djangoflutterwave.models import FlwPlanModel

User = get_user_model()


class Payment(models.Model):
    user = models.OneToOneField(
        User, related_name="payment_user", on_delete=models.CASCADE)
    txRef = models.CharField(max_length=250)
    transactionComplete = models.BooleanField(default=False)
    refKey = models.CharField(max_length=100, null=True, blank=True)
    transaction_id = models.CharField(max_length=50, null=True)
    payment_type = models.ForeignKey(
        FlwPlanModel, on_delete=models.SET_NULL, related_name='subscription', null=True)

    date_created = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return "{} payment details".format(self.user.email)

    def get_amount_paid(self):
        return self.payment_type.amount

    def get_transaction_ref(self):
        return self.refKey

    def get_transaction_status(self):
        return self.transactionComplete


class BillingInfo(models.Model):
    user = models.OneToOneField(
        User, related_name='user_billing', on_delete=models.CASCADE)
    fullname = models.CharField(max_length=250, null=False, blank=True)
    email = models.EmailField(blank=True)
    address1 = models.CharField(max_length=255)
    address2 = models.CharField(max_length=255, blank=True)
    city = models.CharField(max_length=100, blank=True)
    phone = models.CharField(max_length=100, blank=True)
    zipCode = models.CharField(max_length=100, blank=True)
    cardno = models.CharField(max_length=100, blank=True)
    cardname = models.CharField(max_length=255, blank=True)
    cvv = models.CharField(max_length=100, blank=True)
    expirydate = models.CharField(max_length=100, blank=True)
    date_created = models.DateTimeField(auto_now_add=True, blank=True)
    account_number = models.CharField(max_length=25, null=False, blank=True)
    bank = models.CharField(max_length=100, null=False, blank=True)

    def __str__(self):
        return "{} billing info".format(self.user.email)

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)


class Earning(models.Model):

    UPKEEP_REFERRAL_EARNING = 800
    MEDIUM_REFERRAL_EARNING = 4000
    LARGE_REFERRAL_EARNING = 15000

    EARN_TYPE = (
        ('A', 'ADS'),
        ('R', 'REFERALS')
    )
    user = models.ForeignKey(
        User, on_delete=models.SET_NULL, null=True, blank=True)
    earn_type = models.CharField(
        choices=EARN_TYPE, max_length=2, null=True, blank=True)
    amount = models.FloatField()

    date_created = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.email} earning"


class Withdraw(models.Model):
    MINIMUM_WITHDRAWAL_AMOUNT = 1000

    user = models.ForeignKey(User, on_delete=models.CASCADE)
    is_approved = models.BooleanField(default=False)
    is_paid = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    amount = models.FloatField()
    amount_approved = models.FloatField(default=0.00)

    date_requested = models.DateTimeField(auto_now_add=True)
    date_approved = models.DateTimeField(null=True, blank=True)
    date_paid = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return f"{self.user.email} withdrawal"
