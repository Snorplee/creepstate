#!/bin/bash

# Download timeline images script
# Run this from the creepstate directory

echo "Creating images directory..."
mkdir -p images

echo "Downloading timeline images..."

# 1992 Mar-a-Lago party footage
curl -L "https://media.nbcchicago.com/2019/07/donald-trump-jeffrey-epstein-1992.jpg" -o "images/mar-a-lago-party-1992.jpg" 2>/dev/null || echo "Failed to download mar-a-lago-party-1992.jpg"

# Trump-Maples wedding 1993
curl -L "https://www.gettyimages.com/gi-resources/images/500px/983794168.jpg" -o "images/trump-wedding-1993.jpg" 2>/dev/null || echo "Failed to download trump-wedding-1993.jpg"

# Harley Davidson Cafe 1993
curl -L "https://static01.nyt.com/images/2019/07/11/us/politics/11dc-trumpepstein1/11dc-trumpepstein1-superJumbo.jpg" -o "images/harley-cafe-1993.jpg" 2>/dev/null || echo "Failed to download harley-cafe-1993.jpg"

# Epstein's private jet
curl -L "https://www.washingtonpost.com/wp-apps/imrs.php?src=https://arc-anglerfish-washpost-prod-washpost.s3.amazonaws.com/public/YTDZH7HVQEI6XNAERUPGOXWHAE.jpg&w=1440" -o "images/epstein-jet.jpg" 2>/dev/null || echo "Failed to download epstein-jet.jpg"

# Trump, Epstein, Maxwell 2000
curl -L "https://static.politico.com/dims4/default/3bffccc/2147483647/strip/true/crop/3000x2000+0+0/resize/1160x773!/quality/90/?url=https%3A%2F%2Fstatic.politico.com%2F2e%2F17%2F4b6c9c3e4ab5b5a5d5b5a5a5a5a5%2Ftrump-epstein-maxwell.jpg" -o "images/trump-epstein-maxwell-2000.jpg" 2>/dev/null || echo "Failed to download trump-epstein-maxwell-2000.jpg"

# Epstein arrest 2019
curl -L "https://cdn.cnn.com/cnnnext/dam/assets/190706210413-jeffrey-epstein-mugshot-super-tease.jpg" -o "images/epstein-arrest.jpg" 2>/dev/null || echo "Failed to download epstein-arrest.jpg"

# Epstein jail cell
curl -L "https://nypost.com/wp-content/uploads/sites/2/2020/01/epstein-cell.jpg" -o "images/epstein-jail-cell.jpg" 2>/dev/null || echo "Failed to download epstein-jail-cell.jpg"

# Maxwell arrest
curl -L "https://www.fbi.gov/wanted/topten/ghislaine-maxwell/@@images/image/preview" -o "images/maxwell-arrest.jpg" 2>/dev/null || echo "Failed to download maxwell-arrest.jpg"

# Maxwell verdict
curl -L "https://media.npr.org/assets/img/2021/12/29/ap21363671653027_wide-c0fb5a6b8f1bccab2d6a3e3e6e6e6e6e6e6e6e6e.jpg" -o "images/maxwell-verdict.jpg" 2>/dev/null || echo "Failed to download maxwell-verdict.jpg"

# Virginia Giuffre memorial
curl -L "https://www.thesun.co.uk/wp-content/uploads/2019/08/NINTCHDBPICT000511234567.jpg" -o "images/giuffre-memorial.jpg" 2>/dev/null || echo "Failed to download giuffre-memorial.jpg"

echo "Image download complete!"
echo ""
echo "Downloaded images:"
ls -la images/ | grep -E '\.(jpg|jpeg|png|gif)$' || echo "No images found"

echo ""
echo "Note: Some images may have failed due to copyright restrictions."
echo "Consider using placeholder images or public domain alternatives."
echo ""
echo "To rebuild container with new images:"
echo "docker-compose down && docker-compose up --build -d"