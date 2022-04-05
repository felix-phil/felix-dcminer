from django.db import models
from uuid import uuid4
from PIL import Image


class Contacts(models.Model):
    firstname = models.CharField(blank=True, max_length=255)
    lastname = models.CharField(blank=True, max_length=255)
    email = models.EmailField(blank=False, null=False)
    message = models.TextField(blank=False, null=False)

    resolved = models.BooleanField(default=False)
    date_created = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return "{}'s message".format(self.email)


class About(models.Model):
    title = models.CharField(max_length=255)
    about_details = models.TextField()
    image = models.ImageField(upload_to="images/about", null=True, blank=True)
    date_created = models.DateTimeField(auto_now_add=True)

    is_active = models.BooleanField(default=True)

    def __str__(self):
        return self.title

    def save(self, *args, **kwargs):

        super().save(*args, **kwargs)
        if(self.image):
            img = Image.open(self.image.path)

            newfilename = 'about_image_{}'.format(uuid4().hex)

            if img.height > 1024 or img.width > 1024:
                output_size = (1024, 1024)
                img.thumbnail(output_size)
                img.save(newfilename)


class PrivacyPolicy(models.Model):
    title = models.CharField(max_length=255)
    details = models.TextField()

    def __str__(self):
        return self.title


class Terms(models.Model):
    title = models.CharField(max_length=255)
    details = models.TextField()

    def __str__(self):
        return self.title
