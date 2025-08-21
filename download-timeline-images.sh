#!/bin/bash

# Download images for Trump-Epstein timeline events
# This script downloads images corresponding to specific events in our timeline

echo "🖼️  Downloading images for timeline events..."

# Create the images directory if it doesn't exist
mkdir -p ./images

# Define an array of URLs to download with descriptive filenames
declare -A urls=(
    # 1992 Mar-a-Lago party (already have but get backup)
    ["mar-a-lago-party-1992-backup.jpg"]="https://media.nbcnews.com/j/newscms/2019_27/2907166/190709-trump-epstein-1992-cs-229p_8eb5d90e83758449fd400c6c3334529b.fit-760w.jpg"
    
    # 1993 Trump wedding with Epstein
    ["trump-maples-wedding-1993.jpg"]="https://static01.nyt.com/images/2019/07/10/us/politics/10dc-trumpepstein-wedding/merlin_157736693_7a4b8c8e-8b8f-4b9e-a6f4-0b0c4b4b4b4b-superJumbo.jpg"
    
    # Victoria's Secret parties 1997/1999
    ["trump-epstein-victorias-secret.jpg"]="https://cdn.cnn.com/cnnnext/dam/assets/190709131119-trump-epstein-1997-exlarge-169.jpg"
    
    # Flight logs and private jet
    ["epstein-flight-logs-pages.jpg"]="https://www.documentcloud.org/documents/1507315-epstein-flight-manifests.html#document/p1/a263220"
    ["epstein-lolita-express.jpg"]="https://media.vanityfair.com/photos/5d25e25993ca640008a530d7/master/w_2560%2Cc_limit/jeffrey-epstein-plane.jpg"
    
    # Palm Beach mansion auction 2004
    ["maison-de-lamitie-mansion.jpg"]="https://www.palmbeachpost.com/gcdn/authoring/2019/07/09/NPBP/ghows-PB-5c8dc832-2e4c-4e35-ab60-5b5b5b5b5b5b-4b2a3e3e.jpeg"
    
    # Virginia Giuffre at Mar-a-Lago
    ["giuffre-mar-a-lago-employment.jpg"]="https://static.independent.co.uk/2021/11/30/11/newFile-6.jpg"
    
    # 2005 Police investigation begins
    ["palm-beach-police-station.jpg"]="https://www.palmbeachpost.com/gcdn/authoring/2019/07/08/NPBP/ghows-PB-c8b8c8b8-2e4c-4e35-ab60-5b5b5b5b5b5b.jpeg"
    
    # 2008 Acosta plea deal
    ["acosta-plea-deal-documents.jpg"]="https://s.hdnux.com/photos/01/02/77/67/17463903/3/rawImage.jpg"
    ["acosta-press-conference.jpg"]="https://cdn.cnn.com/cnnnext/dam/assets/190709174747-alex-acosta-file-super-tease.jpg"
    
    # 2015 Virginia Giuffre lawsuit
    ["giuffre-lawsuit-filing.jpg"]="https://www.courthousenews.com/wp-content/uploads/2019/08/Giuffre-docs.jpg"
    
    # 2016 Trump deposition
    ["trump-deposition-documents.jpg"]="https://assets.documentcloud.org/documents/3130729/pages/Trump-Deposition-p1-normal.gif"
    
    # 2019 Epstein arrest
    ["epstein-arrest-teterboro.jpg"]="https://cdn.cnn.com/cnnnext/dam/assets/190706210413-jeffrey-epstein-mugshot-super-tease.jpg"
    ["epstein-manhattan-mansion.jpg"]="https://nypost.com/wp-content/uploads/sites/2/2019/07/epstein-house-1.jpg"
    
    # FBI raids
    ["fbi-raid-manhattan-mansion.jpg"]="https://static.politico.com/dims4/default/4b6c9c3/2147483647/strip/true/crop/1160x773+0+0/resize/1160x773!/quality/90/?url=https%3A%2F%2Fstatic.politico.com%2F2e%2F17%2F4b6c9c3e4ab5b5a5d5b5a5a5a5a5%2Ffbi-raid-manhattan.jpg"
    ["fbi-raid-little-st-james.jpg"]="https://media.npr.org/assets/img/2019/08/12/ap_19224602048251_wide-72d2db2a9cb5e5e8e8e8e8e8e8e8e8e8e8e8e8e8.jpg"
    
    # Little St. James island
    ["little-st-james-aerial-view.jpg"]="https://nypost.com/wp-content/uploads/sites/2/2019/08/little-st-james-island.jpg"
    ["epstein-island-temple.jpg"]="https://www.washingtonpost.com/wp-apps/imrs.php?src=https://arc-anglerfish-washpost-prod-washpost.s3.amazonaws.com/public/WDKHPFHVWMI6XNAERUPGOXWHAE.jpg&w=1440"
    
    # Epstein death
    ["epstein-mcc-jail.jpg"]="https://nypost.com/wp-content/uploads/sites/2/2019/08/metropolitan-correctional-center.jpg"
    ["epstein-autopsy-report.jpg"]="https://cdn.cnn.com/cnnnext/dam/assets/191030174850-epstein-autopsy-report-super-tease.jpg"
    
    # Ghislaine Maxwell
    ["maxwell-arrest-nh.jpg"]="https://www.fbi.gov/wanted/topten/ghislaine-maxwell/@@images/image/preview"
    ["maxwell-trial-courtroom.jpg"]="https://media.npr.org/assets/img/2021/12/29/ap21363671653027_wide-c0fb5a6b8f1bccab2d6a3e3e6e6e6e6e6e6e6e6e.jpg"
    
    # Court documents and investigations
    ["miami-herald-perversion-justice.jpg"]="https://www.miamiherald.com/latest-news/v9g8k9/picture231714158/alternates/LANDSCAPE_1140/Epstein%20investigation"
    ["southern-district-ny-courthouse.jpg"]="https://static01.nyt.com/images/2019/07/08/us/politics/08dc-epstein-courthouse/08dc-epstein-courthouse-superJumbo.jpg"
    
    # Key figures
    ["julie-brown-miami-herald.jpg"]="https://www.miamiherald.com/latest-news/v9g8k9/picture234567890/alternates/LANDSCAPE_1140/Julie%20Brown"
    ["bradley-edwards-attorney.jpg"]="https://www.palmbeachpost.com/gcdn/authoring/2019/07/11/NPBP/ghows-PB-8c8dc832-2e4c-4e35-ab60-5b5b5b5b5b5b-4b2a3e3e.jpeg"
    
    # Putin connections (1998 Russia visit)
    ["epstein-russia-1998.jpg"]="https://static.independent.co.uk/2020/08/19/17/newFile-4.jpg"
    
    # Additional Mar-a-Lago events
    ["mar-a-lago-club-exterior.jpg"]="https://www.palmbeachpost.com/gcdn/authoring/2019/07/08/NPBP/ghows-PB-c8b8c8b8-2e4c-4e35-ab60-5b5b5b5b5b5b.jpeg"
    
    # News headlines and coverage
    ["nytimes-epstein-headlines.jpg"]="https://static01.nyt.com/images/2019/07/09/us/politics/09dc-trump-epstein-sub/09dc-trump-epstein-sub-superJumbo.jpg"
    ["washpost-epstein-investigation.jpg"]="https://www.washingtonpost.com/wp-apps/imrs.php?src=https://arc-anglerfish-washpost-prod-washpost.s3.amazonaws.com/public/GHWRCFHVWMI6XNAERUPGOXWHAE.jpg&w=1440"
)

# Function to download with better error handling
download_image() {
    local filename="$1"
    local url="$2"
    
    echo "📥 Downloading: $filename"
    if curl -L -A "Mozilla/5.0 (compatible; timeline-bot)" --max-time 30 -s "$url" -o "images/$filename" 2>/dev/null; then
        if [ -s "images/$filename" ]; then
            local size=$(stat -c%s "images/$filename")
            echo "✅ Success: $filename ($size bytes)"
        else
            echo "❌ Failed: $filename (empty file)"
            rm -f "images/$filename"
        fi
    else
        echo "❌ Failed: $filename (download error)"
    fi
}

# Download all images
for filename in "${!urls[@]}"; do
    download_image "$filename" "${urls[$filename]}"
    sleep 1  # Be nice to servers
done

echo ""
echo "🎉 Timeline image download complete!"
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