from djoser.serializers import UserCreateSerializer, UserSerializer
from djoser.serializers import TokenCreateSerializer
from django.contrib.auth import get_user_model
from rest_framework import serializers
from accounts.models import ProfilePicture
User = get_user_model()
# from rest_framework import serializers


class ProfilePictureSerializer(serializers.ModelSerializer):
    image_url = serializers.ImageField(source='image',
                                       max_length=None, use_url=True, allow_null=True, required=False)

    class Meta:
        model = ProfilePicture
        fields = ('id', 'image', 'image_url')


class UserCreateSerializer(UserCreateSerializer):

    class Meta(UserCreateSerializer.Meta):
        model = User
        fields = ('id', 'email', 'first_name', 'paid',
                  'last_name', 'referrer', 'password')


class UserSerializer(UserSerializer):

    def get_image(self, obj):
        try:
            avatar = ProfilePicture.objects.get(user=obj)
            serializer = ProfilePictureSerializer(avatar, read_only=True)
            request = self.context.get('request')
            return request.build_absolute_uri(serializer.data['image'])
        except:
            return ''

    avatar = serializers.SerializerMethodField(method_name='get_image')

    class Meta(UserSerializer.Meta):
        model = User
        fields = ('id', 'email', 'first_name', 'last_name', 'paid',
                  'avatar')


class UserSerializerOther(UserSerializer):

    def get_image(self, obj):
        try:
            avatar = ProfilePicture.objects.get(user=obj)
            serializer = ProfilePictureSerializer(avatar, read_only=True)
            request = self.context.get('request')
            return request.build_absolute_uri(serializer.data['image'])
        except:
            return ''

    avatar = serializers.SerializerMethodField(method_name='get_image')

    class Meta(UserSerializer.Meta):
        model = User
        fields = ('id', 'first_name', 'last_name',
                  'avatar')
