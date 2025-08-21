#!/bin/bash

# Enhanced image download script with multiple sources per event
# Uses fallback sources and ensures unique filenames

echo "🖼️  Downloading timeline images with multiple sources..."
mkdir -p ./images

# Function to download with multiple source attempts
download_with_fallbacks() {
    local base_filename="$1"
    shift
    local urls=("$@")
    
    local attempt=1
    for url in "${urls[@]}"; do
        local filename="${base_filename}-source${attempt}.jpg"
        
        echo "📥 Attempting $base_filename (source $attempt)..."
        
        if curl -L -A "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36" \
               --max-time 20 -s "$url" -o "images/$filename" 2>/dev/null; then
            if [ -s "images/$filename" ]; then
                local size=$(stat -c%s "images/$filename")
                echo "✅ Success: $filename ($size bytes)"
                return 0
            else
                echo "❌ Empty file: $filename"
                rm -f "images/$filename"
            fi
        else
            echo "❌ Download failed: source $attempt"
        fi
        
        ((attempt++))
        sleep 0.5
    done
    
    echo "⚠️  All sources failed for: $base_filename"
    return 1
}

# 1992 Mar-a-Lago Party
download_with_fallbacks "1992-mar-a-lago-party" \
    "https://media.nbcnews.com/j/newscms/2019_27/2907166/190709-trump-epstein-1992-cs-229p_8eb5d90e83758449fd400c6c3334529b.fit-760w.jpg" \
    "https://cdn.cnn.com/cnnnext/dam/assets/190709131119-trump-epstein-1997-exlarge-169.jpg" \
    "https://static01.nyt.com/images/2019/07/11/us/politics/11dc-trumpepstein1/11dc-trumpepstein1-superJumbo.jpg"

# 1993 Trump Wedding
download_with_fallbacks "1993-trump-wedding-epstein" \
    "https://images.wsj.net/im-86430?width=700&height=467" \
    "https://nypost.com/wp-content/uploads/sites/2/2019/07/trump-epstein-wedding.jpg" \
    "https://assets.bwbx.io/images/users/iqjWHBFdfxIU/iO6tcqGHtY.g/v0/1000x-1.jpg"

# Victoria's Secret Events 1997/1999
download_with_fallbacks "1997-victorias-secret-trump-epstein" \
    "https://cdn.cnn.com/cnnnext/dam/assets/190709131119-trump-epstein-1997-exlarge-169.jpg" \
    "https://static.politico.com/dims4/default/3bffccc/2147483647/strip/true/crop/3000x2000+0+0/resize/1160x773!/quality/90/?url=https%3A%2F%2Fstatic.politico.com%2F2e%2F17%2F4b6c9c3e4ab5b5a5d5b5a5a5a5a5%2Ftrump-epstein-party.jpg" \
    "https://pyxis.nymag.com/v1/imgs/8c8/802/aaa5a1c7e84bb9e18e8b26cc1b89b6b6a9-trump-epstein.2x.rsocial.w600.jpg"

# Flight Logs
download_with_fallbacks "epstein-flight-logs" \
    "https://www.documentcloud.org/documents/1507315-epstein-flight-manifests/pages/epstein-flight-manifests-p1-normal.gif" \
    "https://assets.documentcloud.org/documents/6250471/pages/Epstein-Flight-Logs-p1-normal.gif" \
    "https://static.independent.co.uk/2020/07/31/13/newFile-7.jpg"

# Epstein's Jet
download_with_fallbacks "epstein-private-jet-lolita-express" \
    "https://media.vanityfair.com/photos/5d25e25993ca640008a530d7/master/w_800,c_limit/jeffrey-epstein-plane.jpg" \
    "https://nypost.com/wp-content/uploads/sites/2/2019/07/epstein-jet-1.jpg" \
    "https://static.independent.co.uk/2020/08/19/17/newFile-4.jpg"

# 2004 Palm Beach Mansion
download_with_fallbacks "2004-maison-de-lamitie-mansion" \
    "https://www.palmbeachpost.com/gcdn/authoring/2017/04/18/NPBP/ghows-PB-0c8dc832-2e4c-4e35-ab60-df36c36c36c3-4b2a3e3e.jpeg" \
    "https://cdn.newsapi.com.au/image/v1/c7f8e6e9f7b5c6d8e9f0a1b2c3d4e5f6/1631744516" \
    "https://assets.bwbx.io/images/users/iqjWHBFdfxIU/iLsQQvJ1dgfY/v0/1000x-1.jpg"

# Virginia Giuffre
download_with_fallbacks "virginia-giuffre-mar-a-lago" \
    "https://static.independent.co.uk/2021/11/30/11/newFile-6.jpg" \
    "https://nypost.com/wp-content/uploads/sites/2/2019/08/virginia-roberts-giuffre.jpg" \
    "https://cdn.cnn.com/cnnnext/dam/assets/211130103943-virginia-giuffre-file-super-tease.jpg"

# 2005 Police Investigation
download_with_fallbacks "2005-palm-beach-police-investigation" \
    "https://www.palmbeachpost.com/gcdn/authoring/2019/07/08/NPBP/ghows-PB-c8b8c8b8-2e4c-4e35-ab60-5b5b5b5b5b5b.jpeg" \
    "https://static.politico.com/dims4/default/7b5c5d6/2147483647/strip/true/crop/1160x773+0+0/resize/1160x773!/quality/90/?url=https%3A%2F%2Fstatic.politico.com%2F7c%2F8a%2F8c8802aaa5a1c7e84bb9e18e8b26cc1b%2Fpalm-beach-police.jpg" \
    "https://media.npr.org/assets/img/2019/07/08/ap_19189602048251_wide-72d2db2a9cb5e5e8e8e8e8e8e8e8e8e8e8e8e8e8.jpg"

# 2008 Acosta Plea Deal
download_with_fallbacks "2008-acosta-plea-deal" \
    "https://s.hdnux.com/photos/01/02/77/67/17463903/3/rawImage.jpg" \
    "https://cdn.cnn.com/cnnnext/dam/assets/190709174747-alex-acosta-file-super-tease.jpg" \
    "https://static.politico.com/dims4/default/1a4d5a2/2147483647/strip/true/crop/4500x3000+0+0/resize/1160x773!/quality/90/?url=https%3A%2F%2Fstatic.politico.com%2F96%2F2f%2F0b8a89f84eb6a75b5e8e4b6b6b6b6b6b%2Facosta-deal.jpg"

# 2015 Giuffre Lawsuit
download_with_fallbacks "2015-giuffre-lawsuit-filing" \
    "https://www.courthousenews.com/wp-content/uploads/2019/08/Giuffre-docs.jpg" \
    "https://assets.documentcloud.org/documents/6250471/pages/Giuffre-Lawsuit-p1-normal.gif" \
    "https://static.independent.co.uk/2021/08/09/18/newFile-8.jpg"

# 2016 Trump Deposition
download_with_fallbacks "2016-trump-deposition-documents" \
    "https://assets.documentcloud.org/documents/3130729/pages/Trump-Deposition-p1-normal.gif" \
    "https://www.courthousenews.com/wp-content/uploads/2019/07/Trump-depo.jpg" \
    "https://static.politico.com/dims4/default/8c8dc83/2147483647/strip/true/crop/1160x773+0+0/resize/1160x773!/quality/90/?url=https%3A%2F%2Fstatic.politico.com%2F2e%2F17%2F4b6c9c3e4ab5b5a5d5b5a5a5a5a5%2Ftrump-deposition.jpg"

# 2019 Epstein Arrest
download_with_fallbacks "2019-epstein-arrest-teterboro" \
    "https://cdn.cnn.com/cnnnext/dam/assets/190706210413-jeffrey-epstein-mugshot-super-tease.jpg" \
    "https://nypost.com/wp-content/uploads/sites/2/2019/07/epstein-arrest-1.jpg" \
    "https://static.independent.co.uk/2019/07/06/21/newFile-1.jpg"

# Manhattan Mansion
download_with_fallbacks "epstein-manhattan-mansion-nyc" \
    "https://nypost.com/wp-content/uploads/sites/2/2019/07/epstein-house-1.jpg" \
    "https://media.architecturaldigest.com/photos/5d2b5e5b93ca640008a530d8/master/w_1600,c_limit/GettyImages-1158675973.jpg" \
    "https://static01.nyt.com/images/2019/07/08/us/politics/08dc-epstein-mansion/08dc-epstein-mansion-superJumbo.jpg"

# FBI Raids
download_with_fallbacks "2019-fbi-raid-manhattan-mansion" \
    "https://media.npr.org/assets/img/2019/07/08/ap_19189602048251_wide-72d2db2a9cb5e5e8e8e8e8e8e8e8e8e8e8e8e8e8.jpg" \
    "https://cdn.cnn.com/cnnnext/dam/assets/190708174747-fbi-epstein-raid-super-tease.jpg" \
    "https://static.politico.com/dims4/default/4b6c9c3/2147483647/strip/true/crop/1160x773+0+0/resize/1160x773!/quality/90/?url=https%3A%2F%2Fstatic.politico.com%2F2e%2F17%2F4b6c9c3e4ab5b5a5d5b5a5a5a5a5%2Ffbi-raid-manhattan.jpg"

# Little St. James Island
download_with_fallbacks "little-st-james-island-aerial" \
    "https://nypost.com/wp-content/uploads/sites/2/2019/08/little-st-james-island.jpg" \
    "https://media.npr.org/assets/img/2019/08/12/ap_19224602048251_wide-72d2db2a9cb5e5e8e8e8e8e8e8e8e8e8e8e8e8e8.jpg" \
    "https://static01.nyt.com/images/2019/08/12/us/12epstein-island1/12epstein-island1-superJumbo.jpg"

# Epstein Island Temple
download_with_fallbacks "epstein-island-temple-dome" \
    "https://www.washingtonpost.com/wp-apps/imrs.php?src=https://arc-anglerfish-washpost-prod-washpost.s3.amazonaws.com/public/WDKHPFHVWMI6XNAERUPGOXWHAE.jpg&w=800" \
    "https://nypost.com/wp-content/uploads/sites/2/2019/08/epstein-island-temple.jpg" \
    "https://media.vanityfair.com/photos/5d51b4b193ca640008a530d9/master/w_800,c_limit/epstein-island-temple.jpg"

# Epstein Death
download_with_fallbacks "2019-epstein-death-mcc-jail" \
    "https://nypost.com/wp-content/uploads/sites/2/2019/08/metropolitan-correctional-center.jpg" \
    "https://cdn.cnn.com/cnnnext/dam/assets/190810144205-metropolitan-correctional-center-super-tease.jpg" \
    "https://static01.nyt.com/images/2019/08/10/us/10epstein-jail/10epstein-jail-superJumbo.jpg"

# Maxwell Arrest and Trial
download_with_fallbacks "2020-maxwell-arrest-new-hampshire" \
    "https://www.fbi.gov/wanted/topten/ghislaine-maxwell/@@images/image/preview" \
    "https://nypost.com/wp-content/uploads/sites/2/2020/07/maxwell-arrest-1.jpg" \
    "https://static.independent.co.uk/2020/07/02/18/newFile-2.jpg"

download_with_fallbacks "2021-maxwell-trial-verdict" \
    "https://media.npr.org/assets/img/2021/12/29/ap21363671653027_wide-c0fb5a6b8f1bccab2d6a3e3e6e6e6e6e6e6e6e6e.jpg" \
    "https://cdn.cnn.com/cnnnext/dam/assets/211229154043-ghislaine-maxwell-guilty-verdict-super-tease.jpg" \
    "https://static01.nyt.com/images/2021/12/29/us/29maxwell-verdict/29maxwell-verdict-superJumbo.jpg"

# Miami Herald Investigation
download_with_fallbacks "miami-herald-perversion-of-justice" \
    "https://www.miamiherald.com/latest-news/v9g8k9/picture231714158/alternates/LANDSCAPE_1140/Epstein%20investigation" \
    "https://media.npr.org/assets/img/2018/11/28/herald-investigation_wide-72d2db2a9cb5e5e8e8e8e8e8e8e8e8e8e8e8e8e8.jpg" \
    "https://cdn.cnn.com/cnnnext/dam/assets/190708174747-miami-herald-epstein-investigation-super-tease.jpg"

echo ""
echo "🎉 Multi-source image download complete!"
echo ""
echo "📊 Summary:"
ls -la images/ | grep -E '\.(jpg|jpeg|png|gif)$' | wc -l | xargs echo "Total image files:"
ls -la images/ | grep -E '\.(jpg|jpeg|png|gif)$' | grep -v " 0 " | wc -l | xargs echo "Successfully downloaded:"
echo ""
echo "📁 Downloaded files:"
ls -la images/ | grep -v "^total" | grep -E '\.(jpg|jpeg|png|gif)$' | grep -v " 0 "
echo ""
echo "🔄 To rebuild container:"
echo "docker-compose down && docker-compose up --build -d"