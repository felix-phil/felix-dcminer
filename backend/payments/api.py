from rest_framework import viewsets, permissions
from rest_framework import mixins
from payments.models import BillingInfo, Payment, Earning, Withdraw
from payments.serializers import PaymentSerializer, BillingInfoSerializer, WithdrawalSerializer
from rest_framework.views import APIView
from rest_framework.generics import ListAPIView, RetrieveAPIView, ListCreateAPIView, CreateAPIView
from django.views.generic import TemplateView
from djangoflutterwave.models import FlwPlanModel
from rest_framework import status
from rest_framework.response import Response
from .serializers import PlanSerializer, EarningSerializer
from django.shortcuts import get_object_or_404
from django.conf import settings
from djangoflutterwave.utils import create_transaction_ref
from django.contrib.contenttypes.models import ContentType
from django.utils import timezone
from .utils import add_earning, verify_account, verify_payment
import requests
from django.contrib.auth import get_user_model
import json
User = get_user_model()


class BillingInfoView(ListCreateAPIView):
    serializer_class = BillingInfoSerializer
    queryset = BillingInfo.objects.all()
    permission_classes = (permissions.IsAuthenticated),

    def post(self, request, *args, **kwargs):
        data = self.request.data
        account_number = data['account_number']
        bank = data['bank']
        fullname = data['fullname']
        address1 = data['address1']
        city = data['city']
        phone = data['phone']
        if verify_account(account_number=account_number, account_bank=bank):
            billingInfo, created = BillingInfo.objects.update_or_create(
                defaults=dict(
                    account_number=account_number,
                    bank=bank,
                    address1=address1,
                    city=city,
                    phone=phone,
                    fullname=fullname
                ),
                user=self.request.user
            )
            Serializer = self.get_serializer_class()
            serializer = Serializer(
                billingInfo, data=request.data, context={'request': request})
            if serializer.is_valid():
                serializer.save()
            if created:
                return Response(data=serializer.data, status=status.HTTP_201_CREATED)
            else:
                return Response(data=serializer.data, status=status.HTTP_200_OK)
        else:
            return Response(data={"detail": "Unable to verify your account number, please check and save again"}, status=status.HTTP_400_BAD_REQUEST)
        return Response(status=status.HTTP_400_BAD_REQUEST)


class PaymentViewSet(ListCreateAPIView):
    serializer_class = PaymentSerializer
    queryset = Payment.objects.all()
    permission_classes = (permissions.IsAuthenticated,)

    def post(self, request, *arg, **kwargs):
        transactionComplete = False
        if verify_payment(transaction_id=self.request.data['transaction_id']) is True:
            transactionComplete = True
            try:
                user = User.objects.get(id=self.request.user.id)
                user.mark_user_paid()
                user.save()
            except User.DoesNotExist:
                pass
        data = self.request.data
        txRef = data['txRef']
        refKey = data['refKey']
        transaction_id = data['transaction_id']
        payment_type = FlwPlanModel.objects.filter(
            name=data['payment_type']).first()
        payment, payment_created = Payment.objects.update_or_create(
            defaults=dict(
                txRef=txRef,
                transactionComplete=transactionComplete,
                refKey=refKey,
                transaction_id=transaction_id,
                payment_type=payment_type
            ),
            user=self.request.user
        )
        serializer = PaymentSerializer(
            payment, data=request.data, context={'request': request}
        )
        if serializer.is_valid():
            serializer.save()
        if transactionComplete == True:
            add_earning(earn_type='R', user=self.request.user)
        if payment_created:
            return Response(data=serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(data=serializer.data, status=status.HTTP_200_OK)


class PaymentUpdateViewSet(ListCreateAPIView):
    serializer_class = PaymentSerializer
    queryset = Payment.objects.all()
    permission_classes = (permissions.IsAuthenticated,)

    def post(self, request, *arg, **kwargs):
        transactionComplete = False
        if verify_payment(txRef=self.request.data['transaction_id']) is True:
            transactionComplete = True
        data = self.request.data
        txRef = data['txRef']
        refKey = data['refKey']
        transaction_id = data['transaction_id']
        payment_type = FlwPlanModel.objects.filter(
            name=data['payment_type']).first()
        payment, payment_created = Payment.objects.update_or_create(
            defaults=dict(
                txRef=txRef,
                transactionComplete=transactionComplete,
                refKey=refKey,
                transaction_id=transaction_id,
                payment_type=payment_type
            ),
            user=self.request.user
        )
        serializer = PaymentSerializer(
            payment, data=request.data, context={'request': request}
        )
        if serializer.is_valid():
            serializer.save()
        if payment_created:
            return Response(data=serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(data=serializer.data, status=status.HTTP_200_OK)


class PaymentView(TemplateView):
    template_name = 'payments/my_payview.html'

    def get_context_data(self, **kwargs):
        kwargs = super().get_context_data(**kwargs)
        kwargs['upkeep'] = FlwPlanModel.objects.filter(name='upkeep').first()
        return kwargs


class PlansView(ListAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = PlanSerializer
    pagination_class = None
    queryset = FlwPlanModel.objects.all()


class PlanDetail(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, *args, **kwargs):
        try:
            plan = FlwPlanModel.objects.get(
                name=request.GET.get("planname", None))
        except FlwPlanModel.DoesNotExist:
            return Response("Plan does not exist", status=status.HTTP_404_NOT_FOUND)

        data = {
            "name": plan.name,
            "amount": plan.amount,
            "title": plan.modal_title,
            "description": map(str.strip, plan.pay_button_css_classes.split(', '))
        }
        return Response(data)


class PlanUpgrade(ListAPIView):
    serializer_class = PlanSerializer
    pagination_class = None
    permission_classes = (permissions.IsAuthenticated,)

    def get_queryset(self):
        if hasattr(self.request.user, 'payment_user'):
            return FlwPlanModel.objects.filter(amount__gt=self.request.user.payment_user.payment_type.amount)


class PaymentUpgradeParams(APIView):
    serializer_class = FlwPlanModel
    permission_classes = (permissions.IsAuthenticated, )

    def get(self, request, *args, **kwargs):
        if settings.DEBUG:
            public_key = settings.FLW_SANDBOX_PUBLIC_KEY
        else:
            public_key = settings.FLW_PRODUCTION_PUBLIC_KEY

        if hasattr(self.request.user, 'payment_user'):
            try:
                plan_requested = FlwPlanModel.objects.get(
                    name=request.GET.get("planname", None))
            except FlwPlanModel.DoesNotExist:
                return Response({"detail": "Selected plan does not exist"}, status=status.HTTP_404_NOT_FOUND)
            if plan_requested == self.request.user.payment_user.payment_type or plan_requested.amount < self.request.user.payment_user.payment_type.amount:
                return Response({"detail": "You can't choose this package"}, status=status.HTTP_400_BAD_REQUEST)
            response = dict(
                amount=plan_requested.amount - self.request.user.payment_user.payment_type.amount,
                currency=plan_requested.currency,
                customer=dict(
                    email=self.request.user.email,
                    name=f"{self.request.user.get_full_name()}"
                ),
                customizations=dict(
                    logo=plan_requested.modal_logo_url,
                    title=plan_requested.modal_title,
                ),
                payment_options="card",
                payment_plan=plan_requested.flw_plan_id,
                public_key=public_key,
                tx_ref=create_transaction_ref(
                    plan_pk=plan_requested.pk, user_pk=self.request.user.pk),
            )
            return Response(response, status=status.HTTP_200_OK)
        else:
            return Response({"detail": "No previous payment found"}, status=status.HTTP_200_OK)


class EarnUserView(APIView):
    permission_classes = (permissions.IsAuthenticated,)
    serializer_class = EarningSerializer
    pagination_class = None

    def get(self, request, *args, **kwargs):
        earnings = Earning.objects.filter(user=self.request.user)
        total_earnings_ads = 0
        total_earnings_ref = 0
        if earnings.exists():
            for earn in earnings:
                if earn.earn_type == 'A':
                    total_earnings_ads += earn.amount
                elif earn.earn_type == 'R':
                    total_earnings_ref += earn.amount
        response = {
            "total_earnings_ads": total_earnings_ads,
            "total_earnings_ref": total_earnings_ref,
            "total": total_earnings_ads+total_earnings_ref
        }
        return Response(data=response, status=status.HTTP_200_OK)


class MakeWithdrawRequest(CreateAPIView):
    serializer_class = WithdrawalSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def create(self, request, *args, **kwargs):
        if hasattr(self.request.user, 'payment_user'):
            total_earning = 0
            earnings = Earning.objects.filter(user=self.request.user)
            if earnings.exists():
                for earn in earnings:
                    total_earning += earn.amount
                if total_earning >= Withdraw.MINIMUM_WITHDRAWAL_AMOUNT:
                    withdraw = Withdraw.objects.create(user=self.request.user, amount=total_earning,
                                                       is_paid=False, is_approved=False, date_requested=timezone.now(), is_active=True)
                    for earn in earnings:
                        earn.delete()
                    Serializer = self.get_serializer_class()
                    serializer = Serializer(
                        withdraw, context={'request': request})
                    return Response(data=serializer.data, status=status.HTTP_201_CREATED)
                else:
                    return Response({"detail": f"You have no enough earnings to make a withdrawal request, earn more and try again. Minimum withdrawal amount is NGN{Withdraw.MINIMUM_WITHDRAWAL_AMOUNT}"}, status=status.HTTP_400_BAD_REQUEST)
            else:
                return Response({"detail": "You have no earnings"}, status=status.HTTP_400_BAD_REQUEST)
        return Response(None, status=status.HTTP_400_BAD_REQUEST)


class BankList(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def get(self, request, *args, **kwargs):
        if settings.DEBUG:
            FLW_SEC_KEY = settings.FLW_SANDBOX_SECRET_KEY
        else:
            FLW_SEC_KEY = settings.FLW_PRODUCTION_SECRET_KEY
        headers = {
            'Authorization': f'Bearer {FLW_SEC_KEY}'
        }
        try:
            banks = requests.get(
                'https://api.flutterwave.com/v3/banks/NG/', headers=headers)
            response = banks.json()
        except:
            response = []
        return Response(data=response, status=status.HTTP_200_OK)


class WithdrawalViewListAdmin(ListAPIView):
    serializer_class = WithdrawalSerializer
    permission_classes = (permissions.IsAdminUser,)
    pagination_class = None
    queryset = Withdraw.objects.filter(
        is_active=True, is_paid=False).order_by('-date_requested').all()


class ApproveWithdrawalAdmin(APIView):
    permission_classes = (permissions.IsAdminUser,)

    def post(self, request, *args, **kwargs):
        try:
            withdrawal = Withdraw.objects.filter(
                id=self.kwargs.get('pk')).first()
            withdrawal.is_approved = True
            amount_approved = self.request.data['amount_approved']
            withdrawal.date_approved = timezone.now()
            withdrawal.amount_approved = amount_approved
            serializer = WithdrawalSerializer(withdrawal)
            withdrawal.save()
            return Response(data=serializer.data, status=status.HTTP_200_OK)
        except:
            return Response(status=status.HTTP_400_BAD_REQUEST)


class Pay(APIView):
    permission_classes = (permissions.IsAdminUser,)

    def post(self, request, *args, **arg):
        if settings.DEBUG:
            FLW_SEC_KEY = settings.FLW_SANDBOX_SECRET_KEY
        else:
            FLW_SEC_KEY = settings.FLW_PRODUCTION_SECRET_KEY

        withdrawal = Withdraw.objects.filter(id=self.kwargs.get('pk')).first()
        params = {}
        try:
            params = {
                "account_bank": withdrawal.user.user_billing.bank,
                "account_number": withdrawal.user.user_billing.account_number,
                "amount": withdrawal.amount_approved,
                "narration": f"User's withdrawal request on {withdrawal.date_requested}",
                # "reference": create_transaction_ref(plan_pk=withdrawal.pk, user_pk=withdrawal.user.pk),
                "debit_currency": "NGN"
            }
        except:
            return Response({"detail": "Error getting payment params"}, status.HTTP_404_NOT_FOUND)
        if withdrawal.is_paid == False:
            if "" not in params.values() and None not in params.values():
                # return Response(params, status.HTTP_200_OK)
                try:
                    payUrl = "https://api.flutterwave.com/v3/transfers"
                    headers = {
                        "Authorization": f"Bearer { FLW_SEC_KEY }",
                        "Content-Type": "application/json"
                    }
                    pay = requests.post(
                        payUrl, data=json.dumps(params), headers=headers)
                    response = pay.json()
                    if response["status"] == "success":
                        withdrawal.is_paid = True
                        withdrawal.date_paid = timezone.now()
                        withdrawal.status = False
                        withdrawal.save()
                        return Response(data={"response": f"Payment has been successfully made to {response['data']['full_name']} successfully"}, status=status.HTTP_200_OK)
                    else:
                        return Response(data={"detail": f"{response['status']}"})
                except:
                    return Response(data={"detail": "An error occured processing payment!"}, status=status.HTTP_400_BAD_REQUEST)
            else:
                return Response({"detail": "User payment parameters not configured correctly, contact user to fill necessary details"}, status=status.HTTP_404_NOT_FOUND)
        else:
            return Response({"detail": "This withdrawal has already being paid!"}, status=status.HTTP_406_NOT_ACCEPTABLE)


class VerifyAccountView(APIView):
    def post(self, request, *args, **kwargs):
        if settings.DEBUG:
            FLW_SEC_KEY = settings.FLW_SANDBOX_SECRET_KEY
        else:
            FLW_SEC_KEY = settings.FLW_PRODUCTION_SECRET_KEY
        data = self.request.data
        params = {
            "account_number": data['account_number'],
            "account_bank": data['account_bank']
        }
        headers = {
            "Authorization": f"Bearer { FLW_SEC_KEY }",
            "Content-Type": "application/json"
        }
        requestUrl = 'https://api.flutterwave.com/v3/accounts/resolve'
        try:
            verify = requests.post(
                requestUrl, json.dumps(params), headers=headers)
            response = verify.json()
            if response['status'] == "success":
                return Response({"status": True}, status=status.HTTP_200_OK)
            else:
                return Response({"detail": response['message']}, status=status.HTTP_400_BAD_REQUEST)
        except:
            return Response({"detail": "Unable to process request"}, status=status.HTTP_400_BAD_REQUEST)
