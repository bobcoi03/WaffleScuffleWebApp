from django.shortcuts import render
from django.http import HttpResponse
from django.contrib.auth.decorators import login_required
from post.models import Post, Reply
from datetime import datetime
from django.contrib.auth.models import User
from django.core.serializers import serialize
from user.models import UserExtended
from django.views.decorators.csrf import ensure_csrf_cookie, csrf_protect, csrf_exempt

import random, string
def random_string(length):
	return ''.join(random.choice(string.ascii_uppercase + string.digits) for _ in range(length))

def index(request):
    return HttpResponse("post index")

@login_required
def create_post(request):
	"""
	Handles creating Post objects with FormData
	"""
	if request.method == 'POST':
		# Handle user input
		data = request.POST
		files = request.FILES
		image_post = files.get('post_image')
		user = User.objects.get(email=request.user.email)
		text = data.get('text')
		url = random_string(19)
		post = Post(user=user,text=text, url=url, image=image_post)
		try:
			post.save()
		except Exception as e:
			print(e.__doc__)
			print(e)
			return HttpResponse("Failed to create post")

		return HttpResponse("Post created successfully")
	else:
		return HttpResponse("this endpoint only accepts http POST requests")

def get_post_objects_by_user(request):
	"""
	Returns json of all post objects made by the user making the request
	"""
	if request.user.is_anonymous:
		return HttpResponse("Please make a request from an signed in user")

	postList = Post.objects.filter(user=request.user)
	return HttpResponse(serialize("json", postList), headers={"Content-Type":"application/json"})

def get_post_comments_by_pk(request, pk):
	"""
	Returns json of comments objects by post primary key as pk
	"""
	post = Post.objects.get(pk=pk)

	replies = Reply.objects.filter(post=post)

	return HttpResponse(serialize("json", replies), headers={"Content-Type":"application/json"})

@login_required
def register_post_like(request, post_pk):
	"""
	This handles logic when user likes a post identified by primary key
	ie. post_pk

	If UserExtended not created for request.user -->
		create UserExtended,

	If post already liked by user & post.likes > 0 -->
		decrement post.likes by 1 .ie post.likes = post.likes - 1
		remove post from UserExtended(user=request.user).liked_posts
	else
		increment post.likes by 1 .ie post.likes = post.likes + 1
		add post to UserExtended(user=request.user).liked_posts
	"""
	if request.method == 'GET':
		user = request.user
		if UserExtended.objects.filter(user=user).exists():
			pass
		else:
			createUserExtended = UserExtended(user=user)
			createUserExtended.save()
		userExtended = UserExtended.objects.get(user=user)

		post = Post.objects.get(pk=post_pk)

		if UserExtended.objects.filter(liked_posts=post, user=user).exists():
			if post.likes > 0:
				post.likes -= 1
				post.save()
				userExtended.liked_posts.remove(post)
		else:
			post.likes += 1
			post.save()
			userExtended.liked_posts.add(post) # add user
		return HttpResponse(status=200)

def get_post_likes(request, post_pk):
	"""
	returns string of the number of likes of post identified
	by the post primary key
	"""
	post = Post.objects.get(pk=post_pk)
	return HttpResponse(post.likes)

@login_required
def if_user_liked_post(request, post_pk):
	"""
	returns true or false as string.
	true if the user making request has liked
	post identified by post primary key or post_pk
	"""
	post = Post.objects.get(pk=post_pk)
	if UserExtended.objects.filter(liked_posts=post, user=request.user).exists():
		return HttpResponse("true")
	return HttpResponse("false")


def get_post_objects_by_published_datetime(request):
	"""
	returns JSON of posts objects ordered by published_datetime in decending order
	ie. newest to oldest
	"""
	if request.method == 'GET':
		posts = Post.objects.order_by('-published_datetime')

		return HttpResponse(serialize("json", posts), headers={"Content-Type":"application/json"})

def get_post_objects_by_likes(request):
	"""
	Returns JSON of Post objects ordered by likes in decending order
	ie. most liked post to least liked post
	"""
	if request.method == 'GET':
		posts = Post.objects.order_by('-likes')
		return HttpResponse(serialize("json", posts))

def get_post_objects_by_likes_in_range(request, range1, range2):
	"""
	Returns JSON of Post objects ordered by likes in descending order,
	but in range of range(range1, range2)
	ie.
	get_post_objects_by_likes_in_range(request, 0, 4) -> [PostObject: i=0, ..., PostObject: i=3]
	"""
	if request.method == 'GET':
		posts = Post.objects.order_by('-likes')
		returnPosts = []
		# iterate through it through range(range1, range2)
		for i in range(range1, range2):
			returnPosts.append(posts[i])
		return HttpResponse(serialize("json", returnPosts))

def get_post_by_url(request, url):
	"""
	return post object identified by url
	"""
	if request.method == 'GET':
		post = [Post.objects.get(url=url)]
		return HttpResponse(serialize("json", post))

@login_required
@csrf_protect
def save_post_text(request):
	"""
	This view is ran when user closes CreatePost component, saving the text that is written in textfield.
	Saves FormData['text'].
	return string: response message
	"""
	if request.method == 'POST':
		data = request.POST
		text = data.get('text')

		user = UserExtended.objects.get(user=request.user)

		user.saved_post_text = text
		user.save()
		return HttpResponse("saved successfully")

@login_required
def get_saved_post_text(request):
	"""
	This is to set the defaultValue in textfield when user opens up CreatePost component
	returns string: text of saved_post_text
	"""
	user = UserExtended.objects.get(user=request.user)

	text = user.saved_post_text

	return HttpResponse(text)

@login_required
@csrf_protect
def create_comment(request, post_pk):
	"""
	This returns string: response message indicating the outcome of the request.
	This view handles POST requests for creating comments by user.

	"""
	if request.method == 'POST':
		post = Post.objects.get(pk=post_pk)
		data = request.POST
		comment_text = data.get('comment')
		url = random_string(19)
		create_reply = Reply(user=request.user, post=post, text=comment_text, url=url)

		try:
			create_reply.save()
		except Exception as e:
			print(e.__doc__)
			print(e)
			return HttpResponse("Failed to create Commnet")
		return HttpResponse("Comment created successfully")
	else:
		return HttpResponse("This endpoint only accepts POST requests")

@login_required
def register_comment_like(request, comment_pk):
	"""
	This handles logic when user likes a comment identified by primary key
	ie. comment_pk

	If UserExtended not created for request.user -->
		create UserExtended,

	If comment already liked by user & comment.likes > 0 -->
		decrement comment.likes by 1 .ie comment.likes = comment.likes - 1
		remove post from UserExtended(user=request.user).liked_replies
	else
		increment comment.likes by 1 .ie comment.likes = comment.likes + 1
		add comment to UserExtended(user=request.user).liked_replies
	"""
	if request.method == 'GET':
		user = request.user
		if UserExtended.objects.filter(user=user).exists():
			pass
		else:
			createUserExtended = UserExtended(user=user)
			createUserExtended.save()
		userExtended = UserExtended.objects.get(user=user)

		reply_object = Reply.objects.get(pk=comment_pk)

		if UserExtended.objects.filter(user=request.user, liked_replies=reply_object).exists():
			if reply_object.likes > 0:
				reply_object.likes -= 1
				reply_object.save()
				userExtended.liked_replies.remove(reply_object)
		else:
			reply_object.likes += 1
			reply_object.save()
			userExtended.liked_replies.add(reply_object) # add reply object to liked_replies list of user
		return HttpResponse(status=200)

@login_required
def get_comment_likes(request, comment_pk):
	"""
	returns string of the number of likes of comment identified
	by the comment primary key: comment_pk
	"""
	reply = Reply.objects.get(pk=comment_pk)
	return HttpResponse(reply.likes)

@login_required
def if_user_liked_comment(request, comment_pk):
	"""
	returns true or false as string.
	true if the user making request has liked
	comment identified by comment primary key: comment_pk
	"""
	reply = Reply.objects.get(pk=comment_pk)
	if UserExtended.objects.filter(liked_replies=reply, user=request.user).exists():
		print("true")
		return HttpResponse("true")
	print("false")
	return HttpResponse("false")

def get_post_objects_by_user_username_sort_by_new(request, username):
	user = User.objects.get(username=username)
	postList = Post.objects.filter(user=user).order_by('-published_datetime')
	return HttpResponse(serialize("json", postList))

def get_post_objects_by_user_username_sort_by_likes(request, username):
	user = User.objects.get(username=username)
	postList = Post.objects.filter(user=user).order_by('-likes')
	return HttpResponse(serialize("json", postList))

def get_path_to_post_image_by_post_pk(request, post_pk):
	if request.method == 'GET':
		post = Post.objects.get(pk=post_pk)

		if type(post.image.url) == str:
			return HttpResponse(post.image.url)
		else:
			return HttpResponse(status=404)
	else:
		return HttpResponse("this endpoint only accepts http GET requests")