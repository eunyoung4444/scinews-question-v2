from import_export import resources
from .models import Research, Article, AnnotQuestion, GenQuestion, SurveyEmbed, SessionStat

class AnnotQuestionResource(resources.MedelResource):
    class Meta:
        model=AnnotQuestion

class GenQuestionResource(resources.ModelResource):
    class Meta:
        model=GenQuestion
        
