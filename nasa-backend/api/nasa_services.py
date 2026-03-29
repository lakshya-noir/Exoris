import requests
from django.conf import settings
from datetime import datetime
from .models import NASASearchResult, SearchQuery

class NASADataFetcher:
    def __init__(self):
        self.api_key = getattr(settings, 'NASA_API_KEY', 'DEMO_KEY')
        self.base_url = 'https://api.nasa.gov'

class NASAImageSearchService:
    def __init__(self):
        self.api_key = getattr(settings, 'NASA_API_KEY', 'DEMO_KEY')

    def search_images(self, query, limit=20):
        if 'mars' in query.lower():
            return self.fetch_mars_rover_images(limit)

        search_obj, created = SearchQuery.objects.get_or_create(query=query.lower())
        if not created:
            search_obj.search_count += 1
            search_obj.save()

        existing = NASASearchResult.objects.filter(search_query__icontains=query.lower())[:limit]
        if existing.exists():
            return [self.result_to_dict(r) for r in existing]

        return self.fetch_from_nasa(query, limit)

    def fetch_mars_rover_images(self, limit=20):
        rovers = ['curiosity', 'perseverance', 'opportunity']
        results = []
        per_rover = max(1, limit // len(rovers))
        for rover in rovers:
            if len(results) >= limit:
                break
            url = f"https://api.nasa.gov/mars-photos/api/v1/rovers/{rover}/latest_photos"
            try:
                response = requests.get(url, params={'api_key': self.api_key}, timeout=15)
                response.raise_for_status()
                data = response.json()
                photos = data.get('latest_photos', [])[:per_rover]
                for p in photos:
                    img = {
                        'nasa_id': f"mars-{rover}-{p['id']}",
                        'title': f"Mars {rover.title()} - {p['camera']['full_name']}",
                        'description': f"Photo taken on Earth date {p['earth_date']}",
                        'keywords': ['mars', rover, p['camera']['name'].lower()],
                        'image_url': p['img_src'],
                        'thumbnail_url': p['img_src'],
                        'center': 'JPL',
                        'date_created': datetime.fromisoformat(p['earth_date'] + 'T00:00:00+00:00'),
                        'media_type': 'image',
                    }
                    results.append(img)
                    self.save_result(img, 'mars')
                    if len(results) >= limit:
                        break
            except Exception as e:
                print(f"Error fetching Mars rover images from {rover}: {e}")
        return results

    def get_scientific_keywords(self, query):
        keyword_map = {
            'mercury': 'mercury,planet,messenger,mariner,innermost,closest,solar',
            'venus': 'venus,planet,magellan,venera,surface,clouds,atmosphere',
            'earth': 'earth,landsat,modis,satellite,iss,blue marble,home planet',
            'mars': 'mars,planet,mro,rover,orbiter,curiosity,perseverance,terrain,geology,crater,high resolution',
            'jupiter': 'jupiter,planet,juno,galileo,jovian,great red spot,gas giant',
            'saturn': 'saturn,planet,cassini,rings,titan,enceladus,gas giant',
            'uranus': 'uranus,planet,voyager,ice giant,rings,tilted',
            'neptune': 'neptune,planet,voyager,ice giant,winds,farthest',
            'pluto': 'pluto,dwarf planet,new horizons,kuiper belt,distant',
            'sun': 'sun,solar,corona,flare,sdo,soho,parker probe,solar dynamics',
            'moon': 'moon,lunar,apollo,crater,mare,surface,earth moon',
            'europa': 'europa,jupiter,moon,ice,subsurface ocean,galilean',
            'titan': 'titan,saturn,moon,atmosphere,lakes,methane',
            'enceladus': 'enceladus,saturn,moon,ice,geysers,water',
            'io': 'io,jupiter,moon,volcanic,sulfur,galilean',
            'ganymede': 'ganymede,jupiter,moon,largest,galilean',
            'callisto': 'callisto,jupiter,moon,cratered,galilean',
            'phobos': 'phobos,mars,moon,small,satellite',
            'deimos': 'deimos,mars,moon,small,satellite',
            'mimas': 'mimas,saturn,moon,small,satellite',
            'tethys': 'tethys,saturn,moon,ring,satellite',
            'dione': 'dione,saturn,moon,satellite',
            'rhea': 'rhea,saturn,moon,satellite',
            'hyperion': 'hyperion,saturn,moon,irregular',
            'iapetus': 'iapetus,saturn,moon,satellite',
            'amalthea': 'amalthea,jupiter,moon,satellite',
            'himalia': 'himalia,jupiter,moon,satellite',
            'miranda': 'miranda,uranus,moon,satellite',
            'ariel': 'ariel,uranus,moon,satellite',
            'umbriel': 'umbriel,uranus,moon,satellite',
            'titania': 'titania,uranus,moon,satellite',
            'oberon': 'oberon,uranus,moon,satellite',
            'triton': 'triton,neptune,moon,satellite',
            'nebula': 'nebula,hubble,spitzer,jwst,webb,emission,planetary,gas cloud',
            'galaxy': 'galaxy,hubble,spiral,elliptical,andromeda,milky way,deep field',
        }
        q = query.lower()
        for key, kws in keyword_map.items():
            if key in q:
                return kws
        return None

    def fetch_from_nasa(self, query, limit=20):
        url = "https://images-api.nasa.gov/search"
        params = {'q': query, 'media_type': 'image', 'page_size': limit * 3}
        kws = self.get_scientific_keywords(query)
        if kws:
            params['keywords'] = kws
        try:
            resp = requests.get(url, params=params, timeout=15).json()
            results = []
            for item in resp.get('collection', {}).get('items', []):
                if len(results) >= limit:
                    break
                parsed = self.parse_nasa_item(item)
                if parsed:
                    results.append(parsed)
                    self.save_result(parsed, query)
            return results
        except Exception as e:
            print(f"NASA API error: {e}")
            return []

    def parse_nasa_item(self, item):
        try:
            d = item.get('data', [{}])[0]
            txt = f"{d.get('title', '').lower()} {d.get('description', '').lower()}"
            skip = ['crew', 'astronaut', 'logo', 'poster', 'concept', 'illustration']
            if any(k in txt for k in skip):
                return None
            links = item.get('links', [])
            img = thumb = ''
            for l in links:
                href = l.get('href', '')
                if l.get('rel') == 'preview':
                    thumb = href
                elif any(ext in href.lower() for ext in ['.jpg', '.jpeg', '.png', '.tiff']):
                    if not img or 'large' in href:
                        img = href
            if not img:
                return None
            date = None
            try:
                date = datetime.fromisoformat(d.get('date_created', '').replace('Z', '+00:00'))
            except:
                pass
            return {
                'nasa_id': d.get('nasa_id', ''),
                'title': d.get('title', ''),
                'description': d.get('description', ''),
                'keywords': d.get('keywords', []),
                'image_url': img,
                'thumbnail_url': thumb,
                'center': d.get('center', ''),
                'date_created': date,
                'media_type': d.get('media_type', 'image')
            }
        except Exception as e:
            print(f"Parse error: {e}")
            return None

    def save_result(self, rd, query):
        try:
            NASASearchResult.objects.get_or_create(
                nasa_id=rd['nasa_id'],
                defaults={**rd, 'search_query': query.lower()}
            )
        except Exception as e:
            print(f"Save error: {e}")

    def result_to_dict(self, r):
        return {
            'nasa_id': r.nasa_id,
            'title': r.title,
            'description': r.description,
            'keywords': r.keywords,
            'image_url': r.image_url,
            'thumbnail_url': r.thumbnail_url,
            'center': r.center,
            'date_created': r.date_created.isoformat() if r.date_created else None,
            'media_type': r.media_type
        }
