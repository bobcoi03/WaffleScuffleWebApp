from django.urls import path

from . import views

urlpatterns = [
	path('create-user', views.create_user, name='create-user'),
	path('get-user-extended-object-by-username/username=<str:username>', views.get_user_extended_object_by_username, name="get_user_extended_object_by_username"),
	path('change-bio', views.change_bio, name="change_bio"),
	path('reset-password', views.reset_password, name="reset_password"),
	path('get-path-to-profile-image-by-username/username=<str:username>', views.get_path_to_profile_image_by_username, name="get_path_to_profile_image_by_username"),
	path('if-already-friends/user_pk=<int:user_pk>', views.if_already_friends, name="if_already_friends"),
	path('search-username/query=<str:query>', views.search_username, name="search_username"),
	path('get-user-extended-object-by-pk/<int:user_pk>', views.get_user_extended_object_by_pk, name="get_user_extended_object_by_pk"),
	path('send-friend-request/user_pk=<int:user_pk>', views.send_friend_request, name="send_friend_request"),
	path('get-friends-user-objects', views.get_friends_user_objects, name="get_friends_user_objects"),
	path('get-csrftoken', views.get_csrftoken, name='get_csrftoken'),
	path('signin', views.signin, name='signin'),
	path('get-user-object', views.get_user_object, name='get-user-object'),
	path('logout', views.logout_view, name='logout'),
	path('delete-user', views.delete_user, name='delete_user'),
	path('get-username-by-pk/<int:pk>', views.get_username_by_pk, name='get_username_by_pk'),
	path('save-changes', views.save_changes, name="save_changes"),
	path('upload-profile-picture', views.upload_profile_picture, name="upload_profile_picture"),
	path('get-user-extended-object', views.get_user_extended_object, name="get_user_extended_object"),
	path('get-path-to-profile-image-by-pk/<int:user_pk>', views.get_path_to_profile_image_by_pk, name="get_path_to_profile_image_by_pk")
]
