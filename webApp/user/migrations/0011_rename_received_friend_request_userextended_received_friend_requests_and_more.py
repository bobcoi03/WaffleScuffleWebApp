# Generated by Django 4.0.6 on 2022-08-28 14:31

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('user', '0010_userextended_received_friend_request_and_more'),
    ]

    operations = [
        migrations.RenameField(
            model_name='userextended',
            old_name='received_friend_request',
            new_name='received_friend_requests',
        ),
        migrations.RenameField(
            model_name='userextended',
            old_name='sent_friend_request',
            new_name='sent_friend_requess',
        ),
    ]
