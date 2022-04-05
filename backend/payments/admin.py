from django.contrib import admin
from .models import Payment, Earning, Withdraw, BillingInfo
from django.utils import timezone


# def make_withdrawal_approved(modeladmin, request, queryset):
#     queryset.update(is_approved=True, date_approved=timezone.now())


# def mark_as_paid(modeladmin, request, queryset):
#     queryset.update(is_paid=True, date_paid=timezone.now())


class WithdrawalAdmin(admin.ModelAdmin):
    list_display = [
        'user',
        'amount',
        'amount_approved',
        'is_approved',
        'is_paid',
        'is_active',
        'is_paid',
        'date_requested',
        'date_approved',
        'date_paid'
    ]
    list_display_links = [
        'user'
    ]
    # readonly_fields = ['user', 'amount']
    list_filter = [
        'is_active',
        'is_approved',
        'is_paid'
    ]
    search_fields = [
        'user__email'
    ]
    list_per_page = 20
    # actions = [make_withdrawal_approved, mark_as_paid]

    def has_delete_permission(self, request, *args, **kwargs):
        return True

    # def has_add_permission(self, request, *args, **kwargs):
    #     return False


class BillingInfoAdmin(admin.ModelAdmin):
    def get_queryset(self, request):
        return BillingInfo.objects.all().order_by('user__email')
    list_display = ('user', 'account_number', 'fullname', 'bank')
    search_fields = ('user__email', 'bank', 'account_number', 'fullname')
    list_filter = ('bank',)
    list_per_page = 20


class PaymentAdmin(admin.ModelAdmin):
    def get_queryset(self, request):
        return Payment.objects.all().order_by('-date_created')
    list_display = ('user', 'payment_type', 'txRef', 'date_created')
    list_filter = ('date_created', 'payment_type__name')
    search_fields = ('user__email', 'payment_type__name',
                     'payment_type__amount', 'txRef')
    list_per_page = 20

    def has_add_permission(self, request):
        if request.user.is_superuser:
            return True
        else:
            return False

    def has_delete_permission(self, request, *args, **kwargs):
        if request.user.is_superuser:
            return True
        else:
            return False

    def has_change_permission(self, request, *args, **kwargs):
        if request.user.is_superuser:
            return True
        else:
            return False


admin.site.register(Payment, PaymentAdmin)
admin.site.register(Earning)
admin.site.register(BillingInfo, BillingInfoAdmin)
admin.site.register(Withdraw, WithdrawalAdmin)
