from django.db import models
from django.contrib.auth.models import User
import datetime
import string, random
from django.conf import settings
from django.contrib.auth import get_user_model
import django.utils

# Create your models here.

class Post(models.Model):
	user = models.ForeignKey(get_user_model(), on_delete=models.CASCADE)
	published_datetime = models.DateTimeField(default=django.utils.timezone.now)
	text = models.TextField(null=True, blank=True, max_length=50000)
	likes = models.IntegerField(default=0)
	shares = models.IntegerField(default=0)
	image = models.ImageField(default='', upload_to='post_images')
	url = models.CharField(max_length=20, unique=True)

	def __str__(self):
		return f"{self.text} by {self.user}"

class Reply(models.Model):
	user = models.ForeignKey(get_user_model(), on_delete=models.CASCADE)
	post = models.ForeignKey(Post, on_delete=models.CASCADE)
	published_datetime = models.DateTimeField(default=django.utils.timezone.now)
	likes = models.IntegerField(default=0)
	text = models.TextField(null=True, blank=True, max_length=50000)
	url = models.CharField(max_length=20, unique=True)

	def __str__(self):
		return f"{self.user} commented on {self.post}"



