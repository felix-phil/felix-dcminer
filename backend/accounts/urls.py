from django.urls import path, re_path
from accounts.views import (checkPermission, getExtraUserDetails,
                            ProfilePictureViewSet, UploadPicture, ProfilePictureView, UserPaymentDetails, EditUserDetails)
from rest_framework import routers

router = routers.DefaultRouter()
router.register('api/profilepic', ProfilePictureViewSet, 'picture')
urlpatterns = router.urls
urlpatterns += [
    path('api/image/post', UploadPicture.as_view(), name="upload"),
    path('api/image/', ProfilePictureView.as_view(), name='picture'),
    path("auth/user/permissons", checkPermission, name="check-permission"),
    path("auth/user/extras", getExtraUserDetails, name="check-extra"),
    path("user/update/", EditUserDetails.as_view(), name="update-user"),
    # path("auth/user/extras", getExtraUserDetails, name="check-extra"),
    path("api/payment", UserPaymentDetails.as_view(), name="check-payment"),


]
