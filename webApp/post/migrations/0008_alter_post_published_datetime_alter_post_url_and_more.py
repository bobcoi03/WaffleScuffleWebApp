# Generated by Django 4.0.6 on 2022-08-06 15:06

import datetime
from django.db import migrations, models
from django.utils.timezone import utc


class Migration(migrations.Migration):

    dependencies = [
        ('post', '0007_alter_post_published_datetime_alter_post_url_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='post',
            name='published_datetime',
            field=models.DateTimeField(default=datetime.datetime(2022, 8, 6, 15, 6, 11, 238657, tzinfo=utc)),
        ),
        migrations.AlterField(
            model_name='post',
            name='url',
            field=models.CharField(default='CVUAO707M435TK9', max_length=20),
        ),
        migrations.AlterField(
            model_name='reply',
            name='published_datetime',
            field=models.DateTimeField(default=datetime.datetime(2022, 8, 6, 15, 6, 11, 240641, tzinfo=utc)),
        ),
        migrations.AlterField(
            model_name='reply',
            name='url',
            field=models.CharField(default='M6BGBNMRX5TREPQ', max_length=20),
        ),
    ]
