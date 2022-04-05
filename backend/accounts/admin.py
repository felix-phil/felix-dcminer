from django.contrib import admin
from .models import UserAccount, ProfileReferral, Referrals, ProfilePicture
from rest_framework_simplejwt.token_blacklist.models import OutstandingToken
from rest_framework_simplejwt.token_blacklist.admin import OutstandingTokenAdmin


class ProfileReferralAdmin(admin.ModelAdmin):
    list_display = ('user', 'referal_code')
    search_fields = ('user__email', 'referal_code')
    list_per_page = 20

    def has_add_permission(self, request):
        return False

    def has_change_permission(self, request):
        return True

    # def has_delete_permission(self, request):
    #     return False


class ReferralsAdmin(admin.ModelAdmin):
    list_display = ('referrer', 'referred', 'date_created')
    search_fields = ('referrer__email', 'referred__email')
    list_filter = ('date_created',)
    list_per_page = 20

    def has_add_permission(self, request):
        return False

    def has_change_permission(self, request, *args, **kwargs):
        return True


class ProfilePictureAdmin(admin.ModelAdmin):
    list_display = ('user', 'image')
    search_fields = ('user__email',)
    list_filter = ('date_created',)
    list_per_page = 20

    def has_add_permission(self, request):
        return False

    def has_change_permission(self, request, *args, **kwargs):
        return True

    # def has_delete_permission(self, request):
    #     return False


class UserAccountAdmin(admin.ModelAdmin):
    def get_queryset(self, request):
        return UserAccount.objects.all().order_by('first_name', 'last_name')
    fields = ('password', 'email', 'first_name', 'last_name',
              'referrer', 'last_login', 'groups', 'user_permissions', 'paid', 'is_staff', 'is_superuser',)
    search_fields = ('email', 'first_name', 'last_name',
                     'referrer', 'last_login')
    readonly_fields = ('password', 'paid')
    list_display = ('first_name', 'last_name', 'email', 'last_login',
                    'is_staff', 'is_superuser')
    list_per_page = 20

    def has_add_permission(self, request):
        return False

    def has_change_permission(self, request, *args, **kwargs):
        return True

    # def has_delete_permission(self, request):
    #     return True


class MyOutstandingTokenAdmin(admin.ModelAdmin):
    list_display = (
        'jti',
        'user',
        'created_at',
        'expires_at',
    )
    search_fields = (
        'user__id',
        'jti',
    )
    ordering = (
        'user',
    )

    def get_queryset(self, *args, **kwargs):
        qs = super().get_queryset(*args, **kwargs)

        return qs.select_related('user')

    # Read-only behavior defined below
    actions = None

    def get_readonly_fields(self, *args, **kwargs):
        return [f.name for f in self.model._meta.fields]

    def has_add_permission(self, *args, **kwargs):
        return False

    def has_delete_permission(self, *args, **kwargs):
        return True

    def has_change_permission(self, request, obj=None):
        return (
            request.method in ['GET', 'HEAD'] and  # noqa: W504
            super().has_change_permission(request, obj)
        )


admin.site.register(UserAccount, UserAccountAdmin)
admin.site.register(ProfileReferral, ProfileReferralAdmin)
admin.site.register(Referrals, ReferralsAdmin)
admin.site.register(ProfilePicture, ProfilePictureAdmin)
admin.site.unregister(OutstandingToken)
admin.site.register(OutstandingToken, MyOutstandingTokenAdmin)
