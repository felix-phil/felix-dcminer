from django.urls import path
from django.conf.urls import url
from rest_framework import routers
# from payments.api import ,
from .views import makePayment, checkoutForm, sugAuth, otpReq
from .api import (PaymentViewSet, BillingInfoView, PaymentView, PlansView, PlanDetail, PlanUpgrade, PaymentUpgradeParams,
                  EarnUserView, MakeWithdrawRequest, BankList, PaymentUpdateViewSet, WithdrawalViewListAdmin, ApproveWithdrawalAdmin, Pay)


# router = routers.DefaultRouter()
# router.register('api/admin-payments', WithdrawalViewSetAdmin, 'payments-admin')
# router.register('api/billing', BillingInfoViewSet, 'billing')
# urlpatterns = router.urls

urlpatterns = [
    path('api/payment/', PaymentViewSet.as_view(), name='payments'),
    path('api/payment/upgrade/', PaymentUpdateViewSet.as_view(), name='payments'),
    path("makepayment/flutterwave",
         PaymentView.as_view(), name="initializePayment"),
    #     path("makepayment", checkoutForm, name="payment"),
    #     path("makepayment/confirmPin", sugAuth, name="sugAuth"),
    #     path("makepayment/otpReq", otpReq, name="otpReq"),
    path('api/billing', BillingInfoView.as_view(), name='billing'),
    path("packages", PlansView.as_view(), name='packages'),
    path("packages/plan/",
         PlanDetail.as_view(), name='packages-params'),
    path("packages/upgrade/",
         PlanUpgrade.as_view(), name='package-upgrade'),
    path("djangoflutterwave/upgrade/",
         PaymentUpgradeParams.as_view(), name='payment-params-upgrade'),
    path("api/earnings", EarnUserView.as_view(), name="user-earnings"),
    path("api/request-withdraw", MakeWithdrawRequest.as_view(),
         name='request-withdraw'),
    path('banks', BankList.as_view(), name="bank-list"),
    path('api/admin-payments', WithdrawalViewListAdmin.as_view(),
         name='withdrawal-admin-list'),
    path('api/admin-payments/approve/<pk>/',
         ApproveWithdrawalAdmin.as_view(), name='approve-withdrawal'),
    path('api/admin-payments/payAuser/<pk>/',
         Pay.as_view(), name='fulfill-withdrawal')
]
