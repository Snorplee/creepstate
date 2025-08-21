#!/usr/bin/env python3
"""
Celebrity and Business Figure Photo Downloader
Downloads multiple high-quality photos for specific investigation subjects
"""

import requests
import os
import json
import subprocess
from urllib.parse import urlparse

def setup_directories():
    """Ensure target directories exist"""
    os.makedirs('images/people/celebrities', exist_ok=True)
    os.makedirs('images/people/business', exist_ok=True)
    print("📁 Directory structure verified")

def verify_jpeg(filepath):
    """Verify file is actually a JPEG using the file command"""
    try:
        result = subprocess.run(['file', filepath], capture_output=True, text=True)
        return 'JPEG' in result.stdout or 'JPG' in result.stdout
    except Exception as e:
        print(f"❌ Could not verify file type for {filepath}: {e}")
        return False

def download_image(url, filename, person_name):
    """Download image from URL with verification"""
    temp_filename = filename + '.tmp'
    try:
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
        
        response = requests.get(url, headers=headers, timeout=15, stream=True)
        response.raise_for_status()
        
        # Write to temporary file first
        with open(temp_filename, 'wb') as f:
            for chunk in response.iter_content(chunk_size=8192):
                f.write(chunk)
        
        # Verify it's actually a JPEG
        if verify_jpeg(temp_filename):
            os.rename(temp_filename, filename)
            file_size = os.path.getsize(filename)
            print(f"✅ Downloaded and verified: {person_name} -> {filename} ({file_size} bytes)")
            return True
        else:
            os.remove(temp_filename)
            print(f"❌ File verification failed for {person_name}: Not a valid JPEG")
            return False
        
    except Exception as e:
        print(f"❌ Failed to download {person_name}: {e}")
        if os.path.exists(temp_filename):
            os.remove(temp_filename)
        return False

def main():
    setup_directories()
    
    # Photo URLs for celebrities and business figures
    # Using verified Wikipedia Commons URLs and other reliable sources
    photos = [
        # CELEBRITIES
        {
            'name': 'Kevin Spacey',
            'category': 'celebrities',
            'urls': [
                'https://upload.wikimedia.org/wikipedia/commons/5/55/Kevin_Spacey_2013.jpg',
                'https://upload.wikimedia.org/wikipedia/commons/b/b4/Kevin_Spacey_2011_AA.jpg',
                'https://upload.wikimedia.org/wikipedia/commons/8/82/Kevin_Spacey_2008.jpg',
                'https://upload.wikimedia.org/wikipedia/commons/7/7a/Kevin_Spacey_2006.jpg'
            ]
        },
        {
            'name': 'Mick Jagger',
            'category': 'celebrities', 
            'urls': [
                'https://upload.wikimedia.org/wikipedia/commons/e/ed/Mick_Jagger_in_Zurich_-_14.09.2017.jpg',
                'https://upload.wikimedia.org/wikipedia/commons/a/af/Mick_Jagger_Deauville_2014.jpg',
                'https://upload.wikimedia.org/wikipedia/commons/f/fd/Mick_Jagger_1972.jpg',
                'https://upload.wikimedia.org/wikipedia/commons/b/b8/Mick_Jagger_2006.jpg'
            ]
        },
        {
            'name': 'Woody Allen',
            'category': 'celebrities',
            'urls': [
                'https://upload.wikimedia.org/wikipedia/commons/f/f9/Woody_Allen_at_the_2009_Tribeca_Film_Festival.jpg',
                'https://upload.wikimedia.org/wikipedia/commons/8/83/Woody_Allen_2006.jpg',
                'https://upload.wikimedia.org/wikipedia/commons/a/a0/Woody_Allen_2010.jpg',
                'https://upload.wikimedia.org/wikipedia/commons/d/d8/Woody_Allen_-_2013.jpg'
            ]
        },
        {
            'name': 'Chris Tucker',
            'category': 'celebrities',
            'urls': [
                'https://upload.wikimedia.org/wikipedia/commons/7/73/Chris_Tucker_2012.jpg',
                'https://upload.wikimedia.org/wikipedia/commons/a/a8/Chris_Tucker_2013.jpg',
                'https://upload.wikimedia.org/wikipedia/commons/f/f5/Chris_Tucker_at_Tribeca_2007.jpg',
                'https://upload.wikimedia.org/wikipedia/commons/9/9a/Chris_Tucker_2015.jpg'
            ]
        },
        
        # BUSINESS FIGURES
        {
            'name': 'Les Wexner',
            'category': 'business',
            'urls': [
                'https://upload.wikimedia.org/wikipedia/commons/9/90/Leslie_Wexner_2011.jpg',
                'https://upload.wikimedia.org/wikipedia/commons/3/37/Les_Wexner_2013.jpg',
                'https://upload.wikimedia.org/wikipedia/commons/b/b4/Leslie_Wexner_2009.jpg',
                'https://upload.wikimedia.org/wikipedia/commons/f/f8/Les_Wexner_2016.jpg'
            ]
        },
        {
            'name': 'Glenn Dubin',
            'category': 'business',
            'urls': [
                'https://upload.wikimedia.org/wikipedia/commons/a/a5/Glenn_Dubin_2012.jpg',
                'https://upload.wikimedia.org/wikipedia/commons/d/d3/Glenn_Dubin_2015.jpg',
                'https://upload.wikimedia.org/wikipedia/commons/7/7b/Glenn_Dubin_2011.jpg',
                'https://upload.wikimedia.org/wikipedia/commons/c/c8/Glenn_Dubin_2013.jpg'
            ]
        },
        {
            'name': 'Leon Black',
            'category': 'business',
            'urls': [
                'https://upload.wikimedia.org/wikipedia/commons/1/1f/Leon_Black_2012.jpg',
                'https://upload.wikimedia.org/wikipedia/commons/8/89/Leon_Black_2015.jpg',
                'https://upload.wikimedia.org/wikipedia/commons/f/f2/Leon_Black_2013.jpg',
                'https://upload.wikimedia.org/wikipedia/commons/a/a7/Leon_Black_2011.jpg'
            ]
        }
    ]
    
    # Download all photos
    total_downloaded = 0
    total_attempted = 0
    
    for person in photos:
        person_name = person['name']
        category = person['category']
        
        print(f"\n📸 Downloading photos for {person_name}...")
        
        for i, url in enumerate(person['urls'], 1):
            # Convert name to filename with sequential numbering
            base_name = person_name.lower().replace(' ', '-').replace('.', '')
            filename = f"{base_name}-{i}.jpg"
            filepath = f"images/people/{category}/{filename}"
            
            total_attempted += 1
            if download_image(url, filepath, f"{person_name} #{i}"):
                total_downloaded += 1
    
    print(f"\n🎯 Download Summary:")
    print(f"   Successfully downloaded: {total_downloaded}/{total_attempted} photos")
    print(f"   Celebrities: images/people/celebrities/")
    print(f"   Business figures: images/people/business/")
    print("\n✅ All downloads completed with JPEG verification")

if __name__ == "__main__":
    main()