from django.db import models
from django import forms
from django.contrib.auth.models import User
from django.forms import ModelForm

# Create your models here.
class Research(models.Model):
    research_no=models.PositiveIntegerField(default=1)
    research_keyword=models.CharField(max_length=50)
    research_link=models.CharField(max_length=200)
    def __str__(self):
        return self.research_keyword

class Article(models.Model):
    article_research=models.ForeignKey(Research, on_delete=models.CASCADE)
    article_no=models.IntegerField(default=99)
    article_title=models.CharField(max_length=250)
    article_body=models.CharField(max_length=100000)
    article_date=models.CharField(max_length=100,default="December 2017")
    article_link=models.CharField(max_length=100,default="#")
    article_publisher=models.CharField(max_length=100, default="publisher")
    def __str__(self):
        return self.article_title

class Question(models.Model):
    question_research=models.ForeignKey(Research, on_delete=models.CASCADE)
    question_article=models.ForeignKey(Article, on_delete=models.CASCADE)
    question_text=models.CharField(max_length=200)
    question_madeby=models.ForeignKey(User, on_delete=models.CASCADE)
    question_id=models.CharField(max_length=200)
    question_reftext=models.CharField(max_length=200)
    question_description=models.CharField(max_length=200)
    question_importance=models.IntegerField(default=4)
    question_pubdate=models.DateTimeField('date published')
    question_deleted=models.BooleanField(default=False)
    question_deletedate=models.DateTimeField('date deleted')
    def generate(self):
        self.save()
    def __str__(self):
        return self.question_text
class Highlight(models.Model):
    question_research=models.ForeignKey(Research, on_delete=models.CASCADE)
    question_article=models.ForeignKey(Article, on_delete=models.CASCADE)
    question_text=models.CharField(max_length=200)
    question_madeby=models.ForeignKey(User, on_delete=models.CASCADE)
    question_id=models.CharField(max_length=200)
    question_reftext=models.CharField(max_length=200)
    question_description=models.CharField(max_length=200)
    question_importance=models.IntegerField(default=4)
    question_pubdate=models.DateTimeField('date published')
    question_deleted=models.BooleanField(default=False)
    question_deletedate=models.DateTimeField('date deleted')
    def generate(self):
        self.save()
    def __str__(self):
        return self.question_text



class SurveyEmbed(models.Model):
    survey_no=models.IntegerField(default=0)
    survey_name=models.CharField(max_length=100)
    survey_link=models.CharField(max_length=400)
    def __str__(self):
        return self.survey_name

class SessionStat(models.Model):
    session_order=models.IntegerField(default=0)
    session_article=models.ForeignKey(Article, on_delete=models.CASCADE)
    session_research=models.ForeignKey(Research, on_delete=models.CASCADE)
    session_user=models.ForeignKey(User, on_delete=models.CASCADE)
    session_mode=models.CharField(max_length=200)
    session_starttime=models.DateTimeField('date published')
    def generate(self):
        self.save()
    def __str__(self):
        return self.session_user.username + str(self.session_order)

class SessionEndStat(models.Model):
    session_order=models.IntegerField(default=0)
    session_article=models.ForeignKey(Article, on_delete=models.CASCADE)
    session_research=models.ForeignKey(Research, on_delete=models.CASCADE)
    session_user=models.ForeignKey(User, on_delete=models.CASCADE)
    session_mode=models.CharField(max_length=200)
    session_html=models.CharField(max_length=99999999)
    session_endtime=models.DateTimeField('date published')
    def generate(self):
        self.save()
    def __str__(self):
        return self.session_user.username + str(self.session_order)

    
class SurveyStat(models.Model):
    survey_order=models.IntegerField(default=0)
    survey_article=models.ForeignKey(Article, on_delete=models.CASCADE)
    survey_research=models.ForeignKey(Research, on_delete=models.CASCADE)
    survey_user=models.ForeignKey(User, on_delete=models.CASCADE)
    survey_starttime=models.DateTimeField('date published')
    def generate(self):
        self.save()
    def __str__(self):
        return self.survey_user.username + str(self.survey_order)

class SurveyEndStat(models.Model):
    survey_order=models.IntegerField(default=0)
    survey_article=models.ForeignKey(Article, on_delete=models.CASCADE)
    survey_research=models.ForeignKey(Research, on_delete=models.CASCADE)
    survey_user=models.ForeignKey(User, on_delete=models.CASCADE)
    survey_eval=models.CharField(max_length=200)
    survey_endtime=models.DateTimeField('date published')
    def generate(self):
        self.save()
    def __str__(self):
        return self.survey_user.username + str(self.survey_order)
