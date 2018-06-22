from django.contrib import admin
from .models import Article, AnnotQuestion, GenQuestion,  Research, SurveyEmbed, SessionStat 
from import_export import resources
# Register your models here.

admin.site.register(Article)
admin.site.register(AnnotQuestion)
admin.site.register(GenQuestion)
admin.site.register(Research)
admin.site.register(SurveyEmbed)
admin.site.register(SessionStat)
