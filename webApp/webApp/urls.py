"""webApp URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include, re_path
from django.conf import settings
from django.conf.urls.static import static
# Keep frontend path last

urlpatterns = [
    path('admin/', admin.site.urls),
    path('mail-service-api/', include('mailServiceAPI.urls')),
    path('user-auth/', include('user.urls')),
    path('post/', include('post.urls')),
    path('friendship/', include('friendship.urls')),
    path('chat/', include('chatApp.urls')),
    re_path(r'', include('django_private_chat2.urls', namespace='django_private_chat2')),
]

urlpatterns += static(settings.MEDIA_URL,
    document_root=settings.MEDIA_ROOT)

urlpatterns.append(path('', include('frontend.urls')))
