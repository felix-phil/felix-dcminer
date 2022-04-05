from rest_framework import serializers
from .models import Ads, AdsViewers


class AdsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ads
        fields = ('id', 'ad_title', 'ad_owner',
                  'ad_owner_link', 'ad_image', 'ad_video')


class AdsViewersSerializer(serializers.ModelSerializer):
    class Meta:
        model = AdsViewers
        fields = ('id', 'user', 'ads')
