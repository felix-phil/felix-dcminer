from django.db import models
from django.contrib.auth import get_user_model
from uuid import uuid4
import os
from PIL import Image
from vote.models import VoteModel
from smart_selects.db_fields import ChainedForeignKey
# from votes.managers import VotableManager
User = get_user_model()


class Category(models.Model):
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(max_length=300)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name


class Subcategory(models.Model):
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(max_length=300)
    category = models.ForeignKey(
        Category, related_name="subcategories", on_delete=models.CASCADE)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name


# def article_image_upload(self, filename):
#     extension = filename.split('.')[-1]
#     filename = 'article_image_{}.{}'.format(uuid4().hex, extension)
#     return os.path.join('images/articles', filename)


class Article(VoteModel, models.Model):
    title = models.CharField(max_length=250)
    body = models.TextField()
    author = models.ForeignKey(
        User, related_name="articles", on_delete=models.CASCADE)

    article_image = models.ImageField(
        upload_to='images/articles', blank=True, null=True)

    category = models.ForeignKey(
        Category, related_name="category", on_delete=models.CASCADE)

    subcategory = ChainedForeignKey(
        Subcategory, chained_field="category", chained_model_field="category", show_all=False, auto_choose=True, sort=True, related_name="subcategory", on_delete=models.CASCADE)

    slug = models.SlugField(unique=True, blank=True, null=True)

    # votes = VotableManager()

    is_active = models.BooleanField(default=True)

    date_created = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title

    # def save(self, *args, **kwargs):

    #     super().save(*args, **kwargs)
    #     if self.article_image:
    #         img = Image.open(self.article_image.path)

    #         # extension = img.filename.split('.')[-1]
    #         extension = img.format
    #         newfilename = 'article_image_{}.{}'.format(uuid4().hex, extension)

    #         if img.height > 1024 or img.width > 1024:
    #             output_size = (1024, 1024)
    #             img.thumbnail(output_size)
    #             # img.filename = newfilename
    #         img.save(newfilename, extension)
