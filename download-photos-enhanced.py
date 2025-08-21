#!/usr/bin/env python3
"""
Enhanced Photo Download for Creepstate Investigation Platform
Downloads photos from curated URLs without external API dependencies
"""

import requests
import os
import time
import json

def create_directories():
    """Create directory structure for photos"""
    categories = [
        'core', 'politicians', 'business', 'celebrities', 
        'academics', 'enablers', 'victims', 'royalty',
        'international', 'media', 'russian', 'intelligence', 'legal'
    ]
    
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
    print("📸 Creepstate Investigation - Enhanced Photo Download")
    print("=" * 60)
    
    # Create directories
    create_directories()
    
    # Comprehensive photo URLs with alternative sources
    photo_urls = {
        # Core figures - Using working Wikimedia URLs
        'images/people/core/jeffrey-epstein.jpg': 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/85/Jeffrey_Epstein_mug_shot.jpg/220px-Jeffrey_Epstein_mug_shot.jpg',
        'images/people/core/ghislaine-maxwell.jpg': 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1c/Ghislaine_Maxwell_2013.jpg/220px-Ghislaine_Maxwell_2013.jpg',
        
        # Politicians
        'images/people/politicians/donald-trump.jpg': 'https://upload.wikimedia.org/wikipedia/commons/5/56/Donald_Trump_official_portrait.jpg',
        'images/people/politicians/bill-clinton.jpg': 'https://upload.wikimedia.org/wikipedia/commons/d/d3/Bill_Clinton.jpg',
        'images/people/politicians/hillary-clinton.jpg': 'https://upload.wikimedia.org/wikipedia/commons/2/27/Hillary_Clinton_official_Secretary_of_State_portrait_crop.jpg',
        'images/people/politicians/prince-andrew.jpg': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/Prince_Andrew%2C_Duke_of_York_2019.jpg/220px-Prince_Andrew%2C_Duke_of_York_2019.jpg',
        'images/people/politicians/alan-dershowitz.jpg': 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6c/Alan_Dershowitz_2019.jpg/220px-Alan_Dershowitz_2019.jpg',
        'images/people/politicians/matt-gaetz.jpg': 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Matt_Gaetz_official_photo.jpg/220px-Matt_Gaetz_official_photo.jpg',
        
        # Business leaders
        'images/people/business/bill-gates.jpg': 'https://upload.wikimedia.org/wikipedia/commons/a/a0/Bill_Gates_2018.jpg',
        'images/people/business/elon-musk.jpg': 'https://upload.wikimedia.org/wikipedia/commons/3/34/Elon_Musk_Royal_Society_%28crop2%29.jpg',
        'images/people/business/les-wexner.jpg': 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8f/Les_Wexner_2016.jpg/220px-Les_Wexner_2016.jpg',
        'images/people/business/glenn-dubin.jpg': 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a1/Glenn_Dubin_2014.jpg/220px-Glenn_Dubin_2014.jpg',
        'images/people/business/leon-black.jpg': 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Leon_Black_2016.jpg/220px-Leon_Black_2016.jpg',
        'images/people/business/carl-icahn.jpg': 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/ce/Carl_Icahn_2015.jpg/220px-Carl_Icahn_2015.jpg',
        'images/people/business/tom-barrack.jpg': 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b6/Tom_Barrack_2019.jpg/220px-Tom_Barrack_2019.jpg',
        'images/people/business/kimbal-musk.jpg': 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/20/Kimbal_Musk_2015.jpg/220px-Kimbal_Musk_2015.jpg',
        
        # Celebrities
        'images/people/celebrities/kevin-spacey.jpg': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/57/Kevin_Spacey_2013.jpg/220px-Kevin_Spacey_2013.jpg',
        'images/people/celebrities/mick-jagger.jpg': 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ed/Mick_Jagger_Deauville_2014.jpg/220px-Mick_Jagger_Deauville_2014.jpg',
        'images/people/celebrities/woody-allen.jpg': 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7f/Woody_Allen_2015.jpg/220px-Woody_Allen_2015.jpg',
        'images/people/celebrities/chris-tucker.jpg': 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Chris_Tucker_2015.jpg/220px-Chris_Tucker_2015.jpg',
        
        # Academics
        'images/people/academics/stephen-hawking.jpg': 'https://upload.wikimedia.org/wikipedia/commons/e/eb/Stephen_Hawking.StarChild.jpg',
        'images/people/academics/steven-pinker.jpg': 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fe/Steven_Pinker_2011.jpg/220px-Steven_Pinker_2011.jpg',
        'images/people/academics/lawrence-summers.jpg': 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9c/Lawrence_Summers_2012.jpg/220px-Lawrence_Summers_2012.jpg',
        'images/people/academics/marvin-minsky.jpg': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/58/Marvin_Minsky_2008.jpg/220px-Marvin_Minsky_2008.jpg',
        'images/people/academics/george-church.jpg': 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/73/George_Church_2014.jpg/220px-George_Church_2014.jpg',
        
        # International
        'images/people/international/vladimir-putin.jpg': 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cb/Vladimir_Putin_2017-07-08.jpg/220px-Vladimir_Putin_2017-07-08.jpg',
        'images/people/international/mohammed-bin-salman.jpg': 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7a/Mohammed_bin_Salman_2018.jpg/220px-Mohammed_bin_Salman_2018.jpg',
        'images/people/international/ehud-barak.jpg': 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e7/Ehud_Barak_2015.jpg/220px-Ehud_Barak_2015.jpg',
        
        # Russian connections
        'images/people/russian/oleg-deripaska.jpg': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5f/Oleg_Deripaska_2009.jpg/220px-Oleg_Deripaska_2009.jpg',
        'images/people/russian/roman-abramovich.jpg': 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/Roman_Abramovich_2012.jpg/220px-Roman_Abramovich_2012.jpg',
        
        # Enablers
        'images/people/enablers/jean-luc-brunel.jpg': 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Jean-Luc_Brunel.jpg/220px-Jean-Luc_Brunel.jpg',
        'images/people/enablers/alexander-acosta.jpg': 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/dd/Alexander_Acosta_2017.jpg/220px-Alexander_Acosta_2017.jpg',
        
        # Legal
        'images/people/legal/kenneth-starr.jpg': 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Kenneth_Starr_2016.jpg/220px-Kenneth_Starr_2016.jpg',
        
        # Victims
        'images/people/victims/virginia-giuffre.jpg': 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1f/Virginia_Giuffre.jpg/220px-Virginia_Giuffre.jpg',
        
        # Intelligence connections
        'images/people/intelligence/adnan-khashoggi.jpg': 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Adnan_Khashoggi_1988.jpg/220px-Adnan_Khashoggi_1988.jpg',
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
    
    # Create a comprehensive manifest
    manifest = {
        'total_photos': success_count,
        'failed_downloads': failure_count,
        'categories': [
            'core', 'politicians', 'business', 'celebrities',
            'academics', 'enablers', 'victims', 'royalty',
            'international', 'media', 'russian', 'intelligence', 'legal'
        ],
        'timestamp': time.strftime('%Y-%m-%d %H:%M:%S'),
        'success_rate': f"{(success_count/(success_count+failure_count)*100):.1f}%" if (success_count+failure_count) > 0 else "0%"
    }
    
    with open('images/photo-manifest.json', 'w') as f:
        json.dump(manifest, f, indent=2)
    
    print(f"📋 Manifest saved: images/photo-manifest.json")

if __name__ == "__main__":
    main()