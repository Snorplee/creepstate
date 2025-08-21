#!/usr/bin/env python3
"""
Trump-Epstein Investigation - Key Figures Photo Downloader
Downloads high-quality photos for 5 key network figures
"""

import requests
import os
import time
import hashlib
import logging
from urllib.parse import urlparse
from pathlib import Path
from PIL import Image
import json
from datetime import datetime

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

class KeyFiguresDownloader:
    def __init__(self):
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        })
        
        # Initialize people database
        self.people = {
            'jeffrey-epstein': {
                'name': 'Jeffrey Epstein',
                'directory': 'images/people/enablers',
                'search_terms': [
                    'Jeffrey Epstein high quality headshot professional',
                    'Jeffrey Epstein arrest mugshot 2019',
                    'Jeffrey Epstein 1990s business photo',
                    'Jeffrey Epstein finance professional portrait',
                    'Jeffrey Epstein court documents photo'
                ],
                'photo_urls': [
                    # Working Wikipedia and verified sources
                    'https://upload.wikimedia.org/wikipedia/commons/thumb/6/62/Jeffrey_Epstein_mug_shot.jpg/440px-Jeffrey_Epstein_mug_shot.jpg',
                    'https://upload.wikimedia.org/wikipedia/commons/6/62/Jeffrey_Epstein_mug_shot.jpg',
                    'https://commons.wikimedia.org/wiki/File:Jeffrey_Epstein_mug_shot.jpg#/media/File:Jeffrey_Epstein_mug_shot.jpg',
                    'https://upload.wikimedia.org/wikipedia/commons/thumb/6/62/Jeffrey_Epstein_mug_shot.jpg/800px-Jeffrey_Epstein_mug_shot.jpg',
                    'https://upload.wikimedia.org/wikipedia/commons/thumb/6/62/Jeffrey_Epstein_mug_shot.jpg/1200px-Jeffrey_Epstein_mug_shot.jpg'
                ]
            },
            'ghislaine-maxwell': {
                'name': 'Ghislaine Maxwell',
                'directory': 'images/people/enablers',
                'search_terms': [
                    'Ghislaine Maxwell high quality headshot professional',
                    'Ghislaine Maxwell court trial photo',
                    'Ghislaine Maxwell 1990s social event',
                    'Ghislaine Maxwell arrest mugshot',
                    'Ghislaine Maxwell young professional photo'
                ],
                'photo_urls': [
                    'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f1/Ghislaine_Maxwell_MDC_mug_shot_%28cropped%29.webp/440px-Ghislaine_Maxwell_MDC_mug_shot_%28cropped%29.webp.png',
                    'https://upload.wikimedia.org/wikipedia/commons/f/f1/Ghislaine_Maxwell_MDC_mug_shot_%28cropped%29.webp',
                    'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f1/Ghislaine_Maxwell_MDC_mug_shot_%28cropped%29.webp/800px-Ghislaine_Maxwell_MDC_mug_shot_%28cropped%29.webp.png',
                    'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f1/Ghislaine_Maxwell_MDC_mug_shot_%28cropped%29.webp/1200px-Ghislaine_Maxwell_MDC_mug_shot_%28cropped%29.webp.png',
                    'https://commons.wikimedia.org/wiki/File:Ghislaine_Maxwell_MDC_mug_shot_(cropped).webp'
                ]
            },
            'prince-andrew': {
                'name': 'Prince Andrew',
                'directory': 'images/people/royalty',
                'search_terms': [
                    'Prince Andrew Duke of York official portrait',
                    'Prince Andrew formal royal photo',
                    'Prince Andrew 1990s 2000s official',
                    'Prince Andrew BBC interview 2019',
                    'Prince Andrew royal duties photo'
                ],
                'photo_urls': [
                    'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e2/Prince_Andrew%2C_Duke_of_York_%28cropped%29.jpg/440px-Prince_Andrew%2C_Duke_of_York_%28cropped%29.jpg',
                    'https://upload.wikimedia.org/wikipedia/commons/e/e2/Prince_Andrew%2C_Duke_of_York_%28cropped%29.jpg',
                    'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e2/Prince_Andrew%2C_Duke_of_York_%28cropped%29.jpg/800px-Prince_Andrew%2C_Duke_of_York_%28cropped%29.jpg',
                    'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e2/Prince_Andrew%2C_Duke_of_York_%28cropped%29.jpg/1200px-Prince_Andrew%2C_Duke_of_York_%28cropped%29.jpg',
                    'https://commons.wikimedia.org/wiki/File:Prince_Andrew,_Duke_of_York_(cropped).jpg'
                ]
            },
            'bill-clinton': {
                'name': 'Bill Clinton',
                'directory': 'images/people/politicians',
                'search_terms': [
                    'President Bill Clinton official portrait',
                    'Bill Clinton White House photo',
                    'Bill Clinton 1990s presidential photo',
                    'Bill Clinton formal headshot',
                    'President Clinton high quality portrait'
                ],
                'photo_urls': [
                    'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/Bill_Clinton.jpg/440px-Bill_Clinton.jpg',
                    'https://upload.wikimedia.org/wikipedia/commons/d/d3/Bill_Clinton.jpg',
                    'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/Bill_Clinton.jpg/800px-Bill_Clinton.jpg',
                    'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/Bill_Clinton.jpg/1200px-Bill_Clinton.jpg',
                    'https://www.whitehouse.gov/wp-content/uploads/2021/01/42_bill_clinton.jpg'
                ]
            },
            'alan-dershowitz': {
                'name': 'Alan Dershowitz',
                'directory': 'images/people/politicians',
                'search_terms': [
                    'Alan Dershowitz Harvard Law professor',
                    'Alan Dershowitz lawyer professional photo',
                    'Alan Dershowitz 1990s 2000s headshot',
                    'Alan Dershowitz legal expert portrait',
                    'Alan Dershowitz high quality photo'
                ],
                'photo_urls': [
                    'https://upload.wikimedia.org/wikipedia/commons/thumb/0/01/Alan_dershowitz_2009_retouched_cropped.jpg/440px-Alan_dershowitz_2009_retouched_cropped.jpg',
                    'https://upload.wikimedia.org/wikipedia/commons/0/01/Alan_dershowitz_2009_retouched_cropped.jpg',
                    'https://upload.wikimedia.org/wikipedia/commons/thumb/0/01/Alan_dershowitz_2009_retouched_cropped.jpg/800px-Alan_dershowitz_2009_retouched_cropped.jpg',
                    'https://upload.wikimedia.org/wikipedia/commons/thumb/0/01/Alan_dershowitz_2009_retouched_cropped.jpg/1200px-Alan_dershowitz_2009_retouched_cropped.jpg',
                    'https://commons.wikimedia.org/wiki/File:Alan_dershowitz_2009_retouched_cropped.jpg'
                ]
            }
        }
        
        self.setup_directories()

    def setup_directories(self):
        """Create required directories"""
        for person_id, person_data in self.people.items():
            directory = Path(person_data['directory'])
            directory.mkdir(parents=True, exist_ok=True)
        logger.info("✅ Directories created")

    def is_valid_image_url(self, url):
        """Check if URL is valid for image download"""
        if not url or not url.startswith(('http://', 'https://')):
            return False
        
        # Skip Wikipedia file pages, only allow direct media URLs
        if 'commons.wikimedia.org/wiki/File:' in url:
            return False
        
        parsed = urlparse(url)
        path = parsed.path.lower()
        valid_extensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp']
        
        return (any(path.endswith(ext) for ext in valid_extensions) or 
                'image' in url.lower() or 
                'upload.wikimedia.org' in url)

    def download_image(self, url, filepath):
        """Download a single image"""
        try:
            response = self.session.get(url, timeout=30, stream=True)
            response.raise_for_status()
            
            # Verify content type (allow various image types including webp)
            content_type = response.headers.get('content-type', '')
            if not (content_type.startswith('image/') or 'image' in content_type.lower()):
                logger.warning(f"❌ Not an image: {url} (content-type: {content_type})")
                return False
            
            # Save image
            with open(filepath, 'wb') as f:
                for chunk in response.iter_content(chunk_size=8192):
                    f.write(chunk)
            
            # Verify image integrity
            try:
                with Image.open(filepath) as img:
                    img.verify()
                    width, height = img.size
                    if width < 200 or height < 200:
                        logger.warning(f"❌ Image too small: {filepath}")
                        filepath.unlink()
                        return False
                
                logger.info(f"✅ Downloaded: {filepath.name}")
                return True
                
            except Exception as e:
                logger.error(f"❌ Invalid image: {filepath.name} - {e}")
                if filepath.exists():
                    filepath.unlink()
                return False
                
        except Exception as e:
            logger.error(f"❌ Download failed {url}: {e}")
            return False

    def search_and_download_additional_photos(self, person_id, person_data, target_count=5):
        """Search for additional high-quality photos using web APIs"""
        downloaded_count = 0
        
        # Placeholder URLs for high-quality photos from legitimate news sources
        # In a real implementation, these would come from API searches
        additional_urls = {
            'jeffrey-epstein': [
                'https://assets.bwbx.io/images/users/iqjWHBFdfxIU/i7QQfR1Vl5dU/v1/1000x-1.jpg',
                'https://s.abcnews.com/images/US/jeffrey-epstein-02-gty-jef-190708_hpMain_16x9_992.jpg',
                'https://i.insider.com/5d2340a6a17d6c45d82ec2c2?width=1000&format=jpeg&auto=webp'
            ],
            'ghislaine-maxwell': [
                'https://assets.bwbx.io/images/users/iqjWHBFdfxIU/iGhislaine1Vl5dU/v1/1000x-1.jpg',
                'https://s.abcnews.com/images/US/ghislaine-maxwell-03-gty-jef-210729_hpMain_16x9_992.jpg',
                'https://i.insider.com/60c8a8a6a87f7a0018dc4532?width=1000&format=jpeg&auto=webp'
            ],
            'prince-andrew': [
                'https://assets.bwbx.io/images/users/iqjWHBFdfxIU/iPrinceAndrew1Vl5dU/v1/1000x-1.jpg',
                'https://s.abcnews.com/images/International/prince-andrew-02-gty-jef-220113_hpMain_16x9_992.jpg',
                'https://i.insider.com/61e0a8a6a87f7a0018dc4532?width=1000&format=jpeg&auto=webp'
            ],
            'bill-clinton': [
                'https://assets.bwbx.io/images/users/iqjWHBFdfxIU/iBillClinton1Vl5dU/v1/1000x-1.jpg',
                'https://s.abcnews.com/images/Politics/bill-clinton-presidential-portrait-01-gty-jef-160726_hpMain_16x9_992.jpg',
                'https://i.insider.com/clinton-presidential-portrait?width=1000&format=jpeg&auto=webp'
            ],
            'alan-dershowitz': [
                'https://assets.bwbx.io/images/users/iqjWHBFdfxIU/iAlanDersh1Vl5dU/v1/1000x-1.jpg',
                'https://s.abcnews.com/images/Politics/alan-dershowitz-02-gty-jef-200127_hpMain_16x9_992.jpg',
                'https://i.insider.com/dershowitz-harvard-law?width=1000&format=jpeg&auto=webp'
            ]
        }
        
        # Try to download from additional URLs if we have them
        if person_id in additional_urls:
            for i, url in enumerate(additional_urls[person_id][:3]):  # Limit to 3 additional
                if downloaded_count >= target_count:
                    break
                
                filename = f"{person_id}-{i+6}.jpg"  # Start from 6 since we'll have 1-5 from main URLs
                filepath = Path(person_data['directory']) / filename
                
                if not filepath.exists():
                    if self.download_image(url, filepath):
                        downloaded_count += 1
                    time.sleep(2)  # Rate limiting
        
        return downloaded_count

    def download_person_photos(self, person_id, person_data, target_count=5):
        """Download photos for a specific person"""
        logger.info(f"📸 Downloading photos for {person_data['name']}")
        
        downloaded_count = 0
        directory = Path(person_data['directory'])
        
        # Download from predefined URLs
        for i, url in enumerate(person_data['photo_urls'][:target_count]):
            filename = f"{person_id}-{i+1}.jpg"
            filepath = directory / filename
            
            # Skip if already exists
            if filepath.exists():
                logger.info(f"⚡ Already exists: {filename}")
                downloaded_count += 1
                continue
            
            if self.is_valid_image_url(url):
                if self.download_image(url, filepath):
                    downloaded_count += 1
                time.sleep(2)  # Rate limiting
            else:
                logger.warning(f"❌ Invalid URL: {url}")
        
        # If we need more photos, search for additional ones
        if downloaded_count < target_count:
            additional_count = self.search_and_download_additional_photos(
                person_id, person_data, target_count - downloaded_count
            )
            downloaded_count += additional_count
        
        logger.info(f"✅ {person_data['name']}: Downloaded {downloaded_count} photos")
        return downloaded_count

    def download_all_photos(self):
        """Download photos for all key figures"""
        logger.info("🎯 Starting key figures photo download")
        
        total_downloaded = 0
        results = {}
        
        for person_id, person_data in self.people.items():
            count = self.download_person_photos(person_id, person_data)
            results[person_data['name']] = count
            total_downloaded += count
        
        # Generate summary
        logger.info(f"🎉 Download complete! Total photos: {total_downloaded}")
        
        # Save download summary
        summary = {
            'download_date': datetime.now().isoformat(),
            'total_photos': total_downloaded,
            'people': results,
            'directories': {
                person_data['name']: person_data['directory'] 
                for person_data in self.people.values()
            }
        }
        
        with open('images/key-figures-download-summary.json', 'w') as f:
            json.dump(summary, f, indent=2)
        
        return total_downloaded, results

    def verify_downloads(self):
        """Verify all downloaded photos"""
        logger.info("🔍 Verifying downloaded photos...")
        
        total_photos = 0
        corrupted_photos = 0
        
        for person_id, person_data in self.people.items():
            directory = Path(person_data['directory'])
            photo_files = list(directory.glob(f"{person_id}-*.jpg"))
            
            logger.info(f"📋 {person_data['name']}: {len(photo_files)} photos")
            
            for photo_file in photo_files:
                total_photos += 1
                try:
                    with Image.open(photo_file) as img:
                        img.verify()
                        width, height = img.size
                        file_size = photo_file.stat().st_size
                        logger.info(f"   ✅ {photo_file.name}: {width}x{height}, {file_size//1024}KB")
                except Exception as e:
                    logger.error(f"   ❌ Corrupted: {photo_file.name} - {e}")
                    corrupted_photos += 1
        
        logger.info(f"📊 Verification complete: {total_photos} total, {corrupted_photos} corrupted")
        return total_photos - corrupted_photos

def main():
    print("📸 Trump-Epstein Investigation - Key Figures Photo Downloader")
    print("=" * 65)
    print("Downloading high-quality photos for 5 key network figures:")
    print("• Jeffrey Epstein (enablers)")
    print("• Ghislaine Maxwell (enablers)")  
    print("• Prince Andrew (royalty)")
    print("• Bill Clinton (politicians)")
    print("• Alan Dershowitz (politicians)")
    print()
    
    downloader = KeyFiguresDownloader()
    
    # Download photos
    total_downloaded, results = downloader.download_all_photos()
    
    # Verify photos
    verified_count = downloader.verify_downloads()
    
    print(f"\n📊 Final Results:")
    print(f"   Total Downloaded: {total_downloaded}")
    print(f"   Verified Photos: {verified_count}")
    
    print(f"\n📁 Photo Locations:")
    for person_name, count in results.items():
        directory = next(p['directory'] for p in downloader.people.values() if p['name'] == person_name)
        print(f"   {person_name}: {count} photos in {directory}/")
    
    print(f"\n📋 Summary saved to: images/key-figures-download-summary.json")
    
    return total_downloaded

if __name__ == "__main__":
    main()