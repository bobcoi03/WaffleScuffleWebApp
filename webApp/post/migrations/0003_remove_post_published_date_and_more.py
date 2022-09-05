# Generated by Django 4.0.6 on 2022-08-05 12:33

import datetime
from django.db import migrations, models
from django.utils.timezone import utc


class Migration(migrations.Migration):

    dependencies = [
        ('post', '0002_alter_post_published_time'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='post',
            name='published_date',
        ),
        migrations.RemoveField(
            model_name='post',
            name='published_time',
        ),
        migrations.AddField(
            model_name='post',
            name='published_datetime',
            field=models.DateTimeField(default=datetime.datetime(2022, 8, 5, 12, 33, 35, 575682, tzinfo=utc)),
        ),
    ]
