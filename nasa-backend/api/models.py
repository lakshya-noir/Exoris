from django.db import models
from django.utils import timezone


class Dataset(models.Model):
    """
    Represents a NASA dataset (Earth, Mars, Moon, etc.)
    Each dataset can have multiple zoom levels and tiles
    """
    slug = models.SlugField(max_length=50, unique=True)  # e.g. 'earth', 'mars'
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    
    # NASA mission information
    source_mission = models.CharField(max_length=100, blank=True)  # e.g. "Landsat 8"
    capture_date = models.DateTimeField(null=True, blank=True)
    resolution_info = models.JSONField(default=dict)  # Store resolution metadata
    
    # Tile serving configuration
    tile_size = models.IntegerField(default=256)  # Standard web map tile size
    max_zoom = models.IntegerField(default=10)    # Maximum zoom level available
    min_zoom = models.IntegerField(default=0)     # Minimum zoom level
    
    # Processing status
    tiles_generated = models.BooleanField(default=False)
    processing_status = models.CharField(max_length=20, default='pending')
    
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title


class Annotation(models.Model):
    """
    User annotations on NASA images - allows marking features like craters, storms, etc.
    """
    dataset = models.ForeignKey(Dataset, on_delete=models.CASCADE, related_name="annotations")
    feature_name = models.CharField(max_length=200, blank=True)  # e.g. "Olympus Mons"
    x = models.FloatField()  # X coordinate in tile space
    y = models.FloatField()  # Y coordinate in tile space
    zoom = models.IntegerField(default=0)  # Zoom level where annotation was made
    note = models.TextField(blank=True)  # User's description
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.feature_name} on {self.dataset.title}"


class ImageMetadata(models.Model):
    """
    Stores metadata about original NASA images before processing into tiles
    """
    dataset = models.ForeignKey(Dataset, on_delete=models.CASCADE)
    original_filename = models.CharField(max_length=500)
    file_size = models.BigIntegerField()  # File size in bytes
    dimensions = models.JSONField()  # {"width": 12000, "height": 8000}
    bands = models.IntegerField(default=3)  # RGB = 3, RGBA = 4, etc.
    nasa_api_url = models.URLField(blank=True)  # Source URL from NASA API
    created_at = models.DateTimeField(auto_now_add=True)


class TileCache(models.Model):
    """
    Tracks which tiles have been generated for each dataset and zoom level
    Helps with performance monitoring and cache management
    """
    dataset = models.ForeignKey(Dataset, on_delete=models.CASCADE)
    zoom_level = models.IntegerField()
    tiles_count = models.IntegerField()  # Number of tiles at this zoom level
    generation_date = models.DateTimeField(auto_now_add=True)

# Add to api/models.py (at the end)

class SearchResult(models.Model):
    """Simple NASA search result model"""
    query = models.CharField(max_length=200)
    nasa_id = models.CharField(max_length=100, unique=True)
    title = models.CharField(max_length=500)
    description = models.TextField()
    image_url = models.URLField()
    date_created = models.DateTimeField(null=True, blank=True)
    keywords = models.JSONField(default=list)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title

    
class SearchCache(models.Model):
    """
    Cache popular searches to improve performance
    """
    query = models.CharField(max_length=200, unique=True)
    result_count = models.IntegerField()
    last_updated = models.DateTimeField(auto_now=True)
    results = models.ManyToManyField(SearchResult)

class NASASearchResult(models.Model):
    """
    Store NASA image search results with metadata
    """
    nasa_id = models.CharField(max_length=100, unique=True)
    title = models.CharField(max_length=500)
    description = models.TextField()
    keywords = models.JSONField(default=list)
    
    # Image URLs
    image_url = models.URLField()
    thumbnail_url = models.URLField(blank=True)
    
    # Metadata
    center = models.CharField(max_length=100, blank=True)  # NASA center
    date_created = models.DateTimeField(null=True, blank=True)
    media_type = models.CharField(max_length=50, default='image')
    
    # Search info
    search_query = models.CharField(max_length=200)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return self.title

class SearchQuery(models.Model):
    """
    Track popular searches and cache results
    """
    query = models.CharField(max_length=200, unique=True)
    search_count = models.IntegerField(default=1)
    last_searched = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"{self.query} ({self.search_count} searches)"
