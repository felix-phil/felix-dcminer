from accounts.models import ProfileReferral
# from uuid import uuid4
import uuid
import base64


def generateUniqueReferral():
    generatedReferralCode = base64.urlsafe_b64encode(
        uuid.uuid4().bytes.rstrip()).decode('utf-8')[:10].upper()

    searchDb = ProfileReferral.objects.filter(
        referal_code=generatedReferralCode)
    if searchDb.exists():
        generateUniqueReferral()
    else:
        return generatedReferralCode
