from django.urls import path
from .views import BlogCreateView, BlogListView, BlogUpdateView, BlogDeleteView,AnalyticsAPIView

urlpatterns = [
    path('create/', BlogCreateView.as_view(), name='blog-create'),
    path('list/', BlogListView.as_view(), name='blog-list'),
    path('list/<uuid:id>/', BlogListView.as_view(), name='blog-list'),
    path('update/<uuid:id>/', BlogUpdateView.as_view(), name='blog-update'),
    path('delete/<uuid:id>/', BlogDeleteView.as_view(), name='blog-delete'),
    path("analytics/",AnalyticsAPIView.as_view())
]
