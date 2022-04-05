from rest_framework import viewsets, permissions, serializers
from django.shortcuts import get_list_or_404, get_object_or_404
from .models import Category, Subcategory, Article
from accounts.models import UserAccount
from articles.serializers import CategorySerializer, SubcategorySerializer, ArticleSerializer, CommentSerializer, VoteSerializer
from articles.models import Category, Subcategory, Article
from rest_framework.generics import (
    CreateAPIView, ListAPIView, DestroyAPIView, UpdateAPIView, RetrieveAPIView)
# from rest_framework.views import APIView
# from django.contrib.auth import get_user_model
from rest_framework.pagination import PageNumberPagination
from rest_framework.filters import SearchFilter, OrderingFilter
from fluent_comments.models import FluentComment
from django.contrib.contenttypes.models import ContentType
from rest_framework.response import Response
from datetime import datetime
from django.utils import timezone
from django.conf import settings
from vote.views import VoteMixin
# from vote.managers import VotableManager
from vote.models import Vote
from rest_framework import status


class CategoryUserListView(ListAPIView):
    serializer_class = CategorySerializer
    permission_classes = [permissions.AllowAny]
    queryset = Category.objects.filter(is_active=True)
    pagination_class = None


class CategoryUserRetrieveView(RetrieveAPIView):
    serializer_class = CategorySerializer
    permission_classes = [permissions.AllowAny]
    queryset = Category.objects.filter(is_active=True)


class SubcategoryUserListView(ListAPIView):
    serializer_class = SubcategorySerializer
    permission_classes = [permissions.AllowAny]
    pagination_class = None
    queryset = Subcategory.objects.filter(is_active=True)


class SubcategoryUserRetrieveView(RetrieveAPIView):
    serializer_class = SubcategorySerializer
    permission_classes = [permissions.AllowAny]
    queryset = Subcategory.objects.filter(is_active=True)


class CategoryViewSet(viewsets.ModelViewSet):
    serializer_class = CategorySerializer
    permission_classes = [permissions.IsAdminUser]
    queryset = Category.objects.all()


class SubtegoryViewSet(viewsets.ModelViewSet):
    serializer_class = SubcategorySerializer
    permission_classes = [permissions.IsAdminUser]
    queryset = Subcategory.objects.all()


class ArticleCreateView(VoteMixin, CreateAPIView):
    serializer_class = ArticleSerializer
    permission_classes = [permissions.IsAdminUser]

    def get_queryset(self):
        return Article.objects.all().order_by('-date_created')

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)


class ArticleListUserView(VoteMixin, ListAPIView):
    serializer_class = ArticleSerializer
    permission_classes = [permissions.AllowAny]
    pagination_class = PageNumberPagination
    queryset = Article.objects.filter(is_active=True).order_by('-date_created')


class ArticleSearchListView(VoteMixin, ListAPIView):
    queryset = Article.objects.filter(is_active=True).order_by('-date_created')
    serializer_class = ArticleSerializer
    permission_classes = [permissions.AllowAny]
    pagination_class = PageNumberPagination
    filter_fields = ('title', 'author_email')
    filter_backends = (SearchFilter, OrderingFilter)
    search_fields = ('title', 'body', 'author__email',
                     'category__name', 'subcategory__name')


class ArticleListAdminView(VoteMixin, ListAPIView):
    serializer_class = ArticleSerializer
    permission_classes = [permissions.IsAdminUser]
    # authentication_classes = (TokenAuthentication,)
    pagination_class = PageNumberPagination
    queryset = Article.objects.all().order_by('-date_created')


class ArticleUpdateView(VoteMixin, UpdateAPIView):
    serializer_class = ArticleSerializer
    permission_classes = [permissions.IsAdminUser]
    queryset = Article.objects.all()


class ArticleDeleteView(VoteMixin, DestroyAPIView):
    serializer_class = ArticleSerializer
    permission_classes = [permissions.IsAdminUser]
    queryset = Article.objects.all()


class ArticlerRetrieveAdminView(VoteMixin, RetrieveAPIView):
    serializer_class = ArticleSerializer
    permission_classes = [permissions.AllowAny]
    queryset = Article.objects.all()


class ArticlerRetrieveUserView(VoteMixin, RetrieveAPIView):
    serializer_class = ArticleSerializer
    permission_classes = [permissions.AllowAny]
    queryset = Article.objects.filter(is_active=True)


class ArticleCatListView(VoteMixin, ListAPIView):
    serializer_class = ArticleSerializer
    permission_classes = [permissions.AllowAny]
    pagination_class = PageNumberPagination

    def get_queryset(self):
        cat = get_object_or_404(Category, id=self.kwargs.get('category'))
        return Article.objects.filter(category=cat, is_active=True).order_by('-date_created')


class ArticleSubcatListView(VoteMixin, ListAPIView):
    serializer_class = ArticleSerializer
    permission_classes = [permissions.AllowAny]
    pagination_class = PageNumberPagination

    def get_queryset(self):
        subcat = get_object_or_404(
            Subcategory, id=self.kwargs.get('subcategory'))
        return Article.objects.filter(subcategory=subcat, is_active=True).order_by('-date_created')


class UsersArticleListView(VoteMixin, ListAPIView):
    serializer_class = ArticleSerializer
    permission_classes = [permissions.AllowAny]
    pagination_class = PageNumberPagination

    def get_queryset(self):
        user = get_object_or_404(
            UserAccount, id=self.kwargs.get('user'))
        return Article.objects.filter(author=user, is_active=True).order_by('-date_created')


class CommentViewSet(viewsets.ModelViewSet):
    queryset = FluentComment.objects.all()
    serializer_class = CommentSerializer

    def create(self, request, *args, **kwargs):
        if request.user.is_authenticated:
            data = self.request.data
            comment = data['comment']
            article = data['article']
            if 'parent' in data:
                parent = data['parent']
            else:
                parent = None
            submit_date = timezone.now()
            content = ContentType.objects.get(model__iexact="Article").pk
            comment = FluentComment.objects.create(object_pk=article, comment=comment, submit_date=submit_date,
                                                   content_type_id=content, user_id=self.request.user.id, user_name=self.request.user.first_name + ' '+self.request.user.last_name, site_id=settings.SITE_ID, parent_id=parent)
            serializer = CommentSerializer(
                comment, context={'request': request})
            return Response(serializer.data)

    def destroy(self, request, *args, **kwargs):
        try:
            instance = self.get_object()
            if instance.user_id == request.user.id:
                self.perform_destroy(instance)
            else:
                return Response(status=status.HTTP_401_UNAUTHORIZED)
        except:
            pass
        return Response(status=status.HTTP_204_NO_CONTENT)

    def update(self, request, *args, **kwargs):
        # try:
        instance = self.get_object()
        if instance.user_id == self.request.user.id:
            instance.comment = self.request.data['comment']
            self.perform_update(instance)
            serializer = CommentSerializer(instance)
            # data = {"id": instance.id, "comment": instance.comment,
            #         "children": instance.children}
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            return Response(status=status.HTTP_401_UNAUTHORIZED)
        # except:
        #     pass
        return Response(status=status.HTTP_204_NO_CONTENT)


class ArticleComment(ListAPIView):
    permission_classes = [permissions.AllowAny]
    serializer_class = CommentSerializer
    pagination_class = PageNumberPagination

    def get_queryset(self):
        article = get_object_or_404(
            Article, id=self.kwargs.get('article'))
        return FluentComment.objects.filter(
            object_pk=article.pk, is_public=True, parent=None).order_by('submit_date')


# class VoteViewset(viewsets.ModelViewSet):
#     permission_classes = [permissions.IsAuthenticated]
#     serializer_class = VoteSerializer
#     queryset = Vote.objects.all()

#     def create(self, request, *args, **kwargs):
#         if request.user.is_authenticated:
#             data = self.request.data
#             action = 1
#             article = data['article']
#             create_at = datetime.now()
#             content = ContentType.objects.get(model__iexact="Article").pk
#             vote = Vote.objects.create(
#                 object_id=article, action=action, content_type_id=content, user_id=self.request.user.id, create_at=create_at)
#             serializer = VoteSerializer(vote, context={'request': request})
#             return Response(serializer.data)
