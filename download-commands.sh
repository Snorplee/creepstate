#!/bin/bash
# Manual Download Commands for Investigation Photos
# Copy and paste these commands to download photos manually

echo "🔍 Photo Download Commands for Investigation Subjects"
echo "=" 
echo "Run these wget commands to download the photos:"
echo ""

# Create directories
echo "# Create directories:"
echo "mkdir -p images/people/celebrities images/people/business"
echo ""

# Kevin Spacey
echo "# Kevin Spacey Photos:"
echo "wget -O images/people/celebrities/kevin-spacey-1.jpg 'https://upload.wikimedia.org/wikipedia/commons/5/55/Kevin_Spacey_2013.jpg'"
echo "wget -O images/people/celebrities/kevin-spacey-2.jpg 'https://upload.wikimedia.org/wikipedia/commons/b/b4/Kevin_Spacey_2011_AA.jpg'"
echo "wget -O images/people/celebrities/kevin-spacey-3.jpg 'https://upload.wikimedia.org/wikipedia/commons/8/82/Kevin_Spacey_2008.jpg'"
echo "wget -O images/people/celebrities/kevin-spacey-4.jpg 'https://upload.wikimedia.org/wikipedia/commons/7/7a/Kevin_Spacey_2006.jpg'"
echo "wget -O images/people/celebrities/kevin-spacey-5.jpg 'https://upload.wikimedia.org/wikipedia/commons/2/26/Kevin_Spacey_House_of_Cards.jpg'"
echo ""

# Mick Jagger
echo "# Mick Jagger Photos:"
echo "wget -O images/people/celebrities/mick-jagger-1.jpg 'https://upload.wikimedia.org/wikipedia/commons/e/ed/Mick_Jagger_in_Zurich_-_14.09.2017.jpg'"
echo "wget -O images/people/celebrities/mick-jagger-2.jpg 'https://upload.wikimedia.org/wikipedia/commons/a/af/Mick_Jagger_Deauville_2014.jpg'" 
echo "wget -O images/people/celebrities/mick-jagger-3.jpg 'https://upload.wikimedia.org/wikipedia/commons/f/fd/Mick_Jagger_1972.jpg'"
echo "wget -O images/people/celebrities/mick-jagger-4.jpg 'https://upload.wikimedia.org/wikipedia/commons/b/b8/Mick_Jagger_2006.jpg'"
echo "wget -O images/people/celebrities/mick-jagger-5.jpg 'https://upload.wikimedia.org/wikipedia/commons/9/92/MickJagger2006.jpg'"
echo ""

# Woody Allen
echo "# Woody Allen Photos:"
echo "wget -O images/people/celebrities/woody-allen-1.jpg 'https://upload.wikimedia.org/wikipedia/commons/f/f9/Woody_Allen_at_the_2009_Tribeca_Film_Festival.jpg'"
echo "wget -O images/people/celebrities/woody-allen-2.jpg 'https://upload.wikimedia.org/wikipedia/commons/8/83/Woody_Allen_2006.jpg'"
echo "wget -O images/people/celebrities/woody-allen-3.jpg 'https://upload.wikimedia.org/wikipedia/commons/a/a0/Woody_Allen_2010.jpg'"
echo "wget -O images/people/celebrities/woody-allen-4.jpg 'https://upload.wikimedia.org/wikipedia/commons/d/d8/Woody_Allen_-_2013.jpg'"
echo "wget -O images/people/celebrities/woody-allen-5.jpg 'https://upload.wikimedia.org/wikipedia/commons/1/1e/Woody_Allen_2012.jpg'"
echo ""

# Chris Tucker  
echo "# Chris Tucker Photos:"
echo "wget -O images/people/celebrities/chris-tucker-1.jpg 'https://upload.wikimedia.org/wikipedia/commons/7/73/Chris_Tucker_2012.jpg'"
echo "wget -O images/people/celebrities/chris-tucker-2.jpg 'https://upload.wikimedia.org/wikipedia/commons/a/a8/Chris_Tucker_2013.jpg'"
echo "wget -O images/people/celebrities/chris-tucker-3.jpg 'https://upload.wikimedia.org/wikipedia/commons/f/f5/Chris_Tucker_at_Tribeca_2007.jpg'"
echo "wget -O images/people/celebrities/chris-tucker-4.jpg 'https://upload.wikimedia.org/wikipedia/commons/9/9a/Chris_Tucker_2015.jpg'"
echo "wget -O images/people/celebrities/chris-tucker-5.jpg 'https://upload.wikimedia.org/wikipedia/commons/2/28/Chris_Tucker_Rush_Hour.jpg'"
echo ""

# Les Wexner
echo "# Les Wexner Photos:"
echo "wget -O images/people/business/les-wexner-1.jpg 'https://upload.wikimedia.org/wikipedia/commons/9/90/Leslie_Wexner_2011.jpg'"
echo "wget -O images/people/business/les-wexner-2.jpg 'https://upload.wikimedia.org/wikipedia/commons/3/37/Les_Wexner_2013.jpg'"
echo "wget -O images/people/business/les-wexner-3.jpg 'https://upload.wikimedia.org/wikipedia/commons/b/b4/Leslie_Wexner_2009.jpg'"
echo "wget -O images/people/business/les-wexner-4.jpg 'https://upload.wikimedia.org/wikipedia/commons/f/f8/Les_Wexner_2016.jpg'"
echo "wget -O images/people/business/les-wexner-5.jpg 'https://upload.wikimedia.org/wikipedia/commons/8/84/Leslie_Wexner_Limited_Brands.jpg'"
echo ""

# Glenn Dubin
echo "# Glenn Dubin Photos:"
echo "wget -O images/people/business/glenn-dubin-1.jpg 'https://upload.wikimedia.org/wikipedia/commons/a/a5/Glenn_Dubin_2012.jpg'"
echo "wget -O images/people/business/glenn-dubin-2.jpg 'https://upload.wikimedia.org/wikipedia/commons/d/d3/Glenn_Dubin_2015.jpg'"
echo "wget -O images/people/business/glenn-dubin-3.jpg 'https://upload.wikimedia.org/wikipedia/commons/7/7b/Glenn_Dubin_2011.jpg'"
echo "wget -O images/people/business/glenn-dubin-4.jpg 'https://upload.wikimedia.org/wikipedia/commons/c/c8/Glenn_Dubin_2013.jpg'"
echo "wget -O images/people/business/glenn-dubin-5.jpg 'https://upload.wikimedia.org/wikipedia/commons/1/1a/Glenn_Dubin_Highbridge.jpg'"
echo ""

# Leon Black
echo "# Leon Black Photos:"
echo "wget -O images/people/business/leon-black-1.jpg 'https://upload.wikimedia.org/wikipedia/commons/1/1f/Leon_Black_2012.jpg'"
echo "wget -O images/people/business/leon-black-2.jpg 'https://upload.wikimedia.org/wikipedia/commons/8/89/Leon_Black_2015.jpg'"
echo "wget -O images/people/business/leon-black-3.jpg 'https://upload.wikimedia.org/wikipedia/commons/f/f2/Leon_Black_2013.jpg'"
echo "wget -O images/people/business/leon-black-4.jpg 'https://upload.wikimedia.org/wikipedia/commons/a/a7/Leon_Black_2011.jpg'"
echo "wget -O images/people/business/leon-black-5.jpg 'https://upload.wikimedia.org/wikipedia/commons/3/34/Leon_Black_Apollo_Management.jpg'"
echo ""

echo "# After downloading, verify all files:"
echo "python3 verify-downloaded-photos.py"
echo ""
echo "# Use 'file' command to check individual photos:"
echo "file images/people/celebrities/*.jpg images/people/business/*.jpg"