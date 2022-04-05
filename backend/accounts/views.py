from django.shortcuts import render
from rest_framework.decorators import api_view
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse, HttpResponse
from django.contrib.auth.models import Permission
from rest_framework import permissions, viewsets
from accounts.serializers import ProfilePictureSerializer
from accounts.models import ProfilePicture, UserAccount
from fluent_comments.models import FluentComment
from payments.models import BillingInfo, Payment
from rest_framework.status import HTTP_200_OK
from rest_framework.response import Response
from django.core import serializers
from articles.models import Article
from rest_framework.generics import ListAPIView, RetrieveAPIView, UpdateAPIView
from rest_framework.parsers import MultiPartParser
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404
from rest_framework.status import HTTP_200_OK, HTTP_400_BAD_REQUEST, HTTP_404_NOT_FOUND
from accounts.models import ProfileReferral, Referrals
from payments.serializers import PaymentSerializer, WithdrawalSerializerUser
from djoser.serializers import UserSerializer
from payments.models import Earning, Withdraw
import json


class ProfilePictureView(RetrieveAPIView):
    serializer_class = ProfilePictureSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, *args, **kwargs):
        queryset = ProfilePicture.objects.filter(user=request.user)
        serializer = ProfilePictureSerializer(
            queryset, many=True, context={"request": request})
        return Response(serializer.data[0])


class UploadPicture(APIView):
    serializer_class = ProfilePictureSerializer
    parser_classes = [MultiPartParser]
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return ProfilePicture.objects.filter(user=self.request.user)

    def update(self, request, *args, **kwargs):
        file_serializer = ProfilePictureSerializer(data=request.data)
        status = None
        message = None
        if file_serializer.is_valid():
            file_serializer.update(user=self.request.user)
            status = HTTP_200_OK
            message = "success"
        else:
            status = HTTP_400_BAD_REQUEST
            message = "Failure"
        detail = {'status': status, 'message': message}
        return Response(data=detail)


class ProfilePictureViewSet(viewsets.ModelViewSet):
    serializer_class = ProfilePictureSerializer
    permission_classes = [permissions.IsAuthenticated]
    pagination_class = None

    def get_queryset(self):
        return ProfilePicture.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    def perform_update(self, serializer):
        serializer.save(user=self.request.user)


@api_view(http_method_names=['GET'])
def checkPermission(request):
    current_user = request.user
    # permissions = Permission.objects.filter(user=current_user)
    data = {
        "is_staff": current_user.is_staff,
        "is_superuser": current_user.is_superuser
    }

    return JsonResponse(data)


@api_view(http_method_names=['GET'])
def getExtraUserDetails(request):
    numOfComments = FluentComment.objects.filter(
        user=request.user, parent=None).count()
    numOfArticles = Article.objects.filter(author=request.user).count()
    numOfReplies = FluentComment.objects.filter(
        user=request.user).exclude(parent=None).count()
    total_earnings_ads = 0
    total_earnings_ref = 0
    total_earning = 0
    withdrawals = Withdraw.objects.filter(user=request.user)

    def btoJson(data):
        return {
            "id": data.id,
            "user_id": data.user_id,
            "fullname": data.fullname,
            "account_number": data.account_number,
            "bank": data.bank,
            "email": data.email,
            "address1": data.address1,
            "address2": data.address2,
            "city": data.city,
            "phone": data.phone,
            "zipCode": data.zipCode,
            "cardno": data.cardno,
            "cardname": data.cardname,
            "cvv": data.cvv,
            "expirydate": data.expirydate,
            "date_created": data.date_created
        }

    def paymentToJson(data):
        return {
            "id": data.id,
            # "txRef": data.txRef,
            "transactionComplete": data.transactionComplete,
            "payment_type_name": data.payment_type.name,
            "payment_type_amount": data.payment_type.amount,
            "date_created": data.date_created
        }

    billingInfo = btoJson(request.user.user_billing)
    earnings = Earning.objects.filter(user=request.user)

    if earnings.exists():
        for earn in earnings:
            if earn.earn_type == 'A':
                total_earnings_ads += earn.amount
            elif earn.earn_type == 'R':
                total_earnings_ref += earn.amount
    total_earning = total_earnings_ads + total_earnings_ref
    # billingInfo = request.user.user_billing.
    # referal_code = {}
    referal_code = request.user.profile.referal_code

    payment = {}
    if hasattr(request.user, 'payment_user'):
        payment = paymentToJson(request.user.payment_user)
    else:
        payment = False

    def refToJson(ref):
        def paidQ(user):
            if hasattr(user, 'payment_user'):
                return paymentToJson(user.payment_user)
            else:
                return False

        return {
            "id": ref.id,
            "first_name": ref.referred.first_name,
            "last_name": ref.referred.last_name,
            "payment": paidQ(ref.referred),
            "email": ref.referred.email,
            "date_created": ref.date_created,

        }

    def referralsToJson(datas):
        result = []
        for data in datas:
            result.append(refToJson(data))
        return result

    referrals = []
    # if hasattr(request.user, 'user_referrer'):
    refs = Referrals.objects.filter(referrer=request.user)
    if refs.exists():
        referrals = referralsToJson(refs)
    else:
        referrals = []

    context = {
        'numOfComments': numOfComments,
        'numOfReplies': numOfReplies,
        'numOfArticles': numOfArticles,
        'referal_code': referal_code,
        'billingInfo': billingInfo,
        'payment': payment,
        'referrals': referrals,
        "total_earnings_ads": total_earnings_ads,
        "total_earnings_ref": total_earnings_ref,
        "total_earning": total_earning,
        "withdrawals": WithdrawalSerializerUser(withdrawals, many=True).data
        # 'picture': picture,
    }
    return Response(context)

# class ExtraDetails(APIView):
#     def get(self, request, *args, **args):
#         numOfComments = FluentComment.objects.filter(
#         user=request.user, parent=None).count()
#         numOfArticles = Article.objects.filter(author=request.user).count()
#         numOfReplies = FluentComment.objects.filter(
#         user=request.user).exclude(parent=None).count()


class UserPaymentDetails(APIView):
    serializer = PaymentSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def get(self, request, *args, **kwargs):
        payment = Payment.objects.filter(user=request.user).first()
        if payment is None:
            return Response(data={"detail not found": "No payment found"}, status=HTTP_404_NOT_FOUND)
        response = {
            "transaction_status":  payment.transactionComplete,
            "txRef": payment.txRef,
            "package": payment.payment_type.name,
            "package_title": payment.payment_type.modal_title,
            "package_benefits": map(str.strip, payment.payment_type.pay_button_css_classes.split(', ')),
            "amount": payment.payment_type.amount,
            "date_created": payment.date_created,
        }
        return Response(data=response, status=HTTP_200_OK)


class EditUserDetails(APIView):
    permision_classes = (permissions.IsAuthenticated,)

    def post(self, request, *args, **kwargs):
        user = UserAccount.objects.filter(id=request.user.id).first()
        data = self.request.data
        first_name = data['first_name']
        last_name = data['last_name']

        if first_name and last_name is not None:
            user.first_name = first_name
            user.last_name = last_name
            # user.save()

        serializer = UserSerializer(
            user, data=request.data, context={'request': request}
        )
        if serializer.is_valid():
            serializer.save()
            user.save()
            return Response(data=serializer.data, status=HTTP_200_OK)
        else:
            return Response({"detail": "Bad Request"}, status=HTTP_400_BAD_REQUEST)
