# Photo Download Guide for Investigation Subjects

## Required Photos

### CELEBRITIES (save to /images/people/celebrities/):

#### 1. Kevin Spacey
- **File names**: kevin-spacey-1.jpg, kevin-spacey-2.jpg, kevin-spacey-3.jpg, kevin-spacey-4.jpg, kevin-spacey-5.jpg
- **Sources to search**:
  - Wikipedia Commons: https://commons.wikimedia.org/wiki/Category:Kevin_Spacey
  - Getty Images (news photos)
  - AP Images archive
  - Reuters photo archive
- **Photo types needed**: Professional headshots, red carpet events, court appearances, House of Cards promotional photos

#### 2. Mick Jagger  
- **File names**: mick-jagger-1.jpg, mick-jagger-2.jpg, mick-jagger-3.jpg, mick-jagger-4.jpg, mick-jagger-5.jpg
- **Sources to search**:
  - Wikipedia Commons: https://commons.wikimedia.org/wiki/Category:Mick_Jagger
  - Rolling Stones official archives
  - Concert photography archives
- **Photo types needed**: Professional headshots, concert photos, recent interviews, Rolling Stones official photos

#### 3. Woody Allen
- **File names**: woody-allen-1.jpg, woody-allen-2.jpg, woody-allen-3.jpg, woody-allen-4.jpg, woody-allen-5.jpg  
- **Sources to search**:
  - Wikipedia Commons: https://commons.wikimedia.org/wiki/Category:Woody_Allen
  - Film festival archives (Tribeca, Cannes)
  - Movie promotional materials
- **Photo types needed**: Director photos, film festival appearances, interviews, movie premieres

#### 4. Chris Tucker
- **File names**: chris-tucker-1.jpg, chris-tucker-2.jpg, chris-tucker-3.jpg, chris-tucker-4.jpg, chris-tucker-5.jpg
- **Sources to search**:
  - Wikipedia Commons: https://commons.wikimedia.org/wiki/Category:Chris_Tucker
  - Rush Hour promotional materials
  - Comedy special archives
- **Photo types needed**: Comedy performances, movie promotional photos, red carpet events

### BUSINESS FIGURES (save to /images/people/business/):

#### 1. Les Wexner
- **File names**: les-wexner-1.jpg, les-wexner-2.jpg, les-wexner-3.jpg, les-wexner-4.jpg, les-wexner-5.jpg
- **Sources to search**:
  - Wikipedia Commons: https://commons.wikimedia.org/wiki/Category:Leslie_Wexner
  - Limited Brands/L Brands corporate archives
  - Ohio State University archives (major donor)
  - Business publication archives (Forbes, Fortune, WSJ)
- **Photo types needed**: Corporate headshots, business conference photos, philanthropic events

#### 2. Glenn Dubin
- **File names**: glenn-dubin-1.jpg, glenn-dubin-2.jpg, glenn-dubin-3.jpg, glenn-dubin-4.jpg, glenn-dubin-5.jpg
- **Sources to search**:
  - Wikipedia Commons (if available)
  - Highbridge Capital Management corporate materials
  - Financial industry conference archives
  - New York social event archives
- **Photo types needed**: Business headshots, financial conference photos, charity event appearances

#### 3. Leon Black
- **File names**: leon-black-1.jpg, leon-black-2.jpg, leon-black-3.jpg, leon-black-4.jpg, leon-black-5.jpg
- **Sources to search**:
  - Wikipedia Commons: https://commons.wikimedia.org/wiki/Category:Leon_Black
  - Apollo Global Management corporate archives
  - MoMA board member archives (he was chairman)
  - Private equity industry publications
- **Photo types needed**: Corporate headshots, business conference photos, art world events, board meeting photos

## Download Instructions

### Step 1: Search and Download
1. Search each source for high-quality photos (minimum 500x500 pixels)
2. Focus on clear facial identification photos
3. Prefer recent photos (last 10-15 years) when possible
4. Save as JPEG format with sequential numbering

### Step 2: Verification
After downloading, run this command to verify each file:
```bash
python3 verify-downloaded-photos.py
```

### Step 3: Quality Check
- Ensure all photos are legitimate from news sources
- Verify file sizes are reasonable (50KB - 2MB typical)
- Check that faces are clearly visible and identifiable
- Remove any duplicates or poor quality images

## Legal and Ethical Guidelines

- **Only use photos from legitimate news sources, official websites, or Wikipedia Commons**
- **Avoid paparazzi or unauthorized photos**
- **Focus on photos related to business/professional activities**
- **Ensure photos are available under appropriate usage rights**
- **This is for legitimate investigative journalism purposes**

## Backup Sources

If primary sources fail, try:
- Google Images (filtered for usage rights)
- Bing Images (filtered for Creative Commons)
- DuckDuckGo Images
- Archive.org photo collections
- News website archives (CNN, BBC, Reuters, AP)

## Technical Requirements

- **Format**: JPEG (.jpg extension)
- **Size**: Minimum 400x400 pixels, maximum 2000x2000 pixels
- **Quality**: High-resolution, clear facial features
- **File size**: 50KB - 2MB per photo
- **Naming**: Exactly as specified above (lowercase, hyphens, sequential numbers)