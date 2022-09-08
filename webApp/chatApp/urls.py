from django.urls import path, re_path, include

from . import views
from django.contrib.auth import get_user_model
from django.http import JsonResponse
from django.contrib.auth.models import AbstractBaseUser
from django.contrib.auth.mixins import LoginRequiredMixin
from django.views.generic import ListView

UserModel = get_user_model()

class UsersListView(LoginRequiredMixin, ListView):
    http_method_names = ['get', ]

    def get_queryset(self):
        return UserModel.objects.all().exclude(id=self.request.user.id)

    def render_to_response(self, context, **response_kwargs):
        users: List[AbstractBaseUser] = context['object_list']

        data = [{
            "username": user.get_username(),
            "pk": str(user.pk)
        } for user in users]
        return JsonResponse(data, safe=False, **response_kwargs)

urlpatterns = [
	path('users/', UsersListView.as_view(), name='users_list'),
	path('', views.index),
]