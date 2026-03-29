from rest_framework import serializers
from .models import Dataset, Annotation, ImageMetadata, TileCache

class DatasetSerializer(serializers.ModelSerializer):
    """
    Converts Dataset models to/from JSON for the API
    Includes annotation count for convenience
    """
    annotations_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Dataset
        fields = '__all__'
    
    def get_annotations_count(self, obj):
        """Returns number of annotations for this dataset"""
        return obj.annotations.count()

class AnnotationSerializer(serializers.ModelSerializer):
    """
    Handles user annotations on NASA images
    Includes dataset name for easier frontend display
    """
    dataset_name = serializers.CharField(source='dataset.title', read_only=True)
    
    class Meta:
        model = Annotation
        fields = '__all__'

class ImageMetadataSerializer(serializers.ModelSerializer):
    """
    Serializes NASA image metadata
    """
    class Meta:
        model = ImageMetadata
        fields = '__all__'

class TileCacheSerializer(serializers.ModelSerializer):
    """
    Handles tile cache information
    """
    class Meta:
        model = TileCache
        fields = '__all__'
