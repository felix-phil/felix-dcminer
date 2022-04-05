from django.db import models
from .formatChecker import ContentTypeRestrictedFileField
from django.contrib.auth import get_user_model
User = get_user_model()


class Ads(models.Model):
    ad_title = models.CharField(max_length=255)
    ad_owner = models.CharField(max_length=100)
    ad_owner_link = models.URLField(blank=True, null=True)
    ad_owner_email = models.EmailField(null=True, blank=True)
    ad_description = models.TextField(blank=True, null=True)
    ad_image = models.ImageField(upload_to='images/ads')
    ad_video = ContentTypeRestrictedFileField(upload_to='videos/ads',
                                              content_types=['video/x-msvideo', 'video/mp4', 'image/gif', 'video/x-flv'], max_upload_size=20971520, null=True, blank=True)

    is_active = models.BooleanField(default=True)
    is_removed = models.BooleanField(default=False)
    date_created = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return "{} {}".format(self.ad_owner, self.ad_title)

    # def save(self, request, *args, **kwargs):


class AdsViewers(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    ads = models.ForeignKey(Ads, on_delete=models.CASCADE)
    date_created = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.user.email
