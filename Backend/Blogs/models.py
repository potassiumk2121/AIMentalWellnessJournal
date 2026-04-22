from django.db import models
from Users.models import CustomUser
import uuid

class Blog(models.Model):
    id=models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    title = models.CharField(max_length=100)
    content = models.TextField()
    is_deleted = models.BooleanField(default=False)
    STATUS_CHOICES = (
        ("PENDING", "Pending"),
        ("PROCESSED", "Processed"),
        ("FAILED", "Failed"),
    )
    status = models.CharField(max_length=20, default="PENDING")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    created_by = models.ForeignKey(CustomUser, on_delete=models.CASCADE,related_name="blogs",db_index=True)
    updated_by = models.ForeignKey(CustomUser, on_delete=models.CASCADE)

    def __str__(self):
        return self.title
    

class AIAnalysis(models.Model):
    id=models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    blog=models.OneToOneField(Blog,on_delete=models.CASCADE)
    sentiment_score = models.FloatField(null=True)
    primary_emotion = models.CharField(max_length=50,db_index=True)
    risk_level = models.CharField(max_length=20,db_index=True)
    reflection = models.TextField()
    raw_response = models.JSONField()
    coping_suggestion= models.JSONField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True,db_index=True)

    class Meta:
        verbose_name = "AI Analysis"
        verbose_name_plural = "AI Analyses"