from django.conf.urls import url, include


from . import views

urlpatterns = [
    url(r'^$', views.index, name='index'),
    url(r'^(?P<article_no>[0-9]+)/$', views.article, name='article'),
    url(r'^survey/(?P<survey_no>[0-9]+)/$', views.survey, name='survey'),
    url(r'^(?P<article_no>[0-9]+)/addannotquestion$', views.addannotquestion, name='addannotquestion'),
    url(r'^(?P<article_no>[0-9]+)/sessionstart$', views.sessionstart, name='sessionstart'),
    url(r'^(?P<article_no>[0-9]+)/sessionend$', views.sessionend, name='sessionend'),
    url(r'^(?P<article_no>[0-9]+)/deleteannotquestion$', views.deleteannotquestion, name='deleteannotquestion'),
    url(r'^(?P<article_no>[0-9]+)/addgenquestion$', views.addgenquestion, name='addgenquestion'),
    url(r'^(?P<article_no>[0-9]+)/deletegenquestion$', views.deletegenquestion, name='deletegenquestion'),
    url(r'^signup/$',views.signup,name='signup'),
    url(r'^login/$',views.signin, name='login'),
]

