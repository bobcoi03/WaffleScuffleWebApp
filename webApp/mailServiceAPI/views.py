from __future__ import print_function

from django.shortcuts import render
from django.http import HttpResponse
from django.contrib.auth.decorators import login_required
from post.models import Post, Reply
from datetime import datetime
from django.contrib.auth.models import User
import random, string
from django.core.serializers import serialize
from user.models import UserExtended,  AccountConfirmationEmail, ResetPasswordEmail

from django.core.mail import send_mail, EmailMultiAlternatives, EmailMessage
from django.conf import settings

# Validate email
from validate_email import validate_email

def random_string(length):
    return ''.join(random.choice(string.ascii_uppercase + string.digits) for _ in range(length))

# Create your views here.
def index(request):
    return HttpResponse('mail service API')

def send_password_reset_email(request):
    if request.method == 'POST':
        data = request.POST
        email_to = data.get('email')
        # Check if email is valid
        # Email info
        subject = 'Password Reset'
        text_content = 'Click the link below to reset your password'
        email_from = 'WaffleScuffle<password@wafflescuffle.com>'
        recipient_list = [email_to,]

        if validate_email(email_to):
            # Check if user exists
            if User.objects.filter(email=email_to).count() == 0:
                return HttpResponse(f"No user associated with the email: {email_to}")
            else:
                user = User.objects.get(email = email_to)
                # If user exists
                # Check if reset password email already sent within expiration date
                if ResetPasswordEmail.objects.filter(user=user).exists():
                    # if email has expired delete it then create and send new email && object
                    if (ResetPasswordEmail.objects.get(user=user).expired()):
                        #
                        ResetPasswordEmail.objects.filter(user=user).delete()
                        rpe = ResetPasswordEmail(url=random_string(19), user=user)
                        rpe.save()
                        html_content = f"<a href='{settings.SITE_URL}/reset-password/User={user.username}/Url={rpe.url}/CreatedDate={rpe.created_date}'>https://127.0.0.1:8000/reset-password/User={user.username}/Url={rpe.url}/CreateDate={rpe.created_date}</a>"
                        msg = EmailMessage(subject, html_content, email_from , recipient_list)
                        msg.content_subtype = 'html'
                        msg.send()
                        print("message sent")
                        return HttpResponse("Successfully sent reset password email")
                    else:
                    # if email already sent and has not expired
                        return HttpResponse("Please check your email, a password reset email has already been sent")
                # Create a ResetPasswordEmail object
                rpe = ResetPasswordEmail(url=random_string(19), user=user)
                rpe.save()
                html_content = f"<a href='{settings.SITE_URL}/reset-password/User={user.username}/Url={rpe.url}/CreatedDate={rpe.created_date}'>https://127.0.0.1:8000/reset-password/User={user.username}/Url={rpe.url}/CreateDate={rpe.created_date}</a>"
                msg = EmailMessage(subject, html_content, email_from , recipient_list)
                msg.content_subtype = 'html'
                msg.send()
                return HttpResponse("Successfully sent reset password email")
        else:
            return HttpResponse("Email is invalid, please re-enter your email")


def send_account_confirmation_email(email_to, user: User):
    """
    This function assumes email_to is associated
    with a User object from django.contrib.auth.models
    """
    if validate_email(email_to):
        # Check if email is valid
        subject = f'{user.username}, Welcome to WaffleScuffle!'
        message= ' Confirm your account here'
        email_from = 'WaffleScuffle<info@wafflescuffle.com>'
        recipient_list = [email_to,]
        html_content = f"<a href='{settings.SITE_URL}'>Confirm Account</a>"
        msg = EmailMessage(subject, html_content, email_from , recipient_list)
        msg.content_subtype = 'html'
        msg.send()
        a = AccountConfirmationEmail(user=user, url=random_string(19))
        a.save()
    else:
        raise Exception('failed to run send_account_confirmation_email()')
