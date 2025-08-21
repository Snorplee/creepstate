#!/usr/bin/env python3
"""
Trump-Epstein Investigation Photo Management System
Downloads missing photos for the names-and-shame.html page

This script identifies people without photos and downloads appropriate images
from publicly available sources with proper verification and quality checks.
"""

import os
import sys
import json
import time
import requests
import hashlib
from PIL import Image
from datetime import datetime
from pathlib import Path
from urllib.parse import urlparse
import logging
from dataclasses import dataclass
from typing import List, Dict, Optional, Tuple

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('photo-download.log'),
        logging.StreamHandler()
    ]
)

@dataclass
class Person:
    id: str
    name: str
    category: str
    priority: int
    flag: str
    description: str
    sources: List[str]
    
class PhotoDownloader:
    def __init__(self, base_path: str):
        self.base_path = Path(base_path)
        self.people_path = self.base_path / "images" / "people"
        self.manifest_path = self.base_path / "images" / "photo-manifest.json"
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        })
        
        # Load existing manifest
        self.manifest = self.load_manifest()
        
        # Define all people from the HTML analysis
        self.people = self.define_all_people()
        
    def load_manifest(self) -> Dict:
        """Load existing photo manifest or create new one"""
        if self.manifest_path.exists():
            with open(self.manifest_path, 'r') as f:
                return json.load(f)
        return {
            "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
            "total_photos": 0,
            "categories": [],
            "category_stats": {},
            "issues": []
        }
    
    def define_all_people(self) -> List[Person]:
        """Define all people identified from names-and-shame.html"""
        return [
            # Priority 1: Core investigation figures
            Person("donald-trump", "Donald Trump", "politicians", 1, "🇺🇸", 
                   "45th President of the United States", 
                   ["commons.wikimedia.org", "whitehouse.gov", "official sources"]),
            Person("jeffrey-epstein", "Jeffrey Epstein", "enablers", 1, "💀", 
                   "Convicted sex trafficker", 
                   ["news sources", "court documents", "FBI records"]),
            Person("ghislaine-maxwell", "Ghislaine Maxwell", "enablers", 1, "👩", 
                   "Convicted trafficker, Epstein's accomplice", 
                   ["news sources", "court records", "trial photos"]),
            Person("bill-clinton", "Bill Clinton", "politicians", 1, "🇺🇸", 
                   "42nd President of the United States", 
                   ["commons.wikimedia.org", "official sources"]),
            Person("prince-andrew", "Prince Andrew", "royalty", 1, "🇬🇧", 
                   "Duke of York, British Royal Family", 
                   ["royal.uk", "commons.wikimedia.org", "news sources"]),

            # Priority 2: Key victims and witnesses
            Person("virginia-giuffre", "Virginia Giuffre", "victims", 2, "⚖️", 
                   "Key witness and survivor", 
                   ["news interviews", "legal proceedings", "advocacy work"]),

            # Priority 3: Politicians and government officials
            Person("hillary-clinton", "Hillary Clinton", "politicians", 3, "🇺🇸", 
                   "Former Secretary of State", 
                   ["commons.wikimedia.org", "state.gov", "official sources"]),
            Person("alan-dershowitz", "Alan Dershowitz", "politicians", 3, "⚖️", 
                   "Harvard Law Professor, Trump Lawyer", 
                   ["harvard.edu", "news sources", "legal records"]),
            Person("vladimir-putin", "Vladimir Putin", "politicians", 3, "🇷🇺", 
                   "President of Russia", 
                   ["commons.wikimedia.org", "kremlin.ru", "official sources"]),
            Person("matt-gaetz", "Matt Gaetz", "politicians", 3, "🇺🇸", 
                   "US Congressman, Florida", 
                   ["house.gov", "commons.wikimedia.org", "news sources"]),
            Person("ehud-barak", "Ehud Barak", "politicians", 3, "🇮🇱", 
                   "Former Israeli PM", 
                   ["commons.wikimedia.org", "knesset.gov.il", "news sources"]),
            Person("alex-acosta", "Alex Acosta", "politicians", 3, "⚖️", 
                   "Former Labor Secretary", 
                   ["dol.gov", "commons.wikimedia.org", "news sources"]),

            # Priority 4: Royalty
            Person("mohammed-bin-salman", "Crown Prince Mohammed bin Salman", "royalty", 4, "🇸🇦", 
                   "Saudi Crown Prince", 
                   ["spa.gov.sa", "commons.wikimedia.org", "official sources"]),

            # Priority 5: Business leaders
            Person("les-wexner", "Les Wexner", "business", 5, "💰", 
                   "L Brands CEO, Victoria's Secret", 
                   ["business publications", "corporate photos", "news sources"]),
            Person("glenn-dubin", "Glenn Dubin", "business", 5, "🏦", 
                   "Hedge Fund Manager", 
                   ["business publications", "financial news", "corporate photos"]),
            Person("bill-gates", "Bill Gates", "business", 5, "💻", 
                   "Microsoft Founder", 
                   ["commons.wikimedia.org", "gatesfoundation.org", "microsoft.com"]),
            Person("leon-black", "Leon Black", "business", 5, "🏛️", 
                   "Apollo Global Management", 
                   ["business publications", "financial news", "corporate photos"]),
            Person("elon-musk", "Elon Musk", "business", 5, "🚀", 
                   "Tesla/SpaceX CEO", 
                   ["commons.wikimedia.org", "tesla.com", "spacex.com"]),
            Person("kimbal-musk", "Kimbal Musk", "business", 5, "🍽️", 
                   "Entrepreneur, Elon's Brother", 
                   ["business publications", "commons.wikimedia.org", "news sources"]),

            # Priority 6: Academics and scientists
            Person("stephen-hawking", "Stephen Hawking", "academics", 6, "🧠", 
                   "Theoretical Physicist", 
                   ["commons.wikimedia.org", "cam.ac.uk", "hawking.org.uk"]),
            Person("steven-pinker", "Steven Pinker", "academics", 6, "🔬", 
                   "Harvard Psychologist", 
                   ["harvard.edu", "commons.wikimedia.org", "academic sources"]),
            Person("george-church", "George Church", "academics", 6, "🧬", 
                   "Harvard Geneticist", 
                   ["harvard.edu", "hms.harvard.edu", "academic sources"]),
            Person("marvin-minsky", "Marvin Minsky", "academics", 6, "🎭", 
                   "MIT AI Pioneer", 
                   ["mit.edu", "commons.wikimedia.org", "academic sources"]),

            # Priority 7: Celebrities and entertainment
            Person("mick-jagger", "Mick Jagger", "celebrities", 7, "🎸", 
                   "Rolling Stones Lead Singer", 
                   ["commons.wikimedia.org", "rollingstones.com", "music media"]),
            Person("kevin-spacey", "Kevin Spacey", "celebrities", 7, "🎬", 
                   "Actor", 
                   ["commons.wikimedia.org", "imdb.com", "entertainment media"]),
            Person("woody-allen", "Woody Allen", "celebrities", 7, "🎨", 
                   "Film Director", 
                   ["commons.wikimedia.org", "imdb.com", "entertainment media"]),
            Person("chris-tucker", "Chris Tucker", "celebrities", 7, "🎵", 
                   "Comedian/Actor", 
                   ["commons.wikimedia.org", "imdb.com", "entertainment media"]),
            Person("michael-wolff", "Michael Wolff", "celebrities", 7, "📚", 
                   "Author/Journalist", 
                   ["commons.wikimedia.org", "news sources", "author photos"]),

            # Priority 8: Other enablers and associates
            Person("jean-luc-brunel", "Jean-Luc Brunel", "enablers", 8, "🍷", 
                   "Model Scout", 
                   ["news sources", "court records", "modeling industry"]),
            Person("sarah-kellen", "Sarah Kellen", "enablers", 8, "🏠", 
                   "Epstein Assistant", 
                   ["court records", "news sources", "legal documents"]),
        ]
    
    def check_existing_photos(self) -> Dict[str, List[str]]:
        """Check which people already have photos"""
        existing = {}
        for person in self.people:
            category_path = self.people_path / person.category
            if category_path.exists():
                person_photos = []
                # Check for main photo
                main_photo = category_path / f"{person.id}.jpg"
                if main_photo.exists() and self.is_valid_image(main_photo):
                    person_photos.append(str(main_photo))
                
                # Check for numbered variations
                for i in range(1, 10):
                    var_photo = category_path / f"{person.id}-{i}.jpg"
                    if var_photo.exists() and self.is_valid_image(var_photo):
                        person_photos.append(str(var_photo))
                
                existing[person.id] = person_photos
        return existing
    
    def is_valid_image(self, path: Path) -> bool:
        """Check if image is valid and meets minimum requirements"""
        try:
            with Image.open(path) as img:
                width, height = img.size
                # Minimum 150x150 pixels for quality
                return width >= 150 and height >= 150
        except Exception:
            return False
    
    def download_wikimedia_commons_photo(self, search_term: str, person: Person) -> Optional[str]:
        """Download photo from Wikimedia Commons (public domain/free use)"""
        try:
            # Use Wikimedia Commons API to search for images
            api_url = "https://commons.wikimedia.org/w/api.php"
            params = {
                'action': 'query',
                'format': 'json',
                'list': 'search',
                'srsearch': f'"{search_term}" file:jpg|png',
                'srnamespace': 6,  # File namespace
                'srlimit': 10
            }
            
            response = self.session.get(api_url, params=params, timeout=30)
            if response.status_code != 200:
                return None
                
            data = response.json()
            
            if 'query' not in data or 'search' not in data['query']:
                return None
            
            # Try to find a suitable image
            for result in data['query']['search']:
                title = result['title']
                if 'File:' in title:
                    # Get image info
                    info_params = {
                        'action': 'query',
                        'format': 'json',
                        'titles': title,
                        'prop': 'imageinfo',
                        'iiprop': 'url|size'
                    }
                    
                    info_response = self.session.get(api_url, params=info_params, timeout=30)
                    if info_response.status_code == 200:
                        info_data = info_response.json()
                        
                        pages = info_data.get('query', {}).get('pages', {})
                        for page_id, page_data in pages.items():
                            if 'imageinfo' in page_data:
                                imageinfo = page_data['imageinfo'][0]
                                image_url = imageinfo.get('url')
                                width = imageinfo.get('width', 0)
                                height = imageinfo.get('height', 0)
                                
                                # Check if image meets minimum size requirements
                                if image_url and width >= 200 and height >= 200:
                                    return self.download_and_save_image(image_url, person, f"wikimedia-{title}")
            
            return None
            
        except Exception as e:
            logging.error(f"Error downloading from Wikimedia for {person.name}: {e}")
            return None
    
    def download_official_source_photo(self, person: Person) -> Optional[str]:
        """Try to download from official government/organization sources"""
        # This would implement specific logic for official sources
        # For now, we'll focus on Wikimedia Commons and placeholder generation
        return None
    
    def download_and_save_image(self, url: str, person: Person, source_tag: str) -> Optional[str]:
        """Download and save image with proper validation"""
        try:
            response = self.session.get(url, timeout=30, stream=True)
            if response.status_code != 200:
                return None
            
            # Create category directory if it doesn't exist
            category_path = self.people_path / person.category
            category_path.mkdir(parents=True, exist_ok=True)
            
            # Determine filename
            existing_photos = len(list(category_path.glob(f"{person.id}*.jpg")))
            if existing_photos == 0:
                filename = f"{person.id}.jpg"
            else:
                filename = f"{person.id}-{existing_photos + 1}.jpg"
            
            filepath = category_path / filename
            
            # Download and save
            with open(filepath, 'wb') as f:
                for chunk in response.iter_content(chunk_size=8192):
                    f.write(chunk)
            
            # Validate image
            if self.is_valid_image(filepath):
                # Optimize image
                self.optimize_image(filepath)
                logging.info(f"Successfully downloaded photo for {person.name}: {filename}")
                return str(filepath)
            else:
                # Remove invalid image
                filepath.unlink()
                logging.warning(f"Downloaded invalid image for {person.name}, removed")
                return None
                
        except Exception as e:
            logging.error(f"Error downloading image for {person.name}: {e}")
            return None
    
    def optimize_image(self, filepath: Path):
        """Optimize image for web use"""
        try:
            with Image.open(filepath) as img:
                # Convert to RGB if necessary
                if img.mode != 'RGB':
                    img = img.convert('RGB')
                
                # Resize if too large (max 800x800 for web optimization)
                max_size = 800
                if img.width > max_size or img.height > max_size:
                    img.thumbnail((max_size, max_size), Image.LANCZOS)
                
                # Save with optimization
                img.save(filepath, 'JPEG', quality=85, optimize=True)
                
        except Exception as e:
            logging.error(f"Error optimizing image {filepath}: {e}")
    
    def create_placeholder_image(self, person: Person) -> Optional[str]:
        """Create a placeholder image with person's flag/emoji"""
        try:
            # Create category directory if it doesn't exist
            category_path = self.people_path / person.category
            category_path.mkdir(parents=True, exist_ok=True)
            
            filename = f"{person.id}.jpg"
            filepath = category_path / filename
            
            # Create a simple colored placeholder
            size = (400, 400)
            # Use category-specific colors
            colors = {
                'politicians': '#FF4500',
                'royalty': '#FFD700', 
                'celebrities': '#FF69B4',
                'business': '#4ECDC4',
                'academics': '#45B7D1',
                'enablers': '#8B0000',
                'victims': '#800080'
            }
            
            color = colors.get(person.category, '#666666')
            
            # Create image (for now, just log that we would create it)
            logging.info(f"Would create placeholder for {person.name} with color {color}")
            return None  # Not actually creating placeholders in this version
            
        except Exception as e:
            logging.error(f"Error creating placeholder for {person.name}: {e}")
            return None
    
    def get_missing_people(self) -> List[Person]:
        """Get list of people who need photos"""
        existing = self.check_existing_photos()
        missing = []
        
        for person in self.people:
            if person.id not in existing or len(existing[person.id]) == 0:
                missing.append(person)
        
        # Sort by priority
        missing.sort(key=lambda p: p.priority)
        return missing
    
    def download_photos_for_person(self, person: Person) -> List[str]:
        """Download photos for a specific person"""
        downloaded = []
        
        logging.info(f"Processing {person.name} (Priority {person.priority})")
        
        # Try Wikimedia Commons first
        search_terms = [
            person.name,
            person.name.replace('-', ' '),
            f"{person.name} official",
            f"{person.name} portrait"
        ]
        
        for term in search_terms:
            result = self.download_wikimedia_commons_photo(term, person)
            if result:
                downloaded.append(result)
                break  # Stop after first successful download
        
        # Try official sources if no Wikimedia result
        if not downloaded:
            result = self.download_official_source_photo(person)
            if result:
                downloaded.append(result)
        
        # Create placeholder if no photos found
        if not downloaded:
            result = self.create_placeholder_image(person)
            if result:
                downloaded.append(result)
        
        return downloaded
    
    def update_manifest(self):
        """Update photo manifest with current status"""
        existing = self.check_existing_photos()
        
        # Count photos by category
        category_stats = {}
        total_valid = 0
        
        for person in self.people:
            category = person.category
            if category not in category_stats:
                category_stats[category] = {"valid": 0, "invalid": 0, "total": 0}
            
            photos = existing.get(person.id, [])
            valid_count = len(photos)
            category_stats[category]["valid"] += valid_count
            category_stats[category]["total"] += max(1, valid_count)  # Count person even if no photos
            total_valid += valid_count
        
        # Update manifest
        self.manifest.update({
            "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
            "total_photos": total_valid,
            "categories": list(category_stats.keys()),
            "category_stats": category_stats,
            "people_processed": len(self.people),
            "missing_photos": len(self.get_missing_people())
        })
        
        # Save manifest
        with open(self.manifest_path, 'w') as f:
            json.dump(self.manifest, f, indent=2)
    
    def run_download_process(self, max_downloads: int = 50):
        """Run the complete photo download process"""
        logging.info("Starting Trump-Epstein Investigation Photo Download Process")
        logging.info(f"Base path: {self.base_path}")
        
        # Get missing people
        missing = self.get_missing_people()
        logging.info(f"Found {len(missing)} people without photos")
        
        # Limit downloads to prevent overwhelming servers
        to_process = missing[:max_downloads]
        
        downloaded_count = 0
        failed_count = 0
        
        for i, person in enumerate(to_process, 1):
            logging.info(f"Processing {i}/{len(to_process)}: {person.name}")
            
            try:
                results = self.download_photos_for_person(person)
                if results:
                    downloaded_count += len(results)
                    logging.info(f"✓ Downloaded {len(results)} photo(s) for {person.name}")
                else:
                    failed_count += 1
                    logging.warning(f"✗ No photos found for {person.name}")
                
                # Rate limiting - be respectful to servers
                time.sleep(2)
                
            except Exception as e:
                failed_count += 1
                logging.error(f"Error processing {person.name}: {e}")
        
        # Update manifest
        self.update_manifest()
        
        # Summary
        logging.info(f"\n=== DOWNLOAD SUMMARY ===")
        logging.info(f"People processed: {len(to_process)}")
        logging.info(f"Photos downloaded: {downloaded_count}")
        logging.info(f"Failed downloads: {failed_count}")
        logging.info(f"Success rate: {(downloaded_count/(downloaded_count+failed_count)*100):.1f}%" if (downloaded_count+failed_count) > 0 else "N/A")
        logging.info(f"Manifest updated: {self.manifest_path}")
        
        return downloaded_count, failed_count

def main():
    """Main function"""
    if len(sys.argv) > 1:
        base_path = sys.argv[1]
    else:
        base_path = "."
    
    downloader = PhotoDownloader(base_path)
    
    # Run with conservative download limit
    downloaded, failed = downloader.run_download_process(max_downloads=25)
    
    print(f"\nPhoto download process completed!")
    print(f"Downloaded: {downloaded} photos")
    print(f"Failed: {failed} attempts")
    print(f"Check 'photo-download.log' for detailed results")

if __name__ == "__main__":
    main()