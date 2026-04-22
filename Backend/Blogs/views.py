from django.shortcuts import get_object_or_404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Blog,AIAnalysis
from .serializers import BlogCreateSerializer, BlogListSerializer, BlogUpdateSerializer
from rest_framework.permissions import IsAuthenticated
from .tasks import analyze_blog_ai
from django.db import transaction
from django.utils import timezone
from django.db.models import Avg,Count
from datetime import timedelta
from django.db.models.functions import TruncMonth
from calendar import month_name
from Users.permissions import IsUser,IsUserOrTherapistOrAdmin

class BlogCreateView(APIView):
    permission_classes = [IsUser]
    def post(self, request):
        serializer = BlogCreateSerializer(data=request.data)
        with transaction.atomic():
                serializer.is_valid(raise_exception=True)
                blog = serializer.save(
                    created_by=request.user,
                    updated_by=request.user,
                    status="PENDING"
                )

                transaction.on_commit(
                    lambda: analyze_blog_ai.delay(blog.id)
                )
                print()

        return Response(status=status.HTTP_201_CREATED)


class BlogListView(APIView):
    permission_classes = [IsUser]
    def get(self, request, id=None):
        try:
            queryset = Blog.objects.filter(is_deleted=False).select_related('aianalysis')

            if not request.user.groups.filter(name='Admin').exists():
                queryset = queryset.filter(created_by=request.user)
            
            queryset = queryset.order_by('-created_at')
            
            if id is not None:
                blog = get_object_or_404(queryset, id=id)
                serializer = BlogListSerializer(blog)
                return Response(serializer.data)
            
            serializer = BlogListSerializer(queryset, many=True)
            return Response(serializer.data)
        except Exception as e:
            print(f"ERROR IN BlogListView: {e}")
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class BlogUpdateView(APIView):
    permission_classes = [IsUser]
    def patch(self, request, id):
        blog = get_object_or_404(Blog, id=id)
        if request.user != blog.created_by:
            return Response({"error": "You are not authorized to update this blog"}, status=status.HTTP_401_UNAUTHORIZED)
        serializer = BlogUpdateSerializer(blog, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class BlogDeleteView(APIView):
    permission_classes = [IsUser]
    def delete(self, request, id):
        blog = get_object_or_404(Blog, id=id)
        if request.user != blog.created_by:
            return Response({"error": "You are not authorized to delete this blog"}, status=status.HTTP_401_UNAUTHORIZED)
        blog.is_deleted = True
        blog.save(update_fields=["is_deleted"]) 
        return Response(status=status.HTTP_204_NO_CONTENT)


class AnalyticsAPIView(APIView):
    permission_classes = [IsAuthenticated,IsUserOrTherapistOrAdmin]

    def get(self, request):
        range_type = request.query_params.get('range')
        user = request.user
        now = timezone.now()

        if range_type not in ['daily', 'weekly', 'monthly', 'yearly']:
            return Response(
                {"error": "Invalid range parameter"},
                status=status.HTTP_400_BAD_REQUEST
            )

        # 🔥 Optimized base queryset
        base_queryset = AIAnalysis.objects.select_related("blog").filter(
            blog__created_by=user
        )

        if range_type == 'daily':
            queryset = base_queryset.filter(
                created_at__date=now.date()
            )

        elif range_type == 'weekly':
            queryset = base_queryset.filter(
                created_at__gte=now - timedelta(days=7)
            )

        elif range_type == 'monthly':
            queryset = base_queryset.filter(
                created_at__month=now.month,
                created_at__year=now.year
            )

        elif range_type == 'yearly':
            yearly_queryset = base_queryset.filter(
                created_at__year=now.year
            )

            monthly_data = yearly_queryset.annotate(
                month=TruncMonth("created_at")
            ).values("month").annotate(
                avg_sentiment=Avg("sentiment_score"),
                total_entries=Count("id")
            ).order_by("month")

            formatted_months = [
                {
                    "month": item["month"].strftime("%B"),
                    "avg_sentiment": item["avg_sentiment"],
                    "total_entries": item["total_entries"]
                }
                for item in monthly_data
            ]

            aggregated = yearly_queryset.aggregate(
                avg_sentiment=Avg("sentiment_score"),
                total_entries=Count("id")
            )

            emotion_distribution = yearly_queryset.values("primary_emotion").annotate(
                count=Count("primary_emotion")
            )

            return Response({
                "range": range_type,
                "average_sentiment": aggregated["avg_sentiment"] or 0,
                "total_entries": aggregated["total_entries"],
                "emotion_distribution": emotion_distribution,
                "monthly_breakdown": formatted_months
            })

        # For daily / weekly / monthly
        aggregated = queryset.aggregate(
            avg_sentiment=Avg("sentiment_score"),
            total_entries=Count("id")
        )

        emotion_distribution = queryset.values("primary_emotion").annotate(
            count=Count("primary_emotion")
        )

        return Response({
            "range": range_type,
            "average_sentiment": aggregated["avg_sentiment"] or 0,
            "total_entries": aggregated["total_entries"],
            "emotion_distribution": emotion_distribution
        })