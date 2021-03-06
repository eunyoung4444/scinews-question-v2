# -*- coding: utf-8 -*-
# Generated by Django 1.11.7 on 2018-06-27 15:22
from __future__ import unicode_literals

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('question', '0012_sessionstat_session_html'),
    ]

    operations = [
        migrations.CreateModel(
            name='SessionEndStat',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('session_order', models.IntegerField(default=0)),
                ('session_mode', models.CharField(max_length=200)),
                ('session_html', models.CharField(max_length=99999999)),
                ('session_endtime', models.DateTimeField(verbose_name='date published')),
                ('session_article', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='question.Article')),
                ('session_research', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='question.Research')),
                ('session_user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='SurveyEndStat',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('survey_order', models.IntegerField(default=0)),
                ('survey_eval', models.CharField(max_length=200)),
                ('survey_endtime', models.DateTimeField(verbose_name='date published')),
                ('survey_article', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='question.Article')),
                ('survey_research', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='question.Research')),
                ('survey_user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.RemoveField(
            model_name='sessionstat',
            name='session_endtime',
        ),
        migrations.RemoveField(
            model_name='sessionstat',
            name='session_html',
        ),
        migrations.RemoveField(
            model_name='surveystat',
            name='survey_endtime',
        ),
        migrations.RemoveField(
            model_name='surveystat',
            name='survey_eval',
        ),
    ]
