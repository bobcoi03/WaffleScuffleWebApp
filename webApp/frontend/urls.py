from django.urls import path, re_path
from .views import index

urlpatterns = [
    re_path(r'^$', index),
    re_path(r'^(?:.*)/?$', index)
]