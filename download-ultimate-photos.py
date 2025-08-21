#!/usr/bin/env python3
"""
Trump-Epstein Investigation - Ultimate Photo Acquisition System
Multi-source photo downloader with advanced search, verification, and organization
"""

import requests
import json
import os
import time
import hashlib
import logging
from urllib.parse import urlparse, urljoin
from pathlib import Path
from dataclasses import dataclass, asdict
from typing import List, Dict, Optional, Tuple
from PIL import Image
import wikipediaapi
import re
from datetime import datetime

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

@dataclass
class PhotoMetadata:
    filename: str
    source_url: str
    source_type: str  # wikipedia, news, court, social, etc.
    person_id: str
    description: str
    date_taken: Optional[str] = None
    evidence_level: str = 'alleged'  # confirmed, documented, alleged, suspected
    tags: List[str] = None
    verification_status: str = 'unverified'
    file_hash: Optional[str] = None
    download_date: str = None

class UltimatePhotoDownloader:
    def __init__(self):
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        })
        
        # Photo cache and metadata
        self.photo_cache = {}
        self.metadata_db = {}
        self.downloaded_hashes = set()
        
        # Source configurations
        self.sources = {
            'wikipedia': {
                'enabled': True,
                'rate_limit': 1.0,  # seconds between requests
                'quality': 'high'
            },
            'getty_images': {
                'enabled': True,
                'rate_limit': 2.0,
                'quality': 'high'
            },
            'court_records': {
                'enabled': True,
                'rate_limit': 1.5,
                'quality': 'evidence'
            },
            'news_archives': {
                'enabled': True,
                'rate_limit': 1.0,
                'quality': 'medium'
            }
        }
        
        # Initialize comprehensive person database
        self.initialize_person_database()
        self.setup_directories()

    def initialize_person_database(self):
        """Initialize comprehensive database of people to photograph"""
        self.people_db = {
            # Core Network
            'jeffrey-epstein': {
                'name': 'Jeffrey Epstein',
                'category': 'core',
                'wikipedia': 'Jeffrey Epstein',
                'aliases': ['Jeff Epstein', 'Jeffrey E. Epstein'],
                'priority': 'highest',
                'photo_types': ['mugshot', 'social', 'business', 'young', 'property'],
                'specific_searches': [
                    'Jeffrey Epstein arrest',
                    'Jeffrey Epstein young finance',
                    'Jeffrey Epstein Little St James',
                    'Jeffrey Epstein Manhattan mansion',
                    'Jeffrey Epstein private jet'
                ]
            },
            'ghislaine-maxwell': {
                'name': 'Ghislaine Maxwell',
                'category': 'core',
                'wikipedia': 'Ghislaine Maxwell',
                'aliases': ['Ghislaine Noelle Marion Maxwell'],
                'priority': 'highest',
                'photo_types': ['court', 'social', 'young', 'with-epstein'],
                'specific_searches': [
                    'Ghislaine Maxwell court trial',
                    'Ghislaine Maxwell Prince Andrew Virginia Giuffre',
                    'Ghislaine Maxwell young Oxford',
                    'Ghislaine Maxwell Robert Maxwell daughter'
                ]
            },
            
            # Politicians - High Priority
            'donald-trump': {
                'name': 'Donald Trump',
                'category': 'politicians',
                'wikipedia': 'Donald Trump',
                'aliases': ['The Donald', 'Trump'],
                'priority': 'highest',
                'photo_types': ['social', 'business', 'events', 'young'],
                'specific_searches': [
                    'Donald Trump Jeffrey Epstein Mar-a-Lago',
                    'Trump Epstein 1992 party',
                    'Trump Epstein Maxwell 2000',
                    'Trump wedding 1993 Epstein guest',
                    'Trump Epstein friendship photos'
                ]
            },
            'bill-clinton': {
                'name': 'Bill Clinton',
                'category': 'politicians',
                'wikipedia': 'Bill Clinton',
                'aliases': ['William Jefferson Clinton'],
                'priority': 'highest',
                'photo_types': ['travel', 'social', 'official'],
                'specific_searches': [
                    'Bill Clinton Epstein Lolita Express',
                    'Clinton Little St James island',
                    'Clinton Epstein Africa trip',
                    'Clinton Spacey Tucker Epstein plane'
                ]
            },
            'prince-andrew': {
                'name': 'Prince Andrew',
                'category': 'royalty',
                'wikipedia': 'Prince Andrew, Duke of York',
                'aliases': ['Duke of York', 'Andrew Windsor'],
                'priority': 'highest',
                'photo_types': ['royal', 'social', 'evidence'],
                'specific_searches': [
                    'Prince Andrew Virginia Giuffre Maxwell',
                    'Prince Andrew Epstein Windsor',
                    'Prince Andrew Pizza Express alibi',
                    'Prince Andrew sweating condition'
                ]
            },
            
            # Business Leaders
            'bill-gates': {
                'name': 'Bill Gates',
                'category': 'business',
                'wikipedia': 'Bill Gates',
                'aliases': ['William Henry Gates III'],
                'priority': 'high',
                'photo_types': ['business', 'meetings', 'social'],
                'specific_searches': [
                    'Bill Gates Jeffrey Epstein meeting',
                    'Gates Epstein Manhattan mansion',
                    'Gates Epstein philanthropy'
                ]
            },
            'les-wexner': {
                'name': 'Les Wexner',
                'category': 'business',
                'wikipedia': 'Les Wexner',
                'aliases': ['Leslie Herbert Wexner'],
                'priority': 'high',
                'photo_types': ['business', 'social', 'corporate'],
                'specific_searches': [
                    'Les Wexner Jeffrey Epstein',
                    'Wexner Victorias Secret Epstein',
                    'Wexner Limited Brands Epstein'
                ]
            },
            'elon-musk': {
                'name': 'Elon Musk',
                'category': 'business',
                'wikipedia': 'Elon Musk',
                'aliases': ['Elon Reeve Musk'],
                'priority': 'medium',
                'photo_types': ['business', 'social', 'events'],
                'specific_searches': [
                    'Elon Musk Epstein connections',
                    'Musk Silicon Valley Epstein'
                ]
            },
            'kimbal-musk': {
                'name': 'Kimbal Musk',
                'category': 'business',
                'wikipedia': 'Kimbal Musk',
                'aliases': ['Kimbal James Musk'],
                'priority': 'medium',
                'photo_types': ['business', 'social'],
                'specific_searches': [
                    'Kimbal Musk Epstein network',
                    'Kimbal Musk Silicon Valley connections'
                ]
            },
            
            # Celebrities
            'kevin-spacey': {
                'name': 'Kevin Spacey',
                'category': 'celebrities',
                'wikipedia': 'Kevin Spacey',
                'aliases': ['Kevin Spacey Fowler'],
                'priority': 'high',
                'photo_types': ['travel', 'social', 'events'],
                'specific_searches': [
                    'Kevin Spacey Bill Clinton Epstein plane',
                    'Spacey Africa humanitarian trip',
                    'Spacey Clinton Foundation'
                ]
            },
            'chris-tucker': {
                'name': 'Chris Tucker',
                'category': 'celebrities',
                'wikipedia': 'Chris Tucker',
                'aliases': ['Christopher Tucker'],
                'priority': 'medium',
                'photo_types': ['travel', 'social'],
                'specific_searches': [
                    'Chris Tucker Clinton Epstein Africa',
                    'Tucker humanitarian mission'
                ]
            },
            
            # Academics
            'stephen-hawking': {
                'name': 'Stephen Hawking',
                'category': 'academics',
                'wikipedia': 'Stephen Hawking',
                'aliases': ['Stephen William Hawking'],
                'priority': 'medium',
                'photo_types': ['academic', 'events', 'conferences'],
                'specific_searches': [
                    'Stephen Hawking Epstein science conference',
                    'Hawking St Thomas submarine',
                    'Hawking physics symposium'
                ]
            },
            'steven-pinker': {
                'name': 'Steven Pinker',
                'category': 'academics',
                'wikipedia': 'Steven Pinker',
                'aliases': ['Steven Arthur Pinker'],
                'priority': 'medium',
                'photo_types': ['academic', 'social'],
                'specific_searches': [
                    'Steven Pinker Epstein Harvard',
                    'Pinker Epstein flight logs'
                ]
            },
            
            # Victims and Survivors
            'virginia-giuffre': {
                'name': 'Virginia Giuffre',
                'category': 'victims',
                'wikipedia': 'Virginia Giuffre',
                'aliases': ['Virginia Roberts', 'Virginia Roberts Giuffre'],
                'priority': 'highest',
                'photo_types': ['legal', 'testimony', 'evidence', 'young'],
                'specific_searches': [
                    'Virginia Giuffre testimony',
                    'Virginia Roberts young',
                    'Virginia Giuffre Prince Andrew',
                    'Virginia Roberts Mar-a-Lago'
                ]
            },
            
            # International Figures
            'vladimir-putin': {
                'name': 'Vladimir Putin',
                'category': 'international',
                'wikipedia': 'Vladimir Putin',
                'aliases': ['Vladimir Vladimirovich Putin'],
                'priority': 'high',
                'photo_types': ['official', 'meetings', 'intelligence'],
                'specific_searches': [
                    'Putin Epstein Russia connections',
                    'Putin oligarchs Epstein network'
                ]
            },
            'mohammed-bin-salman': {
                'name': 'Mohammed bin Salman',
                'category': 'royalty',
                'wikipedia': 'Mohammed bin Salman',
                'aliases': ['Crown Prince Mohammed', 'MBS'],
                'priority': 'high',
                'photo_types': ['official', 'diplomatic', 'business'],
                'specific_searches': [
                    'Mohammed bin Salman Epstein connections',
                    'Saudi Crown Prince arms deals'
                ]
            },
            
            # Enablers
            'jean-luc-brunel': {
                'name': 'Jean-Luc Brunel',
                'category': 'enablers',
                'wikipedia': 'Jean-Luc Brunel',
                'aliases': ['JL Brunel'],
                'priority': 'high',
                'photo_types': ['modeling', 'arrest', 'social'],
                'specific_searches': [
                    'Jean-Luc Brunel arrest Paris',
                    'Brunel modeling agency',
                    'Brunel MC2 Epstein'
                ]
            },
            'alexander-acosta': {
                'name': 'Alexander Acosta',
                'category': 'enablers',
                'wikipedia': 'Alexander Acosta',
                'aliases': ['Alex Acosta'],
                'priority': 'high',
                'photo_types': ['official', 'legal', 'government'],
                'specific_searches': [
                    'Alexander Acosta Epstein plea deal',
                    'Acosta Labor Secretary',
                    'Acosta sweetheart deal 2008'
                ]
            }
        }

    def setup_directories(self):
        """Create organized directory structure"""
        base_dir = Path('images')
        categories = ['core', 'politicians', 'royalty', 'business', 'celebrities', 
                     'academics', 'victims', 'enablers', 'international', 'evidence',
                     'properties', 'aircraft', 'documents']
        
        for category in categories:
            (base_dir / 'people' / category).mkdir(parents=True, exist_ok=True)
        
        # Special directories
        (base_dir / 'evidence').mkdir(parents=True, exist_ok=True)
        (base_dir / 'properties').mkdir(parents=True, exist_ok=True)
        (base_dir / 'aircraft').mkdir(parents=True, exist_ok=True)
        (base_dir / 'documents').mkdir(parents=True, exist_ok=True)
        
        logger.info(f"📁 Directory structure created for {len(categories)} categories")

    def get_wikipedia_images(self, person_data: Dict) -> List[Dict]:
        """Enhanced Wikipedia image extraction"""
        images = []
        
        try:
            wiki = wikipediaapi.Wikipedia('en', headers={
                'User-Agent': 'Trump-Epstein Investigation (research@example.com)'
            })
            
            page = wiki.page(person_data['wikipedia'])
            if not page.exists():
                logger.warning(f"❌ Wikipedia page not found: {person_data['wikipedia']}")
                return images
            
            # Get main page images
            if hasattr(page, 'images') and page.images:
                for img_url in page.images[:5]:  # Limit to first 5 images
                    if self.is_valid_image_url(img_url):
                        images.append({
                            'url': img_url,
                            'source_type': 'wikipedia',
                            'description': f"Wikipedia image of {person_data['name']}",
                            'evidence_level': 'documented'
                        })
            
            # Search for specific image categories
            image_categories = [
                'official photos',
                'portraits',
                'mugshots',
                'court photos',
                'business photos'
            ]
            
            # Additional Wikipedia API calls for image categories
            # This would require more sophisticated Wikipedia API usage
            
        except Exception as e:
            logger.error(f"❌ Wikipedia error for {person_data['name']}: {e}")
        
        return images

    def search_news_archives(self, person_data: Dict) -> List[Dict]:
        """Search news archives and photo agencies"""
        images = []
        
        # Simulate news archive search
        # In a real implementation, this would integrate with:
        # - Getty Images API
        # - AP Images
        # - Reuters
        # - NY Times archives
        # - Washington Post archives
        
        search_terms = [person_data['name']] + person_data.get('aliases', [])
        
        for search_term in search_terms:
            # Add specific search combinations
            specific_searches = person_data.get('specific_searches', [])
            for specific_search in specific_searches[:3]:  # Limit to prevent rate limiting
                # This would be actual API calls to news services
                logger.info(f"🔍 Searching news archives for: {specific_search}")
                time.sleep(self.sources['news_archives']['rate_limit'])
        
        return images

    def search_court_evidence(self, person_data: Dict) -> List[Dict]:
        """Search court records and legal documents for photos"""
        images = []
        
        # Known evidence photo sources
        evidence_photos = {
            'prince-andrew': [
                {
                    'url': 'court_evidence/prince_andrew_giuffre_maxwell.jpg',
                    'description': 'Prince Andrew with Virginia Giuffre and Ghislaine Maxwell',
                    'evidence_level': 'confirmed',
                    'source_type': 'court_evidence',
                    'case': 'Giuffre v. Prince Andrew'
                }
            ],
            'ghislaine-maxwell': [
                {
                    'url': 'court_evidence/maxwell_trial_photos.jpg',
                    'description': 'Maxwell trial court photos',
                    'evidence_level': 'confirmed',
                    'source_type': 'court_evidence',
                    'case': 'United States v. Maxwell'
                }
            ],
            'jeffrey-epstein': [
                {
                    'url': 'court_evidence/epstein_arrest_mugshot.jpg',
                    'description': 'FBI arrest mugshot 2019',
                    'evidence_level': 'confirmed',
                    'source_type': 'court_evidence',
                    'case': 'United States v. Epstein'
                }
            ]
        }
        
        person_id = self.get_person_id(person_data['name'])
        if person_id in evidence_photos:
            images.extend(evidence_photos[person_id])
        
        return images

    def search_social_media_archives(self, person_data: Dict) -> List[Dict]:
        """Search social media archives and photo sharing sites"""
        images = []
        
        # This would integrate with:
        # - Instagram archives
        # - Facebook archives
        # - Twitter image archives
        # - Flickr
        # - Social media monitoring services
        
        logger.info(f"🔍 Searching social media archives for {person_data['name']}")
        
        return images

    def download_image(self, image_data: Dict, person_data: Dict) -> Optional[PhotoMetadata]:
        """Download and process image with metadata"""
        try:
            url = image_data['url']
            
            # Skip if URL is not valid
            if not self.is_valid_image_url(url):
                return None
            
            # Generate filename
            person_id = self.get_person_id(person_data['name'])
            filename = self.generate_filename(person_data, image_data)
            filepath = self.get_filepath(person_data['category'], filename)
            
            # Skip if already exists
            if filepath.exists():
                logger.info(f"⚡ Already exists: {filename}")
                return self.load_existing_metadata(filepath)
            
            # Download image
            response = self.session.get(url, timeout=30, stream=True)
            response.raise_for_status()
            
            # Verify content type
            content_type = response.headers.get('content-type', '')
            if not content_type.startswith('image/'):
                logger.warning(f"❌ Not an image: {url}")
                return None
            
            # Save image
            with open(filepath, 'wb') as f:
                for chunk in response.iter_content(chunk_size=8192):
                    f.write(chunk)
            
            # Verify image integrity
            try:
                with Image.open(filepath) as img:
                    img.verify()
                    
                # Calculate file hash
                file_hash = self.calculate_file_hash(filepath)
                
                # Check for duplicates
                if file_hash in self.downloaded_hashes:
                    logger.warning(f"⚠️ Duplicate image detected: {filename}")
                    filepath.unlink()  # Delete duplicate
                    return None
                
                self.downloaded_hashes.add(file_hash)
                
                # Create metadata
                metadata = PhotoMetadata(
                    filename=filename,
                    source_url=url,
                    source_type=image_data['source_type'],
                    person_id=person_id,
                    description=image_data['description'],
                    evidence_level=image_data.get('evidence_level', 'alleged'),
                    tags=image_data.get('tags', []),
                    verification_status='unverified',
                    file_hash=file_hash,
                    download_date=datetime.now().isoformat()
                )
                
                # Save metadata
                self.save_metadata(metadata)
                
                logger.info(f"✅ Downloaded: {filename}")
                return metadata
                
            except Exception as e:
                logger.error(f"❌ Invalid image file: {filename} - {e}")
                if filepath.exists():
                    filepath.unlink()
                return None
                
        except Exception as e:
            logger.error(f"❌ Download failed {url}: {e}")
            return None

    def calculate_file_hash(self, filepath: Path) -> str:
        """Calculate SHA-256 hash of file"""
        sha256_hash = hashlib.sha256()
        with open(filepath, 'rb') as f:
            for byte_block in iter(lambda: f.read(4096), b""):
                sha256_hash.update(byte_block)
        return sha256_hash.hexdigest()

    def save_metadata(self, metadata: PhotoMetadata):
        """Save photo metadata to JSON file"""
        metadata_file = Path('images/photo_metadata.json')
        
        # Load existing metadata
        if metadata_file.exists():
            with open(metadata_file, 'r') as f:
                all_metadata = json.load(f)
        else:
            all_metadata = {}
        
        # Add new metadata
        all_metadata[metadata.filename] = asdict(metadata)
        
        # Save updated metadata
        with open(metadata_file, 'w') as f:
            json.dump(all_metadata, f, indent=2)

    def load_existing_metadata(self, filepath: Path) -> Optional[PhotoMetadata]:
        """Load metadata for existing file"""
        metadata_file = Path('images/photo_metadata.json')
        if not metadata_file.exists():
            return None
        
        try:
            with open(metadata_file, 'r') as f:
                all_metadata = json.load(f)
            
            filename = filepath.name
            if filename in all_metadata:
                return PhotoMetadata(**all_metadata[filename])
        except Exception as e:
            logger.error(f"❌ Error loading metadata: {e}")
        
        return None

    def is_valid_image_url(self, url: str) -> bool:
        """Check if URL points to a valid image"""
        if not url or not url.startswith(('http://', 'https://')):
            return False
        
        # Check file extension
        parsed = urlparse(url)
        path = parsed.path.lower()
        valid_extensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp']
        
        return any(path.endswith(ext) for ext in valid_extensions)

    def generate_filename(self, person_data: Dict, image_data: Dict) -> str:
        """Generate descriptive filename"""
        person_id = self.get_person_id(person_data['name'])
        source_type = image_data['source_type']
        
        # Extract description keywords
        description = image_data.get('description', '')
        keywords = re.findall(r'\b\w+\b', description.lower())
        keywords = [k for k in keywords[:3] if len(k) > 3]  # Take first 3 meaningful words
        
        if keywords:
            desc_part = '-'.join(keywords)
            filename = f"{person_id}-{source_type}-{desc_part}.jpg"
        else:
            timestamp = int(time.time())
            filename = f"{person_id}-{source_type}-{timestamp}.jpg"
        
        # Clean filename
        filename = re.sub(r'[^\w\-_.]', '', filename)
        return filename

    def get_person_id(self, name: str) -> str:
        """Convert person name to ID"""
        return name.lower().replace(' ', '-').replace('.', '').replace(',', '')

    def get_filepath(self, category: str, filename: str) -> Path:
        """Get full filepath for image"""
        return Path('images') / 'people' / category / filename

    def download_all_photos(self) -> Tuple[int, int]:
        """Download photos for all people in database"""
        logger.info(f"🎯 Starting comprehensive photo download for {len(self.people_db)} people")
        
        total_success = 0
        total_failure = 0
        
        for person_id, person_data in self.people_db.items():
            logger.info(f"📸 Processing: {person_data['name']} ({person_data['priority']} priority)")
            
            all_images = []
            
            # Wikipedia images
            if self.sources['wikipedia']['enabled']:
                wiki_images = self.get_wikipedia_images(person_data)
                all_images.extend(wiki_images)
                time.sleep(self.sources['wikipedia']['rate_limit'])
            
            # News archive images
            if self.sources['news_archives']['enabled']:
                news_images = self.search_news_archives(person_data)
                all_images.extend(news_images)
                time.sleep(self.sources['news_archives']['rate_limit'])
            
            # Court evidence images
            if self.sources['court_records']['enabled']:
                court_images = self.search_court_evidence(person_data)
                all_images.extend(court_images)
                time.sleep(self.sources['court_records']['rate_limit'])
            
            # Download each image
            person_success = 0
            person_failure = 0
            
            for image_data in all_images[:10]:  # Limit per person to prevent overwhelming
                metadata = self.download_image(image_data, person_data)
                if metadata:
                    person_success += 1
                    total_success += 1
                else:
                    person_failure += 1
                    total_failure += 1
                
                # Rate limiting between downloads
                time.sleep(1)
            
            logger.info(f"✅ {person_data['name']}: {person_success} success, {person_failure} failed")
        
        logger.info(f"🎉 Photo download complete!")
        logger.info(f"✅ Total Success: {total_success}")
        logger.info(f"❌ Total Failures: {total_failure}")
        
        # Generate final manifest
        self.generate_photo_manifest()
        
        return total_success, total_failure

    def generate_photo_manifest(self):
        """Generate comprehensive photo manifest"""
        manifest = {
            'generation_date': datetime.now().isoformat(),
            'total_people': len(self.people_db),
            'categories': {},
            'evidence_levels': {},
            'source_types': {},
            'total_photos': 0,
            'people_with_photos': 0,
            'verification_summary': {
                'verified': 0,
                'unverified': 0,
                'disputed': 0
            }
        }
        
        # Count photos by category
        for category in ['core', 'politicians', 'royalty', 'business', 'celebrities', 'academics', 'victims', 'enablers']:
            category_dir = Path('images/people') / category
            if category_dir.exists():
                photo_count = len(list(category_dir.glob('*.jpg')))
                manifest['categories'][category] = photo_count
                manifest['total_photos'] += photo_count
        
        # Load metadata for detailed analysis
        metadata_file = Path('images/photo_metadata.json')
        if metadata_file.exists():
            with open(metadata_file, 'r') as f:
                all_metadata = json.load(f)
            
            for filename, metadata in all_metadata.items():
                # Evidence levels
                evidence_level = metadata.get('evidence_level', 'unknown')
                manifest['evidence_levels'][evidence_level] = manifest['evidence_levels'].get(evidence_level, 0) + 1
                
                # Source types
                source_type = metadata.get('source_type', 'unknown')
                manifest['source_types'][source_type] = manifest['source_types'].get(source_type, 0) + 1
                
                # Verification status
                verification = metadata.get('verification_status', 'unverified')
                if verification in manifest['verification_summary']:
                    manifest['verification_summary'][verification] += 1
        
        # Count people with photos
        for person_id, person_data in self.people_db.items():
            category_dir = Path('images/people') / person_data['category']
            person_photos = list(category_dir.glob(f"{person_id}-*.jpg"))
            if person_photos:
                manifest['people_with_photos'] += 1
        
        # Save manifest
        with open('images/photo-manifest.json', 'w') as f:
            json.dump(manifest, f, indent=2)
        
        logger.info(f"📊 Photo manifest generated: {manifest['total_photos']} total photos")
        return manifest

    def verify_photo_integrity(self):
        """Verify all downloaded photos are valid"""
        logger.info("🔍 Verifying photo integrity...")
        
        corrupted_files = []
        total_checked = 0
        
        for category in ['core', 'politicians', 'royalty', 'business', 'celebrities', 'academics', 'victims', 'enablers']:
            category_dir = Path('images/people') / category
            if category_dir.exists():
                for photo_file in category_dir.glob('*.jpg'):
                    total_checked += 1
                    try:
                        with Image.open(photo_file) as img:
                            img.verify()
                    except Exception as e:
                        logger.error(f"❌ Corrupted file: {photo_file}")
                        corrupted_files.append(photo_file)
        
        logger.info(f"✅ Verified {total_checked} photos, {len(corrupted_files)} corrupted")
        
        # Remove corrupted files
        for corrupted_file in corrupted_files:
            corrupted_file.unlink()
            logger.info(f"🗑️ Removed corrupted file: {corrupted_file.name}")

def main():
    print("📸 Trump-Epstein Investigation - Ultimate Photo Acquisition System")
    print("=" * 70)
    
    downloader = UltimatePhotoDownloader()
    
    # Download all photos
    success, failures = downloader.download_all_photos()
    
    # Verify integrity
    downloader.verify_photo_integrity()
    
    print(f"\n📊 Final Results:")
    print(f"   Photos Downloaded: {success}")
    print(f"   Failed Downloads: {failures}")
    print(f"   Success Rate: {(success/(success+failures)*100):.1f}%")
    print(f"\n🎯 Photos organized in: images/people/[category]/")
    print(f"📋 Metadata saved in: images/photo_metadata.json")
    print(f"📊 Manifest saved in: images/photo-manifest.json")
    
    return success, failures

if __name__ == "__main__":
    main()