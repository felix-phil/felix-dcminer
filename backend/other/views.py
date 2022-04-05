from django.shortcuts import render
from rest_framework.generics import CreateAPIView, ListAPIView
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.status import HTTP_200_OK
from rest_framework import permissions
from other.models import About, Contacts, PrivacyPolicy, Terms
from other.serializers import AboutSerializer, ContactSerializer, PrivacyPolicySerializer, TermsSerializer


class CreateNewContact(CreateAPIView):
    serializer_class = ContactSerializer
    permission_classes = [permissions.AllowAny]
    queryset = Contacts.objects.all()


class AboutListView(ListAPIView):
    serializer_class = AboutSerializer
    permission_classes = [permissions.AllowAny]
    queryset = About.objects.filter(is_active=True).order_by('title')
    # pagination_class = None


class PrivacyPolicyView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request, *args, **kwargs):
        policy = PrivacyPolicy.objects.first()
        data = PrivacyPolicySerializer(policy).data
        return Response(data, HTTP_200_OK)


class TermsView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request, *args, **kwargs):
        terms = Terms.objects.first()
        data = TermsSerializer(terms).data
        return Response(data, HTTP_200_OK)
