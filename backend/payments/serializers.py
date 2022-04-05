from rest_framework import serializers
from payments.models import Payment, BillingInfo, Earning, Withdraw
from djangoflutterwave.models import FlwPlanModel
from accounts.serializers import UserSerializer


class BillingInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = BillingInfo
        fields = '__all__'


class PlanSerializer(serializers.ModelSerializer):
    class Meta:
        model = FlwPlanModel
        fields = '__all__'


class PaymentSerializer(serializers.ModelSerializer):
    # payment_type = serializers.StringRelatedField()
    payment_type = PlanSerializer(read_only=True)

    class Meta:
        model = Payment
        fields = ('id', 'txRef', 'transactionComplete',
                  'refKey', 'transaction_id', 'payment_type', 'date_created')


class EarningSerializer(serializers.ModelSerializer):
    class Meta:
        model = Earning
        fields = ('id', 'user', 'earn_type', 'amount', 'date_created')


class WithdrawalSerializer(serializers.ModelSerializer):
    user = UserSerializer()

    def get_account_info(self, obj):
        try:
            data = BillingInfoSerializer(instance=obj.user.user_billing).data
            return {
                "account_number": data['account_number'],
                "bank": data['bank'],
                "fullname": data['fullname']
            }
        except:
            return {}
    account_info = serializers.SerializerMethodField(
        method_name='get_account_info')

    class Meta:
        model = Withdraw
        fields = ('id', 'user', 'amount', 'amount_approved', 'is_approved', 'is_paid',
                  'is_active', 'account_info', 'date_requested', 'date_approved')


class WithdrawalSerializerUser(serializers.ModelSerializer):
    class Meta:
        model = Withdraw
        fields = ('id', 'user', 'amount', 'amount_approved', 'is_approved', 'is_paid',
                  'is_active', 'date_requested', 'date_approved', 'date_paid')
