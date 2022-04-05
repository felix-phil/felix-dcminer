from django.conf import settings
from payments.models import Earning
from payments.models import Payment
from accounts.models import ProfileReferral
from django.contrib.auth import get_user_model
import requests
import json
User = get_user_model()


def add_earning(earn_type, user: User):
    """
        supply earn_type: A or R (A for Ads, R for Referrals)

        Add an earning to current user when user watch ad
        Add an earning to the current user referrer when the current user pays for a package
    """
    response = False
    # Check if earning is for Ads
    if user.is_authenticated & hasattr(user, 'payment_user'):
        if earn_type == 'A':
            user_package = Payment.objects.filter(
                user=user, transactionComplete=True).first()
            if user_package.payment_type.name == 'upkeep':
                user_earn = 20
            elif user_package.payment_type.name == 'mediumbusiness':
                user_earn = 40
            elif user_package.payment_type.name == 'largebusiness':
                user_earn = 60
            earning = Earning.objects.create(
                user=user, amount=user_earn, earn_type='A')
            response = True
    # Check if earning is for referral
    if earn_type == 'R':
        if user.referrer is not None:
            referrer_user = ProfileReferral.objects.get(
                referal_code=user.referrer)

            user_package = Payment.objects.filter(
                user=user, transactionComplete=True).first()

            if hasattr(referrer_user.user, 'payment_user'):
                referrer_user_package = Payment.objects.filter(
                    user=referrer_user.user, transactionComplete=True).first()
                if referrer_user_package.get_amount_paid() <= user_package.get_amount_paid():
                    user_earn = 0
                    if referrer_user_package.payment_type.name == 'upkeep':
                        user_earn = Earning.UPKEEP_REFERRAL_EARNING
                    elif user_package.payment_type.name == 'mediumbusiness':
                        user_earn = Earning.MEDIUM_REFERRAL_EARNING
                    elif user_package.payment_type.name == 'largebusiness':
                        user_earn = Earning.LARGE_REFERRAL_EARNING
                # amount = float(user.payment_user.payment_type.amount) * 0.5
            earning_on_referrals = Earning.objects.create(
                user=referrer_user.user, amount=user_earn, earn_type='R')
            response = True
    return response


def verify_account(account_number: str, account_bank: str):
    if settings.DEBUG:
        FLW_SEC_KEY = settings.FLW_SANDBOX_SECRET_KEY
    else:
        FLW_SEC_KEY = settings.FLW_PRODUCTION_SECRET_KEY
    response = False
    params = {
        "account_number": account_number,
        "account_bank": account_bank
    }
    headers = {
        "Authorization": f"Bearer { FLW_SEC_KEY }",
        "Content-Type": "application/json"
    }
    requestUrl = 'https://api.flutterwave.com/v3/accounts/resolve'
    try:
        verify = requests.post(
            requestUrl, json.dumps(params), headers=headers)
        verify_response = verify.json()
        if verify_response['status'] == "success":
            response = True
        else:
            response = False
    except:
        response = False
    return response


def verify_payment(transaction_id):
    request_url = f'https://api.flutterwave.com/v3/transactions/{transaction_id}/verify'

    if settings.DEBUG:
        FLW_SEC_KEY = settings.FLW_SANDBOX_SECRET_KEY
    else:
        FLW_SEC_KEY = settings.FLW_PRODUCTION_SECRET_KEY

    headers = {
        "Authorization": f"Bearer { FLW_SEC_KEY }",
        "Content-Type": "application/json"
    }
    response = False
    try:
        verify = requests.get(request_url, headers=headers)
        verify_response = verify.json()

        if verify_response["status"] == "success":
            response = True
        else:
            response = False
    except:
        response = False
    return response
