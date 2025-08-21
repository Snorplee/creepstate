# Photo Download Instructions

## 🎯 Missing Photos for Names & Shame Page

The following people need photos in the `/images/people/` directories:

### Core Network
- Jeffrey Epstein → `images/people/core/jeffrey-epstein.jpg`
- Ghislaine Maxwell → `images/people/core/ghislaine-maxwell.jpg`

### Politicians  
- Alan Dershowitz → `images/people/politicians/alan-dershowitz.jpg`
- Matt Gaetz → `images/people/politicians/matt-gaetz.jpg`

### Royalty
- Prince Andrew → `images/people/royalty/prince-andrew.jpg`

### Business Leaders
- Les Wexner → `images/people/business/les-wexner.jpg`
- Leon Black → `images/people/business/leon-black.jpg`

### Celebrities
- Kevin Spacey → `images/people/celebrities/kevin-spacey.jpg`
- Chris Tucker → `images/people/celebrities/chris-tucker.jpg`

### Academics
- Marvin Minsky → `images/people/academics/marvin-minsky.jpg`
- Lawrence Krauss → `images/people/academics/lawrence-krauss.jpg`

### Media
- Katie Couric → `images/people/media/katie-couric.jpg`
- Charlie Rose → `images/people/media/charlie-rose.jpg`

### Enablers
- Sarah Kellen → `images/people/enablers/sarah-kellen.jpg`
- Nadia Marcinkova → `images/people/enablers/nadia-marcinkova.jpg`

### International
- Ehud Barak → `images/people/international/ehud-barak.jpg`

### Intelligence  
- Robert Maxwell → `images/people/intelligence/robert-maxwell.jpg`

## 📸 Current Photos Working
✅ Donald Trump, Bill Clinton, Hillary Clinton, Bill Gates, Elon Musk, Stephen Hawking, Virginia Giuffre

## 🛠️ Quick Photo Script

You can run this script with working URLs:

```bash
# Example for Jeffrey Epstein:
curl -o "images/people/core/jeffrey-epstein.jpg" "https://your-working-url.jpg"

# Or use the Python script:
python3 download-people-photos.py
```

## 📋 To Do:
1. Find working photo URLs for the missing people
2. Update the download-people-photos.py script with correct URLs
3. Run the script to download all photos
4. Verify they appear correctly on names-and-shame.html

**Photo Requirements:**
- Format: JPG preferred
- Size: Ideally 300x300px or larger (will be resized to 120x120px)
- Quality: Good resolution for face recognition
- Source: Wikipedia Commons, official government photos, or news archives