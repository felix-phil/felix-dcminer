from django.contrib import admin
from advertisement.models import Ads, AdsViewers


class AdsAdmin(admin.ModelAdmin):

    list_display = ['ad_title', 'ad_owner', 'ad_owner_link', 'ad_owner_email']
    search_fields = ['ad_title', 'ad_owner', 'ad_owner_link']

    def has_delete_permission(self, request, *args, **kwargs):
        return True

    def has_change_permission(self, request, *args, **kwargs):
        return True

    def has_add_permission(self, request, *args, **kwargs):
        return True


admin.site.register(Ads, AdsAdmin)
admin.site.register(AdsViewers)
