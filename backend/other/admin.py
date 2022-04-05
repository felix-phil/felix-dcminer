from django.contrib import admin
from django_summernote.admin import SummernoteModelAdmin
from other.models import Contacts, About, PrivacyPolicy, Terms


def mark_as_resolved(modeladmin, request, queryset):
    queryset.update(resolved=True)


class AboutModelAdmin(SummernoteModelAdmin):
    summernote_fields = ('about_details',)


class PrivacyPolicyAdmin(SummernoteModelAdmin):
    summernote_fields = ('details')


class TermsAdmin(SummernoteModelAdmin):
    summernote_fields = ('details')


class ContactsModelAdmin(admin.ModelAdmin):
    def get_queryset(self, request):
        return Contacts.objects.all().order_by('resolved', '-date_created')
    list_display = ('firstname', 'lastname', 'date_created', 'resolved')
    fields = ('firstname', 'lastname', 'email',
              'message', 'date_created', 'resolved')
    readonly_fields = ('firstname', 'lastname',
                       'date_created', 'email', 'message')
    search_fields = ('firstname', 'lastname', 'email', 'message',)
    list_filter = ('resolved', 'date_created')

    def has_add_permission(self, request):
        return False
    actions = [mark_as_resolved]
    # def has_change_permission(self, request):
    #     return True


admin.site.register(About, AboutModelAdmin)
admin.site.register(Contacts, ContactsModelAdmin)
admin.site.register(PrivacyPolicy, PrivacyPolicyAdmin)
admin.site.register(Terms, TermsAdmin)
