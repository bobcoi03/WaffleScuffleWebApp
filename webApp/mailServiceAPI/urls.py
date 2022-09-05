from django.urls import path

from . import views\

urlpatterns = [
    path('', views.index, name="index"),
    path('send-password-reset-email', views.send_password_reset_email, name="send_password_reset_email")
]
