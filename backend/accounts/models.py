from django.shortcuts import get_object_or_404
from django.db import models
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, BaseUserManager
import uuid
import base64
from django.contrib.auth import get_user_model
from PIL import Image
# from accounts.models import Referrals
# User = get_user_model()


class UserAccountManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError('Users Must Have an E-mail Address')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save()

        return user

    def create_superuser(self, email, first_name, password=None, referrer="", **kwargs):
        if not email:
            raise ValueError('Users Must Have an E-mail Address')
        email = self.normalize_email(email)
        user = self.model(email=email, first_name=first_name)
        user.set_password(password)
        user.is_admin = True
        user.is_staff = True
        user.is_superuser = True
        user.paid = True
        user.save()
        return user


class UserAccount(AbstractBaseUser, PermissionsMixin):
    email = models.EmailField(max_length=255, unique=True)
    first_name = models.CharField(max_length=255)
    last_name = models.CharField(max_length=255)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    is_superuser = models.BooleanField(default=False)
    paid = models.BooleanField(default=False)

    referrer = models.CharField(
        max_length=255, blank=True, null=True)
    objects = UserAccountManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['first_name', 'last_name', 'paid', 'referrer']

    def get_full_name(self):
        return self.first_name + ' ' + self.last_name

    def get_short_name(self):
        return self.first_name

    def get_payment_status(self):
        return self.paid

    def mark_user_paid(self):
        self.paid = True

    def __str__(self):
        return self.email


class ProfileReferral(models.Model):
    user = models.OneToOneField(
        UserAccount, unique=True, related_name="profile", on_delete=models.CASCADE)
    referal_code = models.CharField(max_length=250,  unique=True, blank=True, null=True,
                                    default=base64.urlsafe_b64encode(
                                        uuid.uuid4().bytes.rstrip()).decode('utf-8')[:10].upper())

    def __str__(self):
        return "{} --- referral profile".format(self.user.email)


class Referrals(models.Model):
    referrer = models.ForeignKey(
        UserAccount, related_name="user_referrer", on_delete=models.CASCADE)
    referred = models.ForeignKey(
        UserAccount, related_name="user_referred", on_delete=models.CASCADE)
    date_created = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return "{} REFERRED -> {}".format(self.referrer.email, self.referred.email)

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)


class ProfilePicture(models.Model):
    user = models.OneToOneField(
        UserAccount, related_name='user_picture', on_delete=models.CASCADE)
    image = models.ImageField(
        default="images/users/default.jpg", upload_to="images/users")
    date_created = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return "{} profile picture".format(self.user.email)

    # def save(self, *args, **kwargs):
    #     super().save(*args, **kwargs)

    #     img = Image.open(self.image.path)

    #     if img.height > 300 or img.width > 300:
    #         output_size = (300, 300)
    #         img.thumbnail(output_size)
    #         img.save(self.image.path)
