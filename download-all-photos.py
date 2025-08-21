#!/usr/bin/env python3
"""
Trump-Epstein Timeline - Comprehensive Photo Download System
Downloads Wikipedia and other source photos for all network associates
"""

import requests
import json
import os
import time
import hashlib
from urllib.parse import urlparse, quote_plus
import wikipedia
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
            {'name': 'Reid Hoffman', 'wikipedia': 'Reid Hoffman', 'category': 'business'},
            {'name': 'Peter Thiel', 'wikipedia': 'Peter Thiel', 'category': 'business'},
            {'name': 'Larry Page', 'wikipedia': 'Larry Page', 'category': 'business'},
            {'name': 'Sergey Brin', 'wikipedia': 'Sergey Brin', 'category': 'business'},
            {'name': 'Mark Zuckerberg', 'wikipedia': 'Mark Zuckerberg', 'category': 'business'},
            {'name': 'Jimmy Cayne', 'wikipedia': 'Jimmy Cayne', 'category': 'business'},
            {'name': 'Bruce Wasserstein', 'wikipedia': 'Bruce Wasserstein', 'category': 'business'},
            {'name': 'Nelson Peltz', 'wikipedia': 'Nelson Peltz', 'category': 'business'},
            {'name': 'Henry Kravis', 'wikipedia': 'Henry Kravis', 'category': 'business'},
            {'name': 'John Paulson', 'wikipedia': 'John Paulson', 'category': 'business'},
            
            # Celebrities & Media
            {'name': 'Mick Jagger', 'wikipedia': 'Mick Jagger', 'category': 'celebrities'},
            {'name': 'Kevin Spacey', 'wikipedia': 'Kevin Spacey', 'category': 'celebrities'},
            {'name': 'Woody Allen', 'wikipedia': 'Woody Allen', 'category': 'celebrities'},
            {'name': 'Chris Tucker', 'wikipedia': 'Chris Tucker', 'category': 'celebrities'},
            {'name': 'Michael Wolff', 'wikipedia': 'Michael Wolff', 'category': 'celebrities'},
            {'name': 'Mortimer Zuckerman', 'wikipedia': 'Mortimer Zuckerman', 'category': 'media'},
            {'name': 'Donny Deutsch', 'wikipedia': 'Donny Deutsch', 'category': 'media'},
            {'name': 'Mel Gibson', 'wikipedia': 'Mel Gibson', 'category': 'celebrities'},
            {'name': 'George Lucas', 'wikipedia': 'George Lucas', 'category': 'celebrities'},
            {'name': 'Cameron Diaz', 'wikipedia': 'Cameron Diaz', 'category': 'celebrities'},
            {'name': 'Itzhak Perlman', 'wikipedia': 'Itzhak Perlman', 'category': 'celebrities'},
            
            # Academics & Scientists
            {'name': 'Stephen Hawking', 'wikipedia': 'Stephen Hawking', 'category': 'academics'},
            {'name': 'Steven Pinker', 'wikipedia': 'Steven Pinker', 'category': 'academics'},
            {'name': 'George Church', 'wikipedia': 'George Church', 'category': 'academics'},
            {'name': 'Marvin Minsky', 'wikipedia': 'Marvin Minsky', 'category': 'academics'},
            {'name': 'Lawrence Summers', 'wikipedia': 'Lawrence Summers', 'category': 'academics'},
            {'name': 'Leon Botstein', 'wikipedia': 'Leon Botstein', 'category': 'academics'},
            {'name': 'Noam Chomsky', 'wikipedia': 'Noam Chomsky', 'category': 'academics'},
            {'name': 'Joichi Ito', 'wikipedia': 'Joichi Ito', 'category': 'academics'},
            {'name': 'Martin Nowak', 'wikipedia': 'Martin Nowak', 'category': 'academics'},
            
            # Russian Connections
            {'name': 'Oleg Deripaska', 'wikipedia': 'Oleg Deripaska', 'category': 'russian'},
            {'name': 'Roman Abramovich', 'wikipedia': 'Roman Abramovich', 'category': 'russian'},
            {'name': 'Mikhail Khodorkovsky', 'wikipedia': 'Mikhail Khodorkovsky', 'category': 'russian'},
            
            # Political Figures
            {'name': 'Bill Richardson', 'wikipedia': 'Bill Richardson', 'category': 'politicians'},
            {'name': 'George Mitchell', 'wikipedia': 'George J. Mitchell', 'category': 'politicians'},
            {'name': 'John Glenn', 'wikipedia': 'John Glenn', 'category': 'politicians'},
            {'name': 'Al Gore', 'wikipedia': 'Al Gore', 'category': 'politicians'},
            
            # Enablers & Associates
            {'name': 'Jean-Luc Brunel', 'wikipedia': 'Jean-Luc Brunel', 'category': 'enablers'},
            {'name': 'Sarah Kellen', 'wikipedia': 'Sarah Kellen', 'category': 'enablers'},
            {'name': 'Nadia Marcinkova', 'wikipedia': 'Nadia Marcinkova', 'category': 'enablers'},
            {'name': 'Adriana Ross', 'wikipedia': 'Adriana Ross', 'category': 'enablers'},
            {'name': 'Alexander Acosta', 'wikipedia': 'Alexander Acosta', 'category': 'enablers'},
            
            # Intelligence & Security
            {'name': 'William Burns', 'wikipedia': 'William Joseph Burns', 'category': 'intelligence'},
            {'name': 'Adnan Khashoggi', 'wikipedia': 'Adnan Khashoggi', 'category': 'intelligence'},
            {'name': 'Steven Hoffenberg', 'wikipedia': 'Steven Hoffenberg', 'category': 'intelligence'},
            
            # Legal Connections
            {'name': 'Kenneth Starr', 'wikipedia': 'Kenneth Starr', 'category': 'legal'},
            
            # Victims & Survivors
            {'name': 'Virginia Giuffre', 'wikipedia': 'Virginia Giuffre', 'category': 'victims'},
            {'name': 'Annie Farmer', 'wikipedia': 'Annie Farmer', 'category': 'victims'},
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
            # Get Wikipedia page
            page = wikipedia.page(wikipedia_title)
            
            if hasattr(page, 'images') and page.images:
                # Look for the main infobox image (usually first and best quality)
                for img_url in page.images[:3]:  # Check first 3 images
                    if self.is_good_portrait_image(img_url):
                        return img_url
                
                # Fallback to first image if no portrait found
                return page.images[0] if page.images else None
            
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
    
    def is_good_portrait_image(self, img_url):
        """Check if image is likely a good portrait photo"""
        img_url_lower = img_url.lower()
        
        # Good indicators
        good_indicators = ['portrait', 'headshot', 'official', 'photo', '.jpg', '.jpeg']
        # Bad indicators  
        bad_indicators = ['logo', 'signature', 'map', 'chart', 'diagram', 'commons-logo', 
                         'flag', 'coat', 'seal', 'symbol', 'icon']
        
        good_score = sum(1 for indicator in good_indicators if indicator in img_url_lower)
        bad_score = sum(1 for indicator in bad_indicators if indicator in img_url_lower)
        
        return good_score > bad_score
    
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
                    logger.info(f"✅ Downloaded: {os.path.basename(filename)} ({img.size[0]}x{img.size[1]})\")\n                    self.photo_cache.add(filename)\n                    return True\n            except Exception as e:\n                logger.error(f\"❌ Invalid image file: {filename} - {e}\")\n                os.remove(filename)\n                return False\n                \n        except Exception as e:\n            logger.error(f\"❌ Download failed {url}: {e}\")\n            return False\n    \n    def generate_filename(self, person_name, category):\n        \"\"\"Generate clean filename for person photo\"\"\"\n        # Clean name for filename\n        clean_name = person_name.lower().replace(' ', '-').replace(',', '').replace('.', '')\n        clean_name = ''.join(c for c in clean_name if c.isalnum() or c in '-_')\n        \n        return f'images/people/{category}/{clean_name}.jpg'\n    \n    def download_all_photos(self):\n        \"\"\"Download photos for all associates\"\"\"\n        logger.info(f\"🎯 Starting photo download for {len(self.associates)} associates\")\n        \n        success_count = 0\n        failure_count = 0\n        \n        for i, person in enumerate(self.associates, 1):\n            logger.info(f\"\\n[{i}/{len(self.associates)}] Processing: {person['name']}\")\n            \n            filename = self.generate_filename(person['name'], person['category'])\n            \n            # Skip if file already exists\n            if os.path.exists(filename):\n                logger.info(f\"⚡ Already exists: {os.path.basename(filename)}\")\n                success_count += 1\n                continue\n            \n            # Get Wikipedia image\n            img_url = self.get_wikipedia_image(person['name'], person['wikipedia'])\n            \n            if img_url:\n                if self.download_image(img_url, filename):\n                    success_count += 1\n                else:\n                    failure_count += 1\n            else:\n                logger.warning(f\"❌ No image found for: {person['name']}\")\n                failure_count += 1\n            \n            # Rate limiting to be respectful\n            time.sleep(1)\n        \n        logger.info(f\"\\n🎉 Photo download complete!\")\n        logger.info(f\"✅ Success: {success_count}\")\n        logger.info(f\"❌ Failures: {failure_count}\")\n        logger.info(f\"📊 Success Rate: {(success_count/(success_count+failure_count)*100):.1f}%\")\n        \n        return success_count, failure_count\n    \n    def create_photo_index(self):\n        \"\"\"Create JSON index of all downloaded photos\"\"\"\n        photo_index = {}\n        \n        for person in self.associates:\n            filename = self.generate_filename(person['name'], person['category'])\n            \n            if os.path.exists(filename):\n                # Get image dimensions\n                try:\n                    with Image.open(filename) as img:\n                        width, height = img.size\n                    \n                    photo_index[person['name']] = {\n                        'filename': filename,\n                        'category': person['category'],\n                        'wikipedia': person['wikipedia'],\n                        'width': width,\n                        'height': height,\n                        'file_size': os.path.getsize(filename)\n                    }\n                except Exception as e:\n                    logger.error(f\"Error processing {filename}: {e}\")\n        \n        # Save index\n        with open('images/photo-index.json', 'w') as f:\n            json.dump(photo_index, f, indent=2)\n        \n        logger.info(f\"📋 Photo index created: {len(photo_index)} photos indexed\")\n        return photo_index\n\ndef main():\n    print(\"📸 Trump-Epstein Investigation - Photo Download System\")\n    print(\"=\" * 60)\n    \n    downloader = PhotoDownloader()\n    \n    # Download all photos\n    success, failures = downloader.download_all_photos()\n    \n    # Create photo index\n    photo_index = downloader.create_photo_index()\n    \n    print(f\"\\n📊 Final Results:\")\n    print(f\"   Photos Downloaded: {success}\")\n    print(f\"   Failed Downloads: {failures}\")\n    print(f\"   Photos Indexed: {len(photo_index)}\")\n    print(f\"   Categories: {len(set(p['category'] for p in photo_index.values()))}\")\n    \n    print(f\"\\n🎯 Photos organized in: images/people/[category]/\")\n    print(f\"📋 Photo index saved: images/photo-index.json\")\n    \n    return photo_index\n\nif __name__ == \"__main__\":\n    main()\n"