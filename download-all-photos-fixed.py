#!/usr/bin/env python3
"""
Trump-Epstein Timeline - Comprehensive Photo Download System
Downloads Wikipedia and other source photos for all network associates
"""

import requests
import json
import os
import time
import wikipediaapi
from PIL import Image
import logging

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

class PhotoDownloader:
    def __init__(self):
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        })
        
        # Photo cache to avoid re-downloads
        self.photo_cache = set()
        
        # Comprehensive list of all network associates
        self.associates = [
            # Core Network
            {'name': 'Jeffrey Epstein', 'wikipedia': 'Jeffrey Epstein', 'category': 'core'},
            {'name': 'Ghislaine Maxwell', 'wikipedia': 'Ghislaine Maxwell', 'category': 'core'},
            
            # Politicians - US
            {'name': 'Donald Trump', 'wikipedia': 'Donald Trump', 'category': 'politicians'},
            {'name': 'Bill Clinton', 'wikipedia': 'Bill Clinton', 'category': 'politicians'},
            {'name': 'Hillary Clinton', 'wikipedia': 'Hillary Clinton', 'category': 'politicians'},
            {'name': 'Alan Dershowitz', 'wikipedia': 'Alan Dershowitz', 'category': 'politicians'},
            {'name': 'Matt Gaetz', 'wikipedia': 'Matt Gaetz', 'category': 'politicians'},
            
            # Royalty & International
            {'name': 'Prince Andrew', 'wikipedia': 'Prince Andrew, Duke of York', 'category': 'royalty'},
            {'name': 'Mohammed bin Salman', 'wikipedia': 'Mohammed bin Salman', 'category': 'royalty'},
            {'name': 'Vladimir Putin', 'wikipedia': 'Vladimir Putin', 'category': 'international'},
            {'name': 'Ehud Barak', 'wikipedia': 'Ehud Barak', 'category': 'international'},
            
            # Business Leaders
            {'name': 'Les Wexner', 'wikipedia': 'Les Wexner', 'category': 'business'},
            {'name': 'Bill Gates', 'wikipedia': 'Bill Gates', 'category': 'business'},
            {'name': 'Elon Musk', 'wikipedia': 'Elon Musk', 'category': 'business'},
            {'name': 'Kimbal Musk', 'wikipedia': 'Kimbal Musk', 'category': 'business'},
            {'name': 'Glenn Dubin', 'wikipedia': 'Glenn Dubin', 'category': 'business'},
            {'name': 'Leon Black', 'wikipedia': 'Leon Black', 'category': 'business'},
            {'name': 'Carl Icahn', 'wikipedia': 'Carl Icahn', 'category': 'business'},
            {'name': 'Tom Barrack', 'wikipedia': 'Tom Barrack', 'category': 'business'},
            
            # Celebrities & Media
            {'name': 'Mick Jagger', 'wikipedia': 'Mick Jagger', 'category': 'celebrities'},
            {'name': 'Kevin Spacey', 'wikipedia': 'Kevin Spacey', 'category': 'celebrities'},
            {'name': 'Woody Allen', 'wikipedia': 'Woody Allen', 'category': 'celebrities'},
            {'name': 'Chris Tucker', 'wikipedia': 'Chris Tucker', 'category': 'celebrities'},
            {'name': 'Michael Wolff', 'wikipedia': 'Michael Wolff', 'category': 'celebrities'},
            
            # Academics & Scientists
            {'name': 'Stephen Hawking', 'wikipedia': 'Stephen Hawking', 'category': 'academics'},
            {'name': 'Steven Pinker', 'wikipedia': 'Steven Pinker', 'category': 'academics'},
            {'name': 'George Church', 'wikipedia': 'George Church', 'category': 'academics'},
            {'name': 'Marvin Minsky', 'wikipedia': 'Marvin Minsky', 'category': 'academics'},
            
            # Enablers & Associates
            {'name': 'Jean-Luc Brunel', 'wikipedia': 'Jean-Luc Brunel', 'category': 'enablers'},
            {'name': 'Sarah Kellen', 'wikipedia': 'Sarah Kellen', 'category': 'enablers'},
            {'name': 'Alexander Acosta', 'wikipedia': 'Alexander Acosta', 'category': 'enablers'},
            
            # Victims & Survivors
            {'name': 'Virginia Giuffre', 'wikipedia': 'Virginia Giuffre', 'category': 'victims'},
        ]
        
        # Create images directory structure
        self.setup_directories()
        
    def setup_directories(self):
        """Create organized directory structure for photos"""
        categories = ['core', 'politicians', 'royalty', 'international', 'business', 'celebrities', 
                     'media', 'academics', 'russian', 'enablers', 'intelligence', 'legal', 'victims']
        
        for category in categories:
            os.makedirs(f'images/people/{category}', exist_ok=True)
        
        logger.info(f"📁 Directory structure created for {len(categories)} categories")
    
    def get_wikipedia_image(self, person_name, wikipedia_title):
        """Fetch high-quality image from Wikipedia"""
        try:
            # Initialize Wikipedia API
            wiki_wiki = wikipediaapi.Wikipedia('en', headers={'User-Agent': 'Trump-Epstein Timeline (contact@example.com)'})
            # Get Wikipedia page
            page = wiki_wiki.page(wikipedia_title)
            
            if hasattr(page, 'images') and page.images:
                # Return first available image
                return page.images[0]
            
        except wikipedia.exceptions.PageError:
            logger.warning(f"❌ Wikipedia page not found: {wikipedia_title}")
        except wikipedia.exceptions.DisambiguationError as e:
            # Try the first disambiguation option
            try:
                page = wikipedia.page(e.options[0])
                if hasattr(page, 'images') and page.images:
                    return page.images[0]
            except:
                pass
        except Exception as e:
            logger.error(f"❌ Wikipedia error for {person_name}: {e}")
        
        return None
    
    def download_image(self, url, filename):
        """Download and save image with error handling"""
        try:
            # Check if already downloaded
            if filename in self.photo_cache:
                logger.info(f"⚡ Cached: {filename}")
                return True
            
            response = self.session.get(url, timeout=30, stream=True)
            response.raise_for_status()
            
            # Verify it's an image
            content_type = response.headers.get('content-type', '')
            if not content_type.startswith('image/'):
                logger.warning(f"❌ Not an image: {url}")
                return False
            
            # Save image
            with open(filename, 'wb') as f:
                for chunk in response.iter_content(chunk_size=8192):
                    f.write(chunk)
            
            # Verify image integrity
            try:
                with Image.open(filename) as img:
                    img.verify()  # Verify it's a valid image
                    logger.info(f"✅ Downloaded: {os.path.basename(filename)}")
                    self.photo_cache.add(filename)
                    return True
            except Exception as e:
                logger.error(f"❌ Invalid image file: {filename} - {e}")
                if os.path.exists(filename):
                    os.remove(filename)
                return False
                
        except Exception as e:
            logger.error(f"❌ Download failed {url}: {e}")
            return False
    
    def generate_filename(self, person_name, category):
        """Generate clean filename for person photo"""
        # Clean name for filename
        clean_name = person_name.lower().replace(' ', '-').replace(',', '').replace('.', '')
        clean_name = ''.join(c for c in clean_name if c.isalnum() or c in '-_')
        
        return f'images/people/{category}/{clean_name}.jpg'
    
    def download_all_photos(self):
        """Download photos for all associates"""
        logger.info(f"🎯 Starting photo download for {len(self.associates)} associates")
        
        success_count = 0
        failure_count = 0
        
        for i, person in enumerate(self.associates, 1):
            logger.info(f"[{i}/{len(self.associates)}] Processing: {person['name']}")
            
            filename = self.generate_filename(person['name'], person['category'])
            
            # Skip if file already exists
            if os.path.exists(filename):
                logger.info(f"⚡ Already exists: {os.path.basename(filename)}")
                success_count += 1
                continue
            
            # Get Wikipedia image
            img_url = self.get_wikipedia_image(person['name'], person['wikipedia'])
            
            if img_url:
                if self.download_image(img_url, filename):
                    success_count += 1
                else:
                    failure_count += 1
            else:
                logger.warning(f"❌ No image found for: {person['name']}")
                failure_count += 1
            
            # Rate limiting to be respectful
            time.sleep(1)
        
        logger.info(f"🎉 Photo download complete!")
        logger.info(f"✅ Success: {success_count}")
        logger.info(f"❌ Failures: {failure_count}")
        
        return success_count, failure_count

def main():
    print("📸 Trump-Epstein Investigation - Photo Download System")
    print("=" * 60)
    
    downloader = PhotoDownloader()
    
    # Download all photos
    success, failures = downloader.download_all_photos()
    
    print(f"\n📊 Final Results:")
    print(f"   Photos Downloaded: {success}")
    print(f"   Failed Downloads: {failures}")
    print(f"\n🎯 Photos organized in: images/people/[category]/")
    
    return success, failures

if __name__ == "__main__":
    main()