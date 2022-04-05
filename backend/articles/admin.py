from django.contrib import admin
from django_summernote.admin import SummernoteModelAdmin
from articles.models import Category, Subcategory, Article


# Threaded comment imports
from django.utils.translation import ugettext_lazy as _
from threadedcomments.compat import BASE_APP
from threadedcomments.models import ThreadedComment
from threadedcomments.admin import ThreadedCommentsAdmin


class ArticleModelAdmin(SummernoteModelAdmin):
    # class ArticleModelAdmin(admin.ModelAdmin):
    list_display = [
        'title',
        'author',
        'author',
        'category',
        'subcategory'
    ]
    summernote_fields = ('body',)
    search_fields = ('author__email', 'title', 'body', 'author__first_name',
                     'author__last_name', 'subcategory__name', 'category__name')
    fields = ('title', 'body', 'author', 'category',
              'subcategory', 'article_image')
    list_filter = ('date_created', 'subcategory__name', 'category__name')
    list_per_page = 20

    def get_form(self, request, *args, **kwargs):
        form = super(ArticleModelAdmin, self).get_form(
            request, *args, **kwargs)
        form.base_fields['author'].initial = request.user
        return form
    # readonly_fields = ('author',)


class SubcategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'category')
    list_filter = ('category__name',)
    list_per_page = 20


# Overriding ThreadedCommentsAdmin


# This code is not in the .compat module to avoid admin imports in all other code.
# The admin import usually starts a model registration too, hence keep these imports here.
if BASE_APP == 'django.contrib.comments':
    # Django 1.7 and below
    from django.contrib.comments.admin import CommentsAdmin
elif BASE_APP == 'django_comments':
    # Django 1.8 and up
    from django_comments.admin import CommentsAdmin
else:
    raise NotImplementedError()


class MyThreadedCommentsAdmin(CommentsAdmin):
    fieldsets = (
        (None,
         {'fields': ('content_type', 'object_pk', 'site')}
         ),
        (_('Content'),
         {'fields': ('user', 'user_name', 'user_email',
                     'user_url', 'title', 'comment')}
         ),
        (_('Hierarchy'),
         {'fields': ('parent',)}
         ),
        (_('Metadata'),
         {'fields': ('submit_date', 'ip_address', 'is_public', 'is_removed')}
         ),
    )

    list_display = ('name', 'title', 'content_type', 'object_pk', 'parent',
                    'ip_address', 'submit_date', 'is_public', 'is_removed')
    search_fields = ('title', 'comment', 'user__email', 'user_name',
                     'user_email', 'user_url', 'ip_address')
    raw_id_fields = ("parent",)


admin.site.register(Category)
admin.site.register(Subcategory, SubcategoryAdmin)
admin.site.register(Article, ArticleModelAdmin)
admin.site.unregister(ThreadedComment)
admin.site.register(ThreadedComment, MyThreadedCommentsAdmin)
