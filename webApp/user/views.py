from django.http import HttpResponse, JsonResponse, HttpResponseRedirect
from django.core.serializers import serialize
from django.contrib.auth import login, logout, authenticate
from django.contrib.auth.decorators import login_required
from django.views.decorators.csrf import ensure_csrf_cookie, csrf_protect, csrf_exempt
from django.contrib.auth.models import User
from django.shortcuts import redirect
from django.core.mail import send_mail
from django.conf import settings
from .models import UserExtended,  AccountConfirmationEmail, ResetPasswordEmail
from friendship.models import Friend, Follow, Block, FriendshipRequest
from django.core.mail import send_mail, EmailMultiAlternatives, EmailMessage
from mailServiceAPI.views import send_account_confirmation_email

# Create your views here.



# This sends csrftoken to client componentDidMount in App.js calls this
@ensure_csrf_cookie
def get_csrftoken(request):
    return HttpResponse(status=204)

@csrf_protect
def create_user(request):
    """
    returns string message depending on whether
    created user successfully or not
    """
    if request.method == 'POST':
        data = request.POST
        first_name = data.get('firstName')
        last_name = data.get('lastName')
        username = data.get('username')
        email = data.get('email')
        password = data.get('password')

        if User.objects.filter(email=email).exists():
            return HttpResponse(f"An account has already been created with the email: {email}. Please try another email !")
        if User.objects.filter(username=username).exists():
            return HttpResponse(f"Username: {username} is taken, please choose another username !")
        # Create user and add to db
        user = User.objects.create_user(username=username, email=email, password=password,first_name=first_name, last_name=last_name)
        userExtended = UserExtended(user=user)
        userExtended.save()
        #send_account_confirmation_email(user.email, user)
        return HttpResponse("successfully created user")

@csrf_protect
def signin(request):
    """
    returns string message depending
    on whether user successfully signed
    in with correct credentials
    """
    if request.method == 'POST':
        data = request.POST
        email = data.get('email')
        password = data.get('password')
        user = ''
        try:
            user = User.objects.get(email=email)
        except:
            return HttpResponse(f"No user associated with {email}")
        if user != '':
            if user.check_password(password) == True:
                # use authenticate() for request.user.is_authenticated later on
                authenticate(request, email=email, password=password)
                login(request, user)
                #return HttpResponseRedirect("/")

                return HttpResponse("successfully signed in")
            else:
                return HttpResponse("invalid password, please try again")

@login_required
def logout_view(request):
    """
    view to handle logout, sends redirect to /signin absolute path upon complete
    """
    logout(request)
    return redirect('/')

@login_required
def get_user_object(request):
    """
    GET
    Send user object as JSON
    """
    user = [User.objects.get(email=request.user.email)]
    user_serialize = serialize("json", user)
    return HttpResponse(user_serialize)

@login_required
def delete_user(request):
    """
    Handles delete user.
    returns string
    """
    if request.method == "GET":
        if User.objects.filter(email=request.user.email).exists():
            user = User.objects.get(email=request.user.email)
            try:
                user.delete()
                return HttpResponse("successfully deleted user")
            except Exception as e:
                print(e.__doc__)
                print(e)
                return HttpResponse(f"{e.__doc__, e}")
        else:
            return HttpResponse("user doesn't exist")

def get_username_by_pk(request, pk):
    """
    return string: username identified by user primary key
    """
    user = User.objects.get(pk=pk)
    return HttpResponse(f"{user.username}", headers={"Content-Type":"text/json"})


@login_required
@csrf_protect
def save_changes(request):
    """
    Save changes to user object, by handling POST request
    """
    if request.method == 'POST':
        data = request.POST
        first_name = data.get('firstName')
        last_name = data.get('lastName')
        username = data.get('username')
        email = data.get('email')

        user = User.objects.get(email=request.user.email)

        if first_name == user.first_name and last_name == user.last_name and username == user.username and email == user.email:
            return HttpResponse("No changes detected")

        if first_name != user.first_name:
            user.first_name = first_name
        if last_name != user.last_name:
            user.last_name = last_name
        if username != user.username:
            if User.objects.filter(username=username).exists():
                return HttpResponse("Username already exists, please try another")

        user.username = username
        user.save()

        return HttpResponse("changes saved successfully")

@login_required
def get_user_extended_object(request):
    if request.method == 'GET':
        user = User.objects.get(username=request.user.username)
        userEx = [UserExtended.objects.get(user=user)]
        return HttpResponse(serialize("json", userEx))

@login_required
def get_user_extended_object_by_username(request, username):
    if request.method == 'GET':
        user = User.objects.get(username=username)
        userEx = [UserExtended.objects.get(user=user)]
        return HttpResponse(serialize("json", userEx))


@login_required
@csrf_protect
def upload_profile_picture(request):
    if request.method == 'POST':
        print(request.FILES)
        data = request.FILES
        profile_image = data.get('profile_image')

        user = User.objects.get(email=request.user.email)
        userEx = UserExtended.objects.get(user=user)
        userEx.profile_image = profile_image
        userEx.save()
        return HttpResponse("successfully uploaded profile picture")

def get_path_to_profile_image_by_pk(request, user_pk):
    if request.method == 'GET':
        user = User.objects.get(pk=user_pk)
        user_ex = UserExtended.objects.get(user=user)

        return HttpResponse(f"{user_ex.profile_image.url}")

@login_required
@csrf_protect
def send_friend_request(request, user_pk):
    """
    Send friend request from 
    request.user to User.objects.get(pk=user_pk)
    """
    if request.method == 'POST':
        try:
            if FriendshipRequest.objects.filter(to_user=User.objects.get(pk=user_pk), from_user=request.user).exists():
                return HttpResponse("friend request already sent to this user")

            Friend.objects.add_friend(
                request.user,
                User.objects.get(pk=user_pk)
            )
            return HttpResponse("friend request sent!")
        except Exception as e:
            print(e)
            print(e.__doc__)
            return HttpResponse(f"{e}")
    else:
        return HttpResponse("this endpoint only accepts POST requests")

@login_required
def get_sent_friend_requests(request):
    """
    Return user objects of users that the user making the
    request has sent friend requests to
    """
    friend_requests_sent_to = [] # Contains User objects

    if request.method == 'GET':
        friend_requests = Friend.objects.sent_requests(user=request.user)
        for obj in friend_requests:
            # if user already friends with obj.to_user then skip
            if Friend.objects.are_friends(request.user, obj.to_user):
                continue
            friend_requests_sent_to.append(obj.to_user)

        return HttpResponse(serialize("json", friend_requests_sent_to))

@login_required
def get_received_friend_requests(request):
    """
    Return user objects that have sent friend
    requests to user making request
    """
    received_friend_requests = []
    if request.method == 'GET':
        unread_friend_requests = Friend.objects.unread_requests(user=request.user)
        for obj in unread_friend_requests:
            if Friend.objects.are_friends(request.user, obj.from_user):
                continue
            received_friend_requests.append(obj.from_user)

        return HttpResponse(serialize("json", received_friend_requests))

@login_required
def accept_friend_request(request, user_pk):
    """
    user_pk is primary key of user that is sending the friend request
    """
    if request.method == 'POST':
        from_user = User.objects.get(pk=user_pk)
        friend_request = FriendshipRequest.objects.get(from_user=from_user, to_user=request.user)
        friend_request.accept()
        
        return HttpResponse(f"Added {from_user.username} as friend")

@login_required
def reject_friend_request(request, user_pk):
    """
    user_pk is primary key of user that is sending the friend request
    """
    if request.method == 'GET':
        from_user = User.object.get(pk=user_pk)
        friend_request = FriendshipRequest.objects.get(from_user=from_user, to_user=request.user)
        friend_request.reject()
        return HttpResponse(f"Rejected friend request from {from_user.username}")

def if_already_friends(request, user_pk):
    """
    This checks if request.user is already friends with User.objects.get(pk=user+pk)
    return string: true if already friends
    returns string: false if not
    """

    if request.method == 'GET':
        are_friends = Friend.objects.are_friends(request.user, User.objects.get(pk=user_pk))
        if are_friends:
            return HttpResponse("true")
        else:
            return HttpResponse("false")

def if_user_pk_has_sent_friend_request(request, user_pk):
    """
    Check to see if user_pk has already sent a friend request to request.user
    Should call this endpoint after calling if-already-friends to see if add
    friend button should show or accept friend request button

    """
    if request.method == 'GET':
        from_user = User.objects.get(pk=user_pk)
        are_friends = Friend.objects.are_friends(request.user, User.objects.get(pk=user_pk))
        if are_friends:
            return HttpResponse("equesting user and User.objects.get(pk=user_pk) are already friends")
        # If user_pk has already sent a friend request to request.user
        if FriendshipRequest.objects.filter(from_user=from_user, to_user=request.user).exists():
            return HttpResponse("true")
            # should display accept friend request button
        else:
            return HttpResponse("false")
            # Should display add friend button




@login_required
def get_friends_user_objects(request):
    """
    returns user objects of all friends of user making the request
    """
    if request.method == 'GET':
        friends = Friend.objects.friends(request.user)

        return HttpResponse(serialize("json", friends))
    else:
        return HttpResponse("This endpoint only accepts GET requests")

def get_user_extended_object_by_pk(request, user_pk):
    if request.method == 'GET':
        user = User.objects.get(pk=user_pk)
        userEx = [UserExtended.objects.get(user=user)]
        return HttpResponse(serialize("json", userEx))

def search_username(request, query):
    if request.method  == 'GET':
        u = User.objects.filter(username=query)
        return HttpResponse(serialize("json", u))
    else:
        return HttpResponse("This endpoint only accepts GET requests")

def get_path_to_profile_image_by_username(request, username):
    if request.method == 'GET':
        user = User.objects.get(username=username)
        user_ex = UserExtended.objects.get(user=user)
        return HttpResponse(f"{user_ex.profile_image.url}")

@csrf_protect
@login_required
def change_bio(request):
    if request.method == 'POST':
        data = request.POST
        bio_text = data.get('bio_text')
        user = User.objects.get(username=request.user.username)
        user_ex = UserExtended.objects.get(user=user)
        user_ex.bio = bio_text
        user_ex.save()
        return HttpResponse("successfully saved bio")
    else:
        return HttpResponse("This endpoint only accepts POST requests")

@csrf_exempt
def reset_password(request):
    """ 
    Checks if password is valid
    ie. passw.len > 8 && passw == passw_confirm

    """
    if request.method == 'POST':
        data = request.POST
        passw = data.get('password')
        passw_confirm = data.get('passwordConfirm')
        username = data.get('username')

        print(username)

        if User.objects.filter(username=username).count() == 0:
            return HttpResponse(f"No user associated with the email {request.user.email}")
        if len(passw) < 8:
            return HttpResponse("Passwords must be at least 8 characters")
        if passw != passw_confirm:
            return HttpResponse("Please make sure the passwords are the same")

        # Check if ResetPasswordEmail has expired
        user = User.objects.get(username=username)

        # if user uses same password
        if user.check_password(passw):
            return HttpResponse("You've already used that password")

        # Check if reset password email already sent within expiration date
        if ResetPasswordEmail.objects.filter(user=user).exists():
            # Check if it has expired yet
            if (ResetPasswordEmail.objects.get(user=user).expired()):
                ResetPasswordEmail.objects.filter(user=user).delete()
                rpe = ResetPasswordEmail(url=random_string(19), user=user)
                rpe.save()
                html_content = f"<a href='{settings.SITE_URL}/reset-password/User={user.username}/Url={rpe.url}/CreatedDate={rpe.created_date}'>https://127.0.0.1:8000/reset-password/User={user.username}/Url={rpe.url}/CreateDate={rpe.created_date}</a>"
                msg = EmailMessage(subject, html_content, email_from , recipient_list)
                msg.content_subtype = 'html'
                msg.send()
                print("message sent")
                return HttpResponse("This link has expired, reseting your password from here won't work anymore. Please check your email we've sent you a new reset password link")
            else:
                # If all checks are clear then reset password and delete the email object
                user.set_password(passw)
                user.save()
                ResetPasswordEmail.objects.filter(user=user).delete()
                return HttpResponse("Password reset successfully")
    else:
        return HttpResponse("This endpoint only accepts POST requests")
