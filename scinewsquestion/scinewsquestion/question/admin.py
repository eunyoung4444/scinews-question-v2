from django.contrib import admin
from .models import Article, Question, Highlight,  Research, SurveyEmbed, SessionStat, SurveyStat 
from import_export import resources
# Register your models here.

admin.site.register(Article)
admin.site.register(Question)
admin.site.register(Highlight)
admin.site.register(Research)
admin.site.register(SurveyEmbed)
admin.site.register(SessionStat)
admin.site.register(SurveyStat)
