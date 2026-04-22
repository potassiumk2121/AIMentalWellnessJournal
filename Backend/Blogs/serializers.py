from rest_framework import serializers
from .models import Blog, AIAnalysis

class AIAnalysisSerializer(serializers.ModelSerializer):
    class Meta:
        model = AIAnalysis
        fields = ['sentiment_score', 'primary_emotion', 'risk_level', 'reflection', 'coping_suggestion', 'created_at']

class BlogCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Blog
        fields = ['title', 'content']
        extra_kwargs = {
            'created_by': {'read_only': True},
            'updated_by': {'read_only': True},
        }

class BlogListSerializer(serializers.ModelSerializer):
    analysis = AIAnalysisSerializer(source='aianalysis', read_only=True)

    class Meta:
        model = Blog
        fields = ['id', 'title', 'content', 'created_at', 'updated_at', 'status', 'analysis']

class BlogUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Blog
        fields = ['title', 'content']