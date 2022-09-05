from django.urls import path

from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('create-post', views.create_post, name='create_post'),
    path('get-post-objects-by-user', views.get_post_objects_by_user, name="get_post_objects_by_user"),
    path('get-post-comments-by-pk/<int:pk>', views.get_post_comments_by_pk, name="get_post_comments_by_pk"),
    path('register-post-like/<int:post_pk>', views.register_post_like, name="register_post_like"),
    path('get-post-likes/<int:post_pk>', views.get_post_likes, name="get_post_likes"),
    path('get-post-objects-by-published-datetime', views.get_post_objects_by_published_datetime, name="get_post_objects_by_published_datetime"),
    path('get-post-objects-by-likes', views.get_post_objects_by_likes, name="get_post_objects_by_likes"),
    path('if-user-liked-post/<int:post_pk>', views.if_user_liked_post, name="if_user_liked_post"),
    path('get-post-by-url/<str:url>', views.get_post_by_url, name="get_post_by_url"),
    path('save-post-text', views.save_post_text, name="save_post_text"),
    path('get-saved-post-text', views.get_saved_post_text, name="get_saved_post_text"),
    path('create-comment/<int:post_pk>', views.create_comment, name="create_comment"),
    path('register-comment-like/<int:comment_pk>', views.register_comment_like, name="register_comment_like"),
    path('get-comment-likes/<int:comment_pk>', views.get_comment_likes, name="get_comment_likes"),
    path('if-user-liked-comment/<int:comment_pk>', views.if_user_liked_comment, name="if_user_liked_comment"),
    path('get-post-objects-by-user-username-sort-by-new/<str:username>', views.get_post_objects_by_user_username_sort_by_new, name="get_post_objects_by_user_username_sort_by_new"),
    path('get-post-objects-by-likes-in-range/range1=<str:range1>range2=<str:range2>', views.get_post_objects_by_likes_in_range, name="get_post_objects_by_likes_in_range"),
    path('get-post-objects-by-user-username-sort-by-likes/<str:username>', views.get_post_objects_by_user_username_sort_by_likes, name="get_post_objects_by_user_username_sort_by_likes"),
    path('get-path-to-post-image-by-post-pk/<int:post_pk>', views.get_path_to_post_image_by_post_pk, name="get_path_to_post_image_by_post_pk")
]
