from django.db import models
from django.contrib.auth.models import User
from post.models import Post, Reply
import django.utils
from datetime import timedelta
# Create your models here.
# Extends from the User model provided by Django.contrib.auth.models

def get_next_day():
	return django.utils.timezone.now() + django.utils.timezone.timedelta(days=2)

class UserExtended(models.Model):
	user = models.OneToOneField(User, on_delete=models.CASCADE)
	bio = models.TextField(null=True, blank=True, max_length=50000)
	profile_image = models.ImageField(default='', upload_to="profile_images")
	liked_posts = models.ManyToManyField(Post)
	liked_replies = models.ManyToManyField(Reply)
	saved_post_text = models.TextField(null=True, blank=True, max_length=50000)
	account_confirmed = models.BooleanField(default=False)

class AccountConfirmationEmail(models.Model):
	user = models.OneToOneField(User, on_delete=models.CASCADE)
	created_date = models.DateTimeField(default=django.utils.timezone.now)
	expiration_date = models.DateTimeField(default=get_next_day)
	url = models.CharField(max_length=20, unique=True)

	def expired(self):
		return django.utils.timezone.now() > self.expiration_date

class ResetPasswordEmail(models.Model):
	user = models.OneToOneField(User, on_delete=models.CASCADE)
	created_date = models.DateTimeField(default=django.utils.timezone.now)
	expiration_date = models.DateTimeField(default=get_next_day)
	url = models.CharField(max_length=20, unique=True)

	def expired(self):
		return django.utils.timezone.now() > self.expiration_date