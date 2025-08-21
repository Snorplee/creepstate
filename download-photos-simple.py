#!/usr/bin/env python3
"""
Simple Photo Download for Creepstate Investigation Platform
Downloads photos from direct URLs without Wikipedia API dependency
"""

import requests
import os
import time

def create_directories():
    """Create directory structure for photos"""
    categories = ['core', 'politicians', 'business', 'celebrities', 'academics', 'enablers', 'victims']
    
    for category in categories:
        os.makedirs(f'images/people/{category}', exist_ok=True)
    
    print(f"📁 Created directories for {len(categories)} categories")

def download_image(url, filename):
    """Download image from URL"""
    try:
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
        
        response = requests.get(url, headers=headers, timeout=30, stream=True)
        response.raise_for_status()
        
        # Save image
        os.makedirs(os.path.dirname(filename), exist_ok=True)
        with open(filename, 'wb') as f:
            for chunk in response.iter_content(chunk_size=8192):
                f.write(chunk)
        
        print(f"✅ Downloaded: {os.path.basename(filename)}")
        return True
        
    except Exception as e:
        print(f"❌ Failed {os.path.basename(filename)}: {e}")
        return False

def main():
    print("📸 Creepstate Investigation - Simple Photo Download")
    print("=" * 60)
    
    # Create directories
    create_directories()
    
    # Common photo URLs (these would need to be populated with actual URLs)
    photo_urls = {
        # Core figures
        'images/people/core/jeffrey-epstein.jpg': 'https://upload.wikimedia.org/wikipedia/commons/8/85/Jeffrey_Epstein_mug_shot.jpg',
        'images/people/core/ghislaine-maxwell.jpg': 'https://upload.wikimedia.org/wikipedia/commons/f/f3/Ghislaine_Maxwell_%28cropped%29.jpg',
        
        # Politicians  
        'images/people/politicians/donald-trump.jpg': 'https://upload.wikimedia.org/wikipedia/commons/5/56/Donald_Trump_official_portrait.jpg',
        'images/people/politicians/bill-clinton.jpg': 'https://upload.wikimedia.org/wikipedia/commons/d/d3/Bill_Clinton.jpg',
        'images/people/politicians/hillary-clinton.jpg': 'https://upload.wikimedia.org/wikipedia/commons/2/27/Hillary_Clinton_official_Secretary_of_State_portrait_crop.jpg',
        
        # Business leaders
        'images/people/business/bill-gates.jpg': 'https://upload.wikimedia.org/wikipedia/commons/a/a0/Bill_Gates_2018.jpg',
        'images/people/business/elon-musk.jpg': 'https://upload.wikimedia.org/wikipedia/commons/3/34/Elon_Musk_Royal_Society_%28crop2%29.jpg',
        'images/people/business/les-wexner.jpg': 'https://upload.wikimedia.org/wikipedia/commons/f/f4/Leslie_Wexner_2016.jpg',
        
        # Royalty
        'images/people/politicians/prince-andrew.jpg': 'https://upload.wikimedia.org/wikipedia/commons/5/52/Prince_Andrew%2C_Duke_of_York_2019.jpg',
        
        # Celebrities
        'images/people/celebrities/kevin-spacey.jpg': 'https://upload.wikimedia.org/wikipedia/commons/5/57/Kevin_Spacey_2013.jpg',
        'images/people/celebrities/mick-jagger.jpg': 'https://upload.wikimedia.org/wikipedia/commons/e/ed/Mick_Jagger_Deauville_2014.jpg',
        
        # Academics
        'images/people/academics/stephen-hawking.jpg': 'https://upload.wikimedia.org/wikipedia/commons/e/eb/Stephen_Hawking.StarChild.jpg',
        
        # Victims
        'images/people/victims/virginia-giuffre.jpg': 'https://upload.wikimedia.org/wikipedia/commons/1/1f/Virginia_Giuffre.jpg',
    }
    
    success_count = 0
    failure_count = 0
    
    print(f"🎯 Downloading {len(photo_urls)} photos...")
    
    for filename, url in photo_urls.items():
        # Skip if already exists
        if os.path.exists(filename):
            print(f"⚡ Already exists: {os.path.basename(filename)}")
            success_count += 1
            continue
            
        if download_image(url, filename):
            success_count += 1
        else:
            failure_count += 1
            
        time.sleep(1)  # Rate limiting
    
    print(f"\n📊 Results:")
    print(f"✅ Success: {success_count}")
    print(f"❌ Failures: {failure_count}")
    print(f"🎯 Photos saved to: images/people/[category]/")
    
    # Create a simple manifest
    manifest = {
        'total_photos': success_count,
        'categories': ['core', 'politicians', 'business', 'celebrities', 'academics', 'enablers', 'victims'],
        'timestamp': time.strftime('%Y-%m-%d %H:%M:%S')
    }
    
    with open('images/photo-manifest.json', 'w') as f:
        import json
        json.dump(manifest, f, indent=2)
    
    print(f"📋 Manifest saved: images/photo-manifest.json")

if __name__ == "__main__":
    main()