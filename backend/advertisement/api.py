from rest_framework.viewsets import ModelViewSet
from .serializers import AdsSerializer, AdsViewersSerializer
from rest_framework.status import HTTP_200_OK, HTTP_400_BAD_REQUEST
from rest_framework.pagination import PageNumberPagination
from rest_framework.permissions import IsAuthenticated
from .models import Ads, AdsViewers
from rest_framework.response import Response
from payments.models import Earning, Payment
from payments.utils import add_earning


class AdsViewSet(ModelViewSet):
    serializer_class = AdsSerializer
    pagination_class = PageNumberPagination
    permission_classes = (IsAuthenticated,)
    queryset = Ads.objects.filter(is_active=True, is_removed=False)


class AdsViewersViewSet(ModelViewSet):
    serializer_class = AdsViewersSerializer
    pagination_class = None
    permission_classes = (IsAuthenticated, )
    queryset = AdsViewers.objects.all()

    def create(self, request, *args, **kwargs):
        data = self.request.data
        user = self.request.user
        ads = data['ads']
        get_ads = Ads.objects.filter(id=ads).first()
        already_exists = AdsViewers.objects.filter(user=user, ads=ads)
        if ads is not None:
            if already_exists.exists() is False:
                create_view = AdsViewers.objects.create(user=user, ads=get_ads)
                serializer = AdsViewersSerializer(
                    create_view, context={'request': request}
                )
                add_earning(earn_type='A', user=self.request.user)
                return Response(data=serializer.data, status=HTTP_200_OK)
            else:
                return Response(data={'added': 'Already added!'}, status=HTTP_400_BAD_REQUEST)
        return Response(data=None, status=None)
