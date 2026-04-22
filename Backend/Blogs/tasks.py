from celery import shared_task
from django.db import transaction
from .models import Blog, AIAnalysis
from .genai import analyze_blog


@shared_task(bind=True, autoretry_for=(Exception,), retry_kwargs={"max_retries": 3})
def analyze_blog_ai(self, blog_id):

    try:
        blog = Blog.objects.get(id=blog_id)
    except Blog.DoesNotExist:
        return  # fail silently (or log if needed)

    blog.status = "PROCESSING"
    blog.save(update_fields=["status"])

    try:
        result = analyze_blog(blog.content)

        with transaction.atomic():
            AIAnalysis.objects.create(
                blog=blog,
                sentiment_score=result["sentiment_score"],
                primary_emotion=result["primary_emotion"],
                risk_level=result["risk_level"],
                reflection=result["reflection"],
                coping_suggestion=result["coping_suggestion"],
                raw_response=result,
            )

            blog.status = "DONE"
            blog.save(update_fields=["status"])

    except Exception as e:
        blog.status = "FAILED"
        blog.save(update_fields=["status"])
        raise e  # so Celery retries
