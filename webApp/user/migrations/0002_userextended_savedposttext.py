# Generated by Django 4.0.6 on 2022-08-13 17:14

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('user', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='userextended',
            name='savedPostText',
            field=models.TextField(blank=True, max_length=50000, null=True),
        ),
    ]
