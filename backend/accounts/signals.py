from django.db.models.signals import post_save
from django.contrib.auth import get_user_model
from django.shortcuts import get_object_or_404
from django.dispatch import receiver
from accounts.models import ProfileReferral, Referrals, ProfilePicture
from payments.models import BillingInfo
from accounts.utils import generateUniqueReferral
import uuid
import base64
User = get_user_model()


@receiver(post_save, sender=User)
def create_profile_referral(sender, instance, created, **kwargs):
    if created:
        # ProfileReferral.objects.create(user=instance, referal_code=base64.urlsafe_b64encode(
        #     uuid.uuid4().bytes.rstrip()).decode('utf-8')[:10].upper())
        ProfileReferral.objects.create(
            user=instance, referal_code=generateUniqueReferral())


@receiver(post_save, sender=User)
def create_billing_info(sender, instance, created, **kwargs):
    if created:
        BillingInfo.objects.create(user=instance)


@receiver(post_save, sender=User)
def create_profile_picture(sender, instance, created, **kwargs):
    if created:
        ProfilePicture.objects.create(user=instance)


@receiver(post_save, sender=User)
def save_profile_referral(sender, instance, **kwargs):
    instance.profile.save()


@receiver(post_save, sender=User)
def create_referral(sender, instance, created, **kwargs):
    if created:
        if instance.referrer is not None:
            try:
                referrer_profile = get_object_or_404(
                    ProfileReferral, referal_code=instance.referrer)

                referrer_user = get_object_or_404(
                    User, email=referrer_profile.user.email)
                Referrals.objects.create(
                    referrer=referrer_user, referred=instance)
            except referrer_user.DoesNotExist:
                pass


# @receiver(post_save, sender=User)
# def save_referral(sender, instance, **kwargs):
#     instance.user_referrer.save()
