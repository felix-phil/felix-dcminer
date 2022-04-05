from django.contrib import admin
from django.urls import path, include, re_path
from django.conf.urls import url
from django.views.generic import TemplateView
from django.conf import settings
from django.conf.urls.static import static
# from votes import urls as voteUrls

urlpatterns = [
    path('admin/', admin.site.urls),
    url(r'^chaining/', include('smart_selects.urls')),
    path("djangoflutterwave/", include("djangoflutterwave.urls",
                                       namespace="djangoflutterwave")),
    path('auth/', include('djoser.urls')),
    path('auth/', include('djoser.urls.jwt')),
    path('auth/', include('djoser.social.urls')),
    path('article/', include('articles.urls')),
    path('auth/', include('accounts.urls')),
    path('payment/', include('payments.urls')),
    path('summernote/', include('django_summernote.urls')),
    path('other/', include('other.urls')),
    path('ads/', include('advertisement.urls'))
    # url(r'^', include(voteUrls))

]
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL,
                          document_root=settings.MEDIA_ROOT)
urlpatterns += [
    re_path(r'^.*', TemplateView.as_view(template_name='index.html'))
]
