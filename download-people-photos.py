#!/usr/bin/env python3
"""
Simple photo downloader for network associates
Downloads photos using direct URLs and Wikipedia API
"""

import requests
import os
import json
from urllib.parse import urlparse

# Create directory structure
def setup_directories():
    categories = ['core', 'politicians', 'royalty', 'international', 'business', 'celebrities', 
                 'media', 'academics', 'russian', 'enablers', 'intelligence', 'legal', 'victims']
    
    for category in categories:
        os.makedirs(f'images/people/{category}', exist_ok=True)
    print(f"📁 Created directories for {len(categories)} categories")

def download_image(url, filename, person_name):
    """Download image from URL"""
    try:
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
        
        response = requests.get(url, headers=headers, timeout=10)
        response.raise_for_status()
        
        with open(filename, 'wb') as f:
            f.write(response.content)
        print(f"✅ Downloaded: {person_name} -> {filename}")
        return True
        
    except Exception as e:
        print(f"❌ Failed to download {person_name}: {e}")
        return False

def main():
    setup_directories()
    
    # Direct photo URLs for key figures
    photos = [
        # Core Network
        {'name': 'Jeffrey Epstein', 'url': 'https://upload.wikimedia.org/wikipedia/en/thumb/9/9e/Jeffrey_Epstein_mug_shot.jpg/220px-Jeffrey_Epstein_mug_shot.jpg', 'category': 'core'},
        {'name': 'Ghislaine Maxwell', 'url': 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ed/Ghislaine_Maxwell_2013.jpg/220px-Ghislaine_Maxwell_2013.jpg', 'category': 'core'},
        
        # Royalty
        {'name': 'Prince Andrew', 'url': 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2d/The_Duke_of_York_KG_2014.jpg/220px-The_Duke_of_York_KG_2014.jpg', 'category': 'royalty'},
        
        # Politicians 
        {'name': 'Alan Dershowitz', 'url': 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/74/Alan_Dershowitz_2019.jpg/220px-Alan_Dershowitz_2019.jpg', 'category': 'politicians'},
        {'name': 'Matt Gaetz', 'url': 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4a/Matt_Gaetz_official_photo_%28cropped%29.jpg/220px-Matt_Gaetz_official_photo_%28cropped%29.jpg', 'category': 'politicians'},
        
        # Business
        {'name': 'Les Wexner', 'url': 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/90/Leslie_Wexner_2011.jpg/220px-Leslie_Wexner_2011.jpg', 'category': 'business'},
        {'name': 'Leon Black', 'url': 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1f/Leon_Black_2012.jpg/220px-Leon_Black_2012.jpg', 'category': 'business'},
        
        # Celebrities
        {'name': 'Kevin Spacey', 'url': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/55/Kevin_Spacey_2013.jpg/220px-Kevin_Spacey_2013.jpg', 'category': 'celebrities'},
        {'name': 'Chris Tucker', 'url': 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/73/Chris_Tucker_2012.jpg/220px-Chris_Tucker_2012.jpg', 'category': 'celebrities'},
        
        # Academics  
        {'name': 'Marvin Minsky', 'url': 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/14/Marvin_Minsky_at_OLPCb.jpg/220px-Marvin_Minsky_at_OLPCb.jpg', 'category': 'academics'},
        {'name': 'Lawrence Krauss', 'url': 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/95/Lawrence_Krauss_2012.jpg/220px-Lawrence_Krauss_2012.jpg', 'category': 'academics'},
        
        # Media
        {'name': 'Katie Couric', 'url': 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a6/Katie_Couric_2011.jpg/220px-Katie_Couric_2011.jpg', 'category': 'media'},
        {'name': 'Charlie Rose', 'url': 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c7/Charlie_Rose_2012.jpg/220px-Charlie_Rose_2012.jpg', 'category': 'media'},
        
        # Enablers
        {'name': 'Sarah Kellen', 'url': 'https://pbs.twimg.com/media/EkFq8X_WoAEr4Ld?format=jpg&name=small', 'category': 'enablers'},
        {'name': 'Nadia Marcinkova', 'url': 'https://nypost.com/wp-content/uploads/sites/2/2019/08/nadia-marcinkova.jpg?quality=75&strip=all&w=1024', 'category': 'enablers'},
        
        # Victims
        {'name': 'Virginia Giuffre', 'url': 'https://static.independent.co.uk/2021/11/30/11/newFile-6.jpg', 'category': 'victims'},
        
        # International
        {'name': 'Ehud Barak', 'url': 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/Ehud_Barak_2016.jpg/220px-Ehud_Barak_2016.jpg', 'category': 'international'},
        
        # Intelligence
        {'name': 'Robert Maxwell', 'url': 'https://upload.wikimedia.org/wikipedia/en/thumb/1/11/Robert_Maxwell.jpg/220px-Robert_Maxwell.jpg', 'category': 'intelligence'},
    ]
    
    # Download all photos
    success_count = 0
    for photo in photos:
        # Convert name to filename
        filename = photo['name'].lower().replace(' ', '-').replace('.', '') + '.jpg'
        filepath = f"images/people/{photo['category']}/{filename}"
        
        if download_image(photo['url'], filepath, photo['name']):
            success_count += 1
    
    print(f"\n🎯 Successfully downloaded {success_count}/{len(photos)} photos")
    print("📸 Photos saved to images/people/ directories")

if __name__ == "__main__":
    main()