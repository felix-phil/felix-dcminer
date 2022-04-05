from rest_framework import routers
from django.urls import path
from .api import AdsViewSet, AdsViewersViewSet
router = routers.DefaultRouter()

router.register('api/ads', AdsViewSet, 'ads')
router.register('api/adsview', AdsViewersViewSet, 'ads-view')

urlpatterns = router.urls
