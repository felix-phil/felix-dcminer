from django.shortcuts import render
from rave_python import Rave
from rave_python import RaveExceptions, Misc
from rave_python.rave_misc import IncompletePaymentDetailsError, AuthMethodNotSupportedError
from requests.exceptions import ConnectionError, ConnectTimeout
from django.conf import settings
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse
from django.http import HttpResponse
from django.contrib import messages
from django.shortcuts import redirect
# @login_required

# {'error': False, 'validationRequired': True, 'txRef': 'MC-1607870013271', 'flwRef': 'FLW-MOCK-32ee0f5323544716bb885b8c75c85de6', 'suggestedAuth': None, 'authUrl': None}


def get_client_ip(request):
    x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
    if x_forwarded_for:
        ip = x_forwarded_for.split(',')[0]
    else:
        ip = request.META.get('REMOTE_ADDR')
    return ip


def checkoutForm(request):
    return render(request, 'payments/checkout.html')


def createRave():
    rave = Rave(publicKey="FLWPUBK_TEST-552419dd913e933d0658081154bbdd24-X",
                secretKey="FLWSECK_TEST-fcda66bd622e2cca4252542c98d29005-X", usingEnv=False, production=False)
    return rave


def makePayment(request):
    if request.POST:
        payload = {
            "cvv": request.POST['cvv'],
            "cardno": request.POST['cardno'],
            "currency": "NGN",
            "country": "NG",
            "expirymonth": request.POST['expirymonth'],
            "expiryyear": request.POST['expiryyear'],
            "amount": "1000",
            "email": request.POST['email'],
            "phonenumber": "08171551089",
            "firstname": request.POST['firstname'],
            "lastname": request.POST['lastname'],
            "IP": get_client_ip(request)
        }
        try:
            res = createRave().Card.charge(payload)
            # context = {
            #     'res': res
            # }
            request.session['res'] = res
            request.session['payload'] = payload
            return redirect("sugAuth")

        except RaveExceptions.CardChargeError as e:
            messages.error(request, e.err["errMsg"])
            print(e.err["errMsg"])
            messages.error(request, e.err["flwRef"])
            print(e.err["flwRef"])
            return redirect("payment")
        except ConnectionError as e:
            messages.warning(
                request, "ConnectionError: Unable to connect to the remote server, please check your connection")
            return redirect("payment")


def sugAuth(request):
    res = request.session.get('res')
    payload = request.session.get('payload')
    if request.POST:
        if res["suggestedAuth"]:
            arg = Misc.getTypeOfArgsRequired(res["suggestedAuth"])

            if arg == "pin":
                try:
                    Misc.updatePayload(res["suggestedAuth"],
                                       payload, pin=request.POST['pin'])
                except AuthMethodNotSupportedError as e:
                    messages.error(
                        request, "AuthMethodNotSupportedError: Auth method not supported")
                    return redirect("payment")
            if arg == "address":
                try:
                    Misc.updatePayload(res["suggestedAuth"], payload, address={
                        "billingzip": "07205", "billingcity": "Hillside", "billingaddress": "470 Mundet PI", "billingstate": "NJ", "billingcountry": "US"})
                except IncompletePaymentDetailsError as e:
                    messages.error(
                        request, "AuthMethodNotSupportedError: Auth method not supported")
                    return redirect("payment")
            try:
                res = createRave().Card.charge(payload)

                request.session['res'] = res
                request.session['payload'] = payload

                if res["validationRequired"]:
                    return redirect("otpReq")
            except RaveExceptions.CardChargeError as e:
                messages.error(
                    request, "An error occured in charging your card")
                return redirect("sugAuth")
            except ConnectionError as e:
                messages.error(
                    request, "ConnectionError: Unable to connect to the remote server, please check your connection")
                return redirect("sugAuth")

    return render(request, 'payments/pin.html')


def otpReq(request):
    res = request.session.get('res')
    payload = request.session.get('payload')
    if request.POST:
        try:
            createRave().Card.validate(res["flwRef"], request.POST['otp'])

            res = createRave().Card.verify(res["txRef"])

            if res["transactionComplete"]:
                print(res["transactionComplete"])

                messages.success(
                    request, "You have successfully make a payment: you are now eligible to make more money!")
                try:
                    del request.session['res']
                    del request.session['payload']
                except KeyError:
                    pass
                return redirect("payment")
            print(res)
            return redirect("payment")
        except ConnectionError as e:
            messages.error(
                request, "ConnectionError: Unable to connect to the remote server, please check your connection")
            return redirect("otpReq")

        except RaveExceptions.TransactionValidationError as e:
            messages.error(request, e.err)
            print(e.err)
            messages.error(request, e.err["flwRef"])
            print(e.err["flwRef"])
            return redirect("payment")

        except RaveExceptions.TransactionVerificationError as e:
            messages.error(request, e.err["errMsg"])
            print(e.err["errMsg"])
            messages.error(request, e.err["txRef"])
            print(e.err["txRef"])
            return redirect("payment")

    return render(request, 'payments/otp.html')


# def makePayment(request):
#     payload = {
#         "cvv": "564",
#         "cardno": "5531886652142950",
#         "currency": "NGN",
#         "country": "NG",
#         "expirymonth": "09",
#         "expiryyear": "32",
#         "amount": "1000",
#         "email": "www.felix4real98@gmail.com",
#         "phonenumber": "08171551089",
#         "firstname": "Felix",
#         "lastname": "Philips",
#         "IP": "127.0.0.1:8000"
#         # "IP": get_client_ip(request)
#     }
#     try:
#         res = rave.Card.charge(payload)

#         if res["suggestedAuth"]:
#             arg = Misc.getTypeOfArgsRequired(res["suggestedAuth"])

#             if arg == "pin":
#                 Misc.updatePayload(res["suggestedAuth"], payload, pin="3310")
#             if arg == "address":
#                 Misc.updatePayload(res["suggestedAuth"], payload, address={
#                                    "billingzip": "07205", "billingcity": "Hillside", "billingaddress": "470 Mundet PI", "billingstate": "NJ", "billingcountry": "US"})

#             res = rave.Card.charge(payload)

#         if res["validationRequired"]:
#             rave.Card.validate(res["flwRef"], "12345")

#         res = rave.Card.verify(res["txRef"])
#         print(res["transactionComplete"])

#     except RaveExceptions.CardChargeError as e:
#         print(e.err["errMsg"])
#         print(e.err["flwRef"])

#     except RaveExceptions.TransactionValidationError as e:
#         print(e.err)
#         print(e.err["flwRef"])

#     except RaveExceptions.TransactionVerificationError as e:
#         print(e.err["errMsg"])
#         print(e.err["txRef"])

    # return HttpResponse(rave)

# makePayment()

