from django.conf.urls import url, include


from . import views

urlpatterns = [
    url(r'^$', views.index, name='index'),
    url(r'^(?P<article_no>[0-9]+)/$', views.question, name='question'),
    url(r'^(?P<article_no>[0-9]+)/highlight$', views.highlight, name='highlight'),
    url(r'^survey/(?P<survey_no>[0-9]+)/$', views.survey, name='survey'),
    url(r'^(?P<article_no>[0-9]+)/addquestion$', views.addquestion, name='addquestion'),
    url(r'^(?P<article_no>[0-9]+)/deletequestion$', views.deletequestion, name='deletequestion'),
    url(r'^(?P<article_no>[0-9]+)/addhighlight$', views.addhighlight, name='addhighlight'),
    url(r'^(?P<article_no>[0-9]+)/deletehighlight$', views.deletehighlight, name='deletehighlight'),
    url(r'^(?P<article_no>[0-9]+)/sessionstart$', views.sessionstart, name='sessionstart'),
    url(r'^(?P<article_no>[0-9]+)/sessionend$', views.sessionend, name='sessionend'),
    url(r'^(?P<article_no>[0-9]+)/surveystart$', views.surveystart, name='surveystart'),
    url(r'^(?P<article_no>[0-9]+)/surveyend$', views.surveyend, name='surveyend'),
    url(r'^signup/$',views.signup,name='signup'),
    url(r'^login/$',views.signin, name='login'),
    url(r'^tutorial/$',views.tutorial, name='tutorial'),
]

