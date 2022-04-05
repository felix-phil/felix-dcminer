from vote.models import Vote
from fluent_comments.models import FluentComment
from accounts.models import UserAccount
from rest_framework import serializers
from articles.models import Article, Category, Subcategory
from django.contrib.auth import get_user_model
# from djoser.serializers import UserSerializer
from accounts.serializers import UserSerializerOther, ProfilePictureSerializer
from accounts.models import ProfilePicture
from urllib.parse import urlsplit
# from bs4 import BeautifulSoup
from bs4 import BeautifulSoup
User = get_user_model()


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ('id', 'name', 'is_active')


class SubcategorySerializer(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True)

    class Meta:
        model = Subcategory
        fields = ('id', 'name', 'is_active', 'category')

        def to_representation(self, instace):
            representation = super().to_representation(instace)
            representation['category'] = {
                "id": instace.category.id, "name": instace.category.name}


class RecursiveField(serializers.Serializer):
    def to_representation(self, value):
        serializer = self.parent.parent.__class__(value, context=self.context)
        return serializer.data


class CommentSerializer(serializers.ModelSerializer):
    children = RecursiveField(many=True)

    def get_user_avatar(self, obj):
        try:
            user_avatar = ProfilePicture.objects.filter(
                user=obj.user_id).first()
            serializer = ProfilePictureSerializer(user_avatar, read_only=True)
            request = self.context.get('request')
            return request.build_absolute_uri(serializer.data['image'])
        except:
            return ''
    user_avatar = serializers.SerializerMethodField(
        method_name='get_user_avatar')

    class Meta:
        model = FluentComment
        fields = ('comment', 'id', 'children',
                  'user_id', 'user_name', 'object_pk', 'user_avatar', 'submit_date')


class VoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Vote
        fields = ('user_id', 'id', 'object_id', 'action')


class ArticleSerializer(serializers.ModelSerializer):
    subcategory = SubcategorySerializer(read_only=True)
    author = UserSerializerOther(read_only=True)

    def get_body(self, obj):
        # theObject = Article.objects.filter(id=obj.id).first()
        request = self.context.get('request')
        soup = BeautifulSoup(obj.body, "lxml")
        for img in soup.find_all('img'):
            img_url = img['src']
            # new_url = urlsplit(img_url)._replace(query=None).geturl()
            new_url = request.build_absolute_uri(img_url)
            img['src'] = new_url
        return str(soup)
    body = serializers.SerializerMethodField(method_name='get_body')

    class Meta:
        model = Article
        fields = ('id', 'title', 'body', 'article_image',
                  'category', 'subcategory', 'author', 'date_created')

        def to_representation(self, instace):
            representation = super().to_representation(instace)
            representation["subcategory"] = SubcategorySerializer(instace).data
            representation["author"] = {
                "id": instace.author.id, "name": instace.author.name}

            return representation

    # def get_comments(self, obj):
    #     article_comment = FluentComment.objects.filter(
    #         object_pk=obj.id, parent_id=None)
    #     serializer = CommentSerializer(article_comment, many=True)
    #     return serializer.data

# class VoteSerializer(serializers.ModelSerializer)
