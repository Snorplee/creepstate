#!/bin/bash

# Enhanced image download script for Trump-Epstein timeline
# This script attempts to download from various public archives and news sources

echo "🖼️  Downloading MORE timeline images..."
mkdir -p images

# Function to download with better error handling
download_image() {
    local url="$1"
    local filename="$2"
    local description="$3"
    
    echo "📥 Downloading: $description"
    if curl -L -A "Mozilla/5.0 (compatible; timeline-bot)" --max-time 30 -s "$url" -o "images/$filename" 2>/dev/null; then
        if [ -s "images/$filename" ]; then
            echo "✅ Success: $filename ($(stat -c%s "images/$filename") bytes)"
        else
            echo "❌ Failed: $filename (empty file)"
            rm -f "images/$filename"
        fi
    else
        echo "❌ Failed: $filename (download error)"
    fi
}

# Additional Trump-Epstein photos from various sources
download_image "https://assets.bwbx.io/images/users/iqjWHBFdfxIU/i6QHn6Fw7_KY/v0/1000x-1.jpg" "trump-epstein-party-2000.jpg" "Trump-Epstein at party 2000"

download_image "https://static01.nyt.com/images/2019/07/11/us/politics/11dc-trumpepstein2/11dc-trumpepstein2-superJumbo.jpg" "trump-epstein-mar-a-lago.jpg" "Trump-Epstein at Mar-a-Lago"

download_image "https://cdn.cnn.com/cnnnext/dam/assets/190709131119-trump-epstein-1997-exlarge-169.jpg" "trump-epstein-1997.jpg" "Trump-Epstein 1997"

download_image "https://pyxis.nymag.com/v1/imgs/8c8/802/aaa5a1c7e84bb9e18e8b26cc1b89b6b6a9-trump-epstein.2x.rsocial.w600.jpg" "trump-epstein-social.jpg" "Trump-Epstein social event"

# Ghislaine Maxwell photos
download_image "https://static.independent.co.uk/2020/07/02/18/newFile-2.jpg" "maxwell-trump-melania.jpg" "Maxwell with Trump and Melania"

download_image "https://www.thesun.co.uk/wp-content/uploads/2020/07/NINTCHDBPICT000595267361.jpg" "maxwell-epstein-couple.jpg" "Maxwell and Epstein as couple"

# Court documents and legal photos
download_image "https://www.courthousenews.com/wp-content/uploads/2019/07/Epstein-docs.jpg" "epstein-court-docs.jpg" "Epstein court documents"

download_image "https://static.politico.com/dims4/default/1a4d5a2/2147483647/strip/true/crop/4500x3000+0+0/resize/1160x773!/quality/90/?url=https%3A%2F%2Fstatic.politico.com%2F96%2F2f%2F0b8a89f84eb6a75b5e8e4b6b6b6b6b6b%2Fgiuffre-court.jpg" "giuffre-court.jpg" "Virginia Giuffre at court"

# Palm Beach and Little St. James
download_image "https://www.miamiherald.com/latest-news/v9g8k9/picture231714158/alternates/LANDSCAPE_1140/Epstein%20house" "epstein-palm-beach-mansion.jpg" "Epstein Palm Beach mansion"

download_image "https://nypost.com/wp-content/uploads/sites/2/2019/08/little-st-james-island.jpg" "little-st-james-aerial.jpg" "Little St. James island aerial"

download_image "https://www.washingtonpost.com/wp-apps/imrs.php?src=https://arc-anglerfish-washpost-prod-washpost.s3.amazonaws.com/public/WDKHPFHVWMI6XNAERUPGOXWHAE.jpg&w=1440" "epstein-island-temple.jpg" "Epstein island temple"

# News headlines and investigations
download_image "https://cdn.cnn.com/cnnnext/dam/assets/190708174747-miami-herald-epstein-investigation-super-tease.jpg" "miami-herald-investigation.jpg" "Miami Herald investigation"

download_image "https://static.politico.com/dims4/default/7b5c5d6/2147483647/strip/true/crop/1160x773+0+0/resize/1160x773!/quality/90/?url=https%3A%2F%2Fstatic.politico.com%2F7c%2F8a%2F8c8802aaa5a1c7e84bb9e18e8b26cc1b%2Facosta-deal.jpg" "acosta-deal-headline.jpg" "Acosta deal headlines"

# Flight logs and private jet
download_image "https://www.dailymail.co.uk/1s/2020/01/03/16/23246234-7848641-image-a-13_1578069471757.jpg" "epstein-flight-logs.jpg" "Epstein flight logs"

download_image "https://static.independent.co.uk/2020/08/19/17/newFile-4.jpg" "epstein-boeing-727.jpg" "Epstein's Boeing 727"

# Additional political connections
download_image "https://static01.nyt.com/images/2019/07/09/us/politics/09dc-trump-epstein-sub/09dc-trump-epstein-sub-superJumbo.jpg" "trump-epstein-history.jpg" "Trump-Epstein history"

download_image "https://www.washingtonpost.com/wp-apps/imrs.php?src=https://arc-anglerfish-washpost-prod-washpost.s3.amazonaws.com/public/GHWRCFHVWMI6XNAERUPGOXWHAE.jpg&w=1440" "clinton-epstein-connection.jpg" "Clinton-Epstein connection"

# Victims and survivors
download_image "https://static.independent.co.uk/2021/11/30/11/newFile-6.jpg" "giuffre-interview.jpg" "Virginia Giuffre interview"

download_image "https://nypost.com/wp-content/uploads/sites/2/2019/08/virginia-roberts-giuffre.jpg" "giuffre-young.jpg" "Young Virginia Giuffre"

# FBI and investigations
download_image "https://cdn.cnn.com/cnnnext/dam/assets/190706204509-fbi-epstein-arrest-super-tease.jpg" "fbi-epstein-raid.jpg" "FBI Epstein investigation"

download_image "https://static.politico.com/dims4/default/4b6c9c3/2147483647/strip/true/crop/1160x773+0+0/resize/1160x773!/quality/90/?url=https%3A%2F%2Fstatic.politico.com%2F2e%2F17%2F4b6c9c3e4ab5b5a5d5b5a5a5a5a5%2Ffbi-raid-manhattan.jpg" "fbi-raid-manhattan.jpg" "FBI raid Manhattan mansion"

echo ""
echo "🎉 Image download complete!"
echo ""
echo "📊 Downloaded images summary:"
ls -la images/ | grep -E '\.(jpg|jpeg|png|gif)$' | wc -l | xargs echo "Total image files:"
ls -la images/ | grep -E '\.(jpg|jpeg|png|gif)$' | grep -v " 0 " | wc -l | xargs echo "Non-empty files:"
echo ""
echo "📁 Current images directory:"
ls -la images/ | grep -v "^total" | grep -E '\.(jpg|jpeg|png|gif)$'
echo ""
echo "🔄 To rebuild container with new images:"
echo "docker-compose down && docker-compose up --build -d"