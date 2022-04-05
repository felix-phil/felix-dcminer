from django.urls import path
from rest_framework import routers

from other.views import AboutListView, CreateNewContact, PrivacyPolicyView, TermsView

urlpatterns = [
    path('api/contact/', CreateNewContact.as_view()),
    path('api/about/', AboutListView.as_view()),
    path('api/policy/', PrivacyPolicyView.as_view()),
    path('api/terms/', TermsView.as_view())
]
