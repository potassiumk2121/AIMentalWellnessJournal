from django.contrib import admin
from .models import Blog,AIAnalysis

@admin.register(Blog)
class BlogAdmin(admin.ModelAdmin):
    list_display = ('id','title', 'content','status','created_at','created_by')
    search_fields = ('title', 'content')
    ordering = ('-created_at',)


@admin.register(AIAnalysis)
class AIAnalysisAdmin(admin.ModelAdmin):
    list_display = ('id','blog','sentiment_score','primary_emotion','risk_level','created_at')
    search_fields = ('blog__title', 'blog__content')
    ordering = ('-created_at',)