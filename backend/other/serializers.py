from rest_framework import serializers
from other.models import About, Contacts, PrivacyPolicy, Terms
from bs4 import BeautifulSoup


class ContactSerializer(serializers.ModelSerializer):
    class Meta:
        model = Contacts
        fields = ('id', 'firstname', 'lastname', 'email', 'message')


class AboutSerializer(serializers.ModelSerializer):
    def get_about_details(self, obj):
        # theObject = Article.objects.filter(id=obj.id).first()
        request = self.context.get('request')
        soup = BeautifulSoup(obj.about_details, "lxml")
        for img in soup.find_all('img'):
            img_url = img['src']
            new_url = request.build_absolute_uri(img_url)
            img['src'] = new_url
        return str(soup)
    about_details = serializers.SerializerMethodField(
        method_name='get_about_details')

    class Meta:
        model = About
        fields = ('id', 'title', 'about_details', 'image', 'date_created')


class PrivacyPolicySerializer(serializers.ModelSerializer):
    def get_details(self, obj):
        request = self.context.get('request')
        soup = BeautifulSoup(obj.details, "lxml")
        for img in soup.find_all('img'):
            img_url = img['src']
            new_url = request.build_absolute_uri(img_url)
            img['src'] = new_url
        return str(soup)
    details = serializers.SerializerMethodField(method_name='get_details')

    class Meta:
        model = PrivacyPolicy
        fields = ('id', 'title', 'details')


class TermsSerializer(serializers.ModelSerializer):
    def get_details(self, obj):
        request = self.context.get('request')
        soup = BeautifulSoup(obj.details, "lxml")
        for img in soup.find_all('img'):
            img_url = img['src']
            new_url = request.build_absolute_uri(img_url)
            img['src'] = new_url
        return str(soup)
    details = serializers.SerializerMethodField(method_name='get_details')

    class Meta:
        model = Terms
        fields = ('id', 'title', 'details')
