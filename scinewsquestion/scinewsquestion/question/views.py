from django.shortcuts import render, redirect
from django.views.generic.detail import DetailView
from django.shortcuts import render
from django.http import Http404
from django.http import HttpResponse, HttpResponseRedirect
from django.template import loader, RequestContext
from .models import *
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login
from .forms import UserForm, LoginForm
from django.views.decorators.csrf import csrf_exempt
from django.utils import timezone
import operator
# Create your views here.

def index(request):
    article_list=Article.objects.all()
    context={
        'article_list': article_list
        }
    return render(request, 'critreader/index.html', context)

@csrf_exempt
def tutorial(request):
    context={}
    return render(request, 'question/tutorial.html',context)

@csrf_exempt
def tutorial2(request):
    context={}
    return render(request, 'question/tutorial2.html',context)

@csrf_exempt
def tutorial3(request):
    context={}
    return render(request, 'question/tutorial3.html',context)

@csrf_exempt
def question(request,article_no):
    try:
        article=Article.objects.get(article_no=article_no)
    except Article.DoesNotExist:
        raise Http404("Research does not exist")
    thisArticle=Article.objects.get(article_no=article_no)
    thisResearch=thisArticle.article_research
    context={
    'article':thisArticle,
    } 
    return render(request, 'question/question.html', context)

@csrf_exempt
def highlight(request,article_no):
    try:
        article=Article.objects.get(article_no=article_no)
    except Article.DoesNotExist:
        raise Http404("Research does not exist")
    thisArticle=Article.objects.get(article_no=article_no)
    thisResearch=thisArticle.article_research
    context={
    'article':thisArticle,
    } 
    return render(request, 'question/highlight.html', context)


@csrf_exempt
def survey(request, survey_no):
    try:
        survey=SurveyEmbed.objects.get(survey_no=survey_no)
    except SurveyEmbed.DoesNotExist:
        raise Http404("Survey does not exist")
    thissurvey=SurveyEmbed.objects.get(survey_no=survey_no)
    context={
    'survey':thissurvey,
    } 
    return render(request, 'question/surveyembed.html', context)

@csrf_exempt
def addquestion(request, article_no):
    articleno=request.POST.get('articleno',None)
    text=request.POST.get('text', None)
    madeby=request.POST.get('madeby',None)
    reftext=request.POST.get('reftext',None)
    qid=request.POST.get('genid',None)
    description=request.POST.get('description',None)
    imp=request.POST.get('importance',None)
    pubdate=timezone.now()
    thisArticle=Article.objects.get(article_no=articleno)
    thisResearch=thisArticle.article_research
    username=User.objects.get(username=madeby)
    newQuestion=Question(question_research=thisResearch,question_article=thisArticle, question_text=text, question_madeby=username, question_reftext=reftext, question_pubdate=pubdate,question_id=qid, question_description=description, question_importance=imp,question_deleted=False,question_deletedate=pubdate)
    newQuestion.save()
    return HttpResponseRedirect('')


@csrf_exempt
def deletequestion(request, article_no):
    articleno=request.POST.get('articleno',None)
    text=request.POST.get('text', None)
    madeby=request.POST.get('madeby',None)
    qid=request.POST.get('genid',None)
    pubdate=timezone.now()
    thisArticle=Article.objects.get(article_no=articleno)
    thisResearch=thisArticle.article_research
    username=User.objects.get(username=madeby)
    thisQuestion=Question.objects.get(question_research=thisResearch,question_article=thisArticle, question_text=text, question_madeby=username,question_id=qid)
    thisQuestion.question_deleted=True
    thisQuestion.question_deletedate=pubdate
    thisQuestion.save()
    return HttpResponseRedirect('')

@csrf_exempt
def addhighlight(request, article_no):
    articleno=request.POST.get('articleno',None)
    text=request.POST.get('text', None)
    madeby=request.POST.get('madeby',None)
    reftext=request.POST.get('reftext',None)
    qid=request.POST.get('genid',None)
    description=request.POST.get('description',None)
    imp=request.POST.get('importance',None)
    pubdate=timezone.now()
    thisArticle=Article.objects.get(article_no=articleno)
    thisResearch=thisArticle.article_research
    username=User.objects.get(username=madeby)
    newQuestion=Highlight(question_research=thisResearch,question_article=thisArticle, question_text=text, question_madeby=username, question_reftext=reftext, question_pubdate=pubdate,question_id=qid, question_description=description, question_importance=imp,question_deleted=False,question_deletedate=pubdate)
    newQuestion.save()
    return HttpResponseRedirect('')


@csrf_exempt
def deletehighlight(request, article_no):
    articleno=request.POST.get('articleno',None)
    text=request.POST.get('text', None)
    madeby=request.POST.get('madeby',None)
    qid=request.POST.get('genid',None)
    pubdate=timezone.now()
    thisArticle=Article.objects.get(article_no=articleno)
    thisResearch=thisArticle.article_research
    username=User.objects.get(username=madeby)
    thisQuestion=Highlight.objects.get(question_research=thisResearch,question_article=thisArticle, question_text=text, question_madeby=username,question_id=qid)
    thisQuestion.question_deleted=True
    thisQuestion.question_deletedate=pubdate
    thisQuestion.save()
    return HttpResponseRedirect('')

def signup(request):
    if request.method == "POST":
        form = UserForm(request.POST)
        if form.is_valid():
            new_user = User.objects.create_user(**form.cleaned_data)
            login(request, new_user)
            return redirect('tutorial')
    else:
        form = UserForm()
        return render(request, 'question/signup.html', {'form': form})

def signin(request):
    if request.method == "POST":
        form = LoginForm(request.POST)
        username = request.POST['username']
        password = request.POST['password']
        user = authenticate(username = username, password = password)
        if user is not None:
            login(request, user)
            return redirect('tutorial')
        else:
            return HttpResponse('Log-In Failed. Try Again.')
    else:
        form = LoginForm()
        return render(request, 'question/login.html', {'form': form})

@csrf_exempt
def sessionstart(request, article_no):
    articleno=request.POST.get('articleno',None)
    user=request.POST.get('user',None)
    order=request.POST.get('order',None)
    mode=request.POST.get('mode',None)
    startdate=timezone.now()
    thisArticle=Article.objects.get(article_no=articleno)
    thisResearch=thisArticle.article_research    
    username=User.objects.get(username=user)
    thisStat=SessionStat(session_order=order,session_article=thisArticle, session_research=thisResearch, session_user=username, session_starttime=startdate, session_mode=mode)
    thisStat.save()
    return HttpResponseRedirect('')

@csrf_exempt
def sessionend(request, article_no):
    articleno=request.POST.get('articleno',None)
    user=request.POST.get('user',None)
    order=request.POST.get('order',None)
    mode=request.POST.get('mode',None)
    htmls=request.POST.get('htmlresult',None)
    enddate=timezone.now()
    thisArticle=Article.objects.get(article_no=articleno)
    thisResearch=thisArticle.article_research    
    username=User.objects.get(username=user)
    thisStat=SessionEndStat(session_order=order,session_article=thisArticle, session_research=thisResearch, session_user=username, session_endtime=enddate, session_mode=mode, session_html=htmls)
    thisStat.save()
    return HttpResponseRedirect('')

@csrf_exempt
def surveystart(request, article_no):
    articleno=request.POST.get('articleno',None)
    user=request.POST.get('user',None)
    order=request.POST.get('order',None)
    startdate=timezone.now()
    thisArticle=Article.objects.get(article_no=articleno)
    thisResearch=thisArticle.article_research    
    username=User.objects.get(username=user)
    thisStat=SurveyStat(survey_order=order,survey_article=thisArticle, survey_research=thisResearch, survey_user=username, survey_starttime=startdate)
    thisStat.save()
    return HttpResponseRedirect('')

@csrf_exempt
def surveyend(request, article_no):
    articleno=request.POST.get('articleno',None)
    user=request.POST.get('user',None)
    order=request.POST.get('order',None)
    evals=request.POST.get('eval',None)
    enddate=timezone.now()
    thisArticle=Article.objects.get(article_no=articleno)
    thisResearch=thisArticle.article_research    
    username=User.objects.get(username=user)
    thisStat=SurveyEndStat(survey_order=order,survey_article=thisArticle, survey_research=thisResearch, survey_user=username, survey_endtime=enddate, survey_eval=evals)
    thisStat.save()
    
    return HttpResponseRedirect('')

