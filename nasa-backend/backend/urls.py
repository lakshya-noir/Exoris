from django.contrib import admin
from django.urls import path, include, re_path
from django.http import JsonResponse
from rest_framework import routers
from api.views import DatasetViewSet, AnnotationViewSet, ImageMetadataViewSet, get_tile, search_features, nasa_apod
from api.views import search_nasa_images, get_nasa_image_details, get_popular_searches

def api_root(request):
    return JsonResponse({
        'message': 'NASA Hackathon Backend API - Solar System Explorer',
        'endpoints': {
            'datasets': '/api/datasets/',
            'search_nasa': '/api/search/nasa/?q=saturn',
            'popular_searches': '/api/search/popular/',
            'admin': '/admin/',
            'nasa_apod': '/api/nasa/apod/',
        },
        'available_searches': [
            'mercury', 'venus', 'earth', 'jupiter', 'saturn', 
            'uranus', 'neptune', 'pluto', 'sun', 'moon',
            'nebula', 'galaxy', 'black hole', 'asteroid', 'comet'
        ]
    })


# Create router for REST API endpoints
router = routers.DefaultRouter()
router.register(r'datasets', DatasetViewSet, basename='dataset')
router.register(r'annotations', AnnotationViewSet, basename='annotation')
router.register(r'metadata', ImageMetadataViewSet, basename='metadata')

urlpatterns = [
    path('', api_root, name='api_root'),
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
    path('api/search/', search_features, name='search_features'),
    path('api/nasa/apod/', nasa_apod, name='nasa_apod'),
    re_path(r'^tiles/(?P<dataset>[-\w]+)/(?P<z>\d+)/(?P<x>\d+)/(?P<y>\d+)\.(?P<ext>png|jpg)$', 
            get_tile, name='get_tile'),
    path('api/search/nasa/', search_nasa_images, name='search_nasa_images'),
    path('api/nasa/image/<str:nasa_id>/', get_nasa_image_details, name='nasa_image_details'),
    path('api/search/popular/', get_popular_searches, name='popular_searches'),
]

