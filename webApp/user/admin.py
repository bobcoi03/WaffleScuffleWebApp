from django.contrib import admin
from .models import UserExtended, AccountConfirmationEmail, ResetPasswordEmail
# Register your models here.
admin.site.register(UserExtended)
admin.site.register(AccountConfirmationEmail)
admin.site.register(ResetPasswordEmail)
