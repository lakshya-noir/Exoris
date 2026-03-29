from django.contrib import admin
from .models import Dataset, Annotation, ImageMetadata, TileCache

@admin.register(Dataset)
class DatasetAdmin(admin.ModelAdmin):
    list_display = ('slug', 'title', 'source_mission', 'processing_status', 'tiles_generated')
    list_filter = ('processing_status', 'tiles_generated', 'source_mission')
    search_fields = ('title', 'slug', 'description')

@admin.register(Annotation)
class AnnotationAdmin(admin.ModelAdmin):
    list_display = ('feature_name', 'dataset', 'zoom', 'x', 'y', 'created_at')
    list_filter = ('dataset', 'zoom')
    search_fields = ('feature_name', 'note')

@admin.register(ImageMetadata)
class ImageMetadataAdmin(admin.ModelAdmin):
    list_display = ('original_filename', 'dataset', 'file_size', 'bands', 'created_at')
    list_filter = ('dataset', 'bands')

@admin.register(TileCache)
class TileCacheAdmin(admin.ModelAdmin):
    list_display = ('dataset', 'zoom_level', 'tiles_count', 'generation_date')
    list_filter = ('dataset', 'zoom_level')
