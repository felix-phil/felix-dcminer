from django.urls import path
from rest_framework import routers
from django.conf.urls import url
from .api import (
    CategoryViewSet, SubtegoryViewSet, ArticleCreateView, ArticleDeleteView,
    ArticleListAdminView, ArticleListUserView, ArticleUpdateView, ArticlerRetrieveAdminView,
    ArticleSearchListView, CategoryUserListView, CategoryUserRetrieveView,
    SubcategoryUserListView, SubcategoryUserRetrieveView, ArticleCatListView,
    ArticleSubcatListView, UsersArticleListView, ArticlerRetrieveUserView, CommentViewSet, ArticleComment
)

router = routers.DefaultRouter()
router.register('api/category', CategoryViewSet, 'categories')
router.register('api/subcategory', SubtegoryViewSet, 'subcategories')
router.register('api/comment', CommentViewSet, 'comments')
# router.register('api/vote', VoteViewset, 'vote')

# Categories and Subcategories in viewsets accessible to only admins
urlpatterns = router.urls

# Categories and Subcategories in viewsets accessible to Any User
urlpatterns += [
    path('api/cat/user/', CategoryUserListView.as_view()),
    path('api/cat/user/<pk>', CategoryUserRetrieveView.as_view()),
    path('api/subcat/user/', SubcategoryUserListView.as_view()),
    path('api/subcat/user/<pk>', SubcategoryUserRetrieveView.as_view()),
    # url(r'^', include(voteUrls))
]
# Patterns for fetching articles (both Admin and AnyUser)
urlpatterns += [
    path('api/article/', ArticleListAdminView.as_view()),  # Admin
    path('api/article/user/', ArticleListUserView.as_view()),  # Any user
    path('api/article/create', ArticleCreateView.as_view()),  # Admin
    path('api/article/<pk>', ArticlerRetrieveAdminView.as_view()),  # Admin
    path('api/article/user/<pk>', ArticlerRetrieveUserView.as_view()),  # Any User
    path('api/article/<pk>/update', ArticleUpdateView.as_view()),  # Admin
    path('api/article/<pk>/delete', ArticleDeleteView.as_view()),  # Admin
    path('api/article/search/', ArticleSearchListView.as_view()),  # Any User
    path('api/article/cat/<category>/', ArticleCatListView.as_view()),  # Any User
    path('api/article/subcat/<subcategory>/',
         ArticleSubcatListView.as_view()),  # Any User
    path('api/article/author/<user>/',
         UsersArticleListView.as_view()),  # Any User
    path('api/article/comments/<article>/',
         ArticleComment.as_view()),  # Any User
    # path('api/article/vote/<article>/',
    #      VoteArticle.as_view()),  # Any User

]
