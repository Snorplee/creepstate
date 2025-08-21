/*==================================================
 * Timeline Image Enhancer
 * Automatically maps relevant images to timeline events
 * Based on event content, dates, and key figures
 *==================================================*/

const TIMELINE_IMAGE_MAPPINGS = {
    // Key Events with Specific Images
    'events': {
        '1992': 'images/mar-a-lago-party-1992.jpg',
        '1993': 'images/trump-wedding-1993.jpg',
        '1997': 'images/1997-victorias-secret-trump-epstein-source2.jpg',
        '2004': 'images/2004-maison-de-lamitie-mansion-source2.jpg',
        '2005': 'images/2005-palm-beach-police-investigation-source2.jpg',
        '2008': 'images/2008-acosta-plea-deal-source1.jpg',
        '2015': 'images/2015-giuffre-lawsuit-filing-source1.jpg',
        '2016': 'images/2016-trump-deposition-documents-source1.jpg',
        '2019-arrest': 'images/2019-epstein-arrest-teterboro-source3.jpg',
        '2019-death': 'images/2019-epstein-death-mcc-jail-source3.jpg',
        '2020': 'images/2020-maxwell-arrest-new-hampshire-source1.jpg',
        '2021': 'images/2021-maxwell-trial-verdict-source1.jpg'
    },
    
    // Person-specific images
    'people': {
        'trump': 'images/people/politicians/donald-trump.jpg',
        'epstein': 'images/people/enablers/jeffrey-epstein.jpg',
        'maxwell': 'images/people/enablers/ghislaine-maxwell.jpg',
        'clinton': 'images/people/politicians/bill-clinton.jpg',
        'andrew': 'images/people/royalty/prince-andrew.jpg',
        'dershowitz': 'images/people/politicians/alan-dershowitz.jpg',
        'gates': 'images/people/business/bill-gates.jpg',
        'wexner': 'images/people/business/les-wexner.jpg',
        'putin': 'images/people/politicians/vladimir-putin.jpg',
        'giuffre': 'images/people/victims/virginia-giuffre.jpg',
        'acosta': 'images/people/politicians/alex-acosta.jpg',
        'barak': 'images/people/politicians/ehud-barak.jpg',
        'brunel': 'images/people/enablers/jean-luc-brunel.jpg'
    },
    
    // Location-specific images
    'locations': {
        'mar-a-lago': 'images/mar-a-lago-party-1992.jpg',
        'manhattan': 'images/epstein-manhattan-mansion-nyc-source3.jpg',
        'little st. james': 'images/little-st-james-island-aerial-source2.jpg',
        'palm beach': 'images/2005-palm-beach-police-investigation-source2.jpg',
        'paris': 'images/epstein-paris-apartment-arc-triomphe-source1.jpg',
        'new mexico': 'images/epstein-new-mexico-zorro-ranch-source3.jpg',
        'russia': 'images/epstein-russia-1998.jpg'
    },
    
    // Event type images
    'categories': {
        'legal': 'images/southern-district-ny-courthouse.jpg',
        'investigations': 'images/fbi-raid-manhattan-mansion.jpg',
        'reports': 'images/miami-herald-perversion-of-justice-source2.jpg',
        'deaths': 'images/epstein-jail-cell.jpg'
    }
};

/**
 * Enhances timeline events with appropriate images
 */
function enhanceTimelineWithImages() {
    console.log("📸 Starting timeline image enhancement...");
    
    // Get all timeline events
    if (!window.XMLHttpRequest) {
        console.error("XMLHttpRequest not available");
        return;
    }
    
    // Load and parse timeline XML
    const xhr = new XMLHttpRequest();
    xhr.open('GET', 'timeline-comprehensive.xml', true);
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4 && xhr.status === 200) {
            try {
                const parser = new DOMParser();
                const xmlDoc = parser.parseFromString(xhr.responseText, 'text/xml');
                const events = xmlDoc.getElementsByTagName('event');
                
                console.log(`Found ${events.length} events to enhance`);
                
                let enhancedCount = 0;
                
                for (let i = 0; i < events.length; i++) {
                    const event = events[i];
                    const title = event.getAttribute('title') || '';
                    const start = event.getAttribute('start') || '';
                    const classname = event.getAttribute('classname') || '';
                    const description = event.textContent || '';
                    
                    // Skip if already has image
                    if (event.getAttribute('image')) {
                        continue;
                    }
                    
                    const image = findBestImage(title, start, classname, description);
                    if (image) {
                        event.setAttribute('image', image);
                        enhancedCount++;
                        console.log(`✓ Added image to: ${title.substring(0, 50)}...`);
                    }
                }
                
                console.log(`✅ Enhanced ${enhancedCount} events with images`);
                
                // Save enhanced XML (this would need server-side support)
                // For now, just log the enhanced XML
                console.log("Enhanced XML ready for timeline");
                
            } catch (error) {
                console.error("Error processing timeline XML:", error);
            }
        }
    };
    xhr.send();
}

/**
 * Finds the best image for a timeline event
 */
function findBestImage(title, start, classname, description) {
    const titleLower = title.toLowerCase();
    const descLower = description.toLowerCase();
    const year = start.substring(0, 4);
    
    // 1. Check for specific year-based events
    for (const [eventKey, imagePath] of Object.entries(TIMELINE_IMAGE_MAPPINGS.events)) {
        if (eventKey.includes(year)) {
            // Check if event content matches
            if (eventKey.includes('arrest') && (titleLower.includes('arrest') || descLower.includes('arrest'))) {
                return imagePath;
            }
            if (eventKey.includes('death') && (titleLower.includes('death') || titleLower.includes('dies'))) {
                return imagePath;
            }
            if (eventKey === year) {
                return imagePath;
            }
        }
    }
    
    // 2. Check for person-specific images
    for (const [person, imagePath] of Object.entries(TIMELINE_IMAGE_MAPPINGS.people)) {
        if (titleLower.includes(person) || descLower.includes(person)) {
            return imagePath;
        }
    }
    
    // 3. Check for location-specific images
    for (const [location, imagePath] of Object.entries(TIMELINE_IMAGE_MAPPINGS.locations)) {
        if (titleLower.includes(location) || descLower.includes(location)) {
            return imagePath;
        }
    }
    
    // 4. Check for category-based images
    if (TIMELINE_IMAGE_MAPPINGS.categories[classname]) {
        return TIMELINE_IMAGE_MAPPINGS.categories[classname];
    }
    
    // 5. Special keyword matching
    const keywords = {
        'wedding': 'images/trump-wedding-1993.jpg',
        'party': 'images/mar-a-lago-party-1992.jpg',
        'flight': 'images/epstein-private-jet-lolita-express-source3.jpg',
        'mansion': 'images/epstein-manhattan-mansion-nyc-source3.jpg',
        'island': 'images/little-st-james-island-aerial-source2.jpg',
        'temple': 'images/little-st-james-temple-surveillance-source2.jpg',
        'surveillance': 'images/epstein-hidden-cameras-surveillance-source3.jpg',
        'trial': 'images/maxwell-trial-courtroom.jpg',
        'verdict': 'images/maxwell-verdict.jpg',
        'documents': 'images/epstein-unsealed-court-documents-2024-source1.jpg',
        'plea deal': 'images/acosta-plea-deal-documents.jpg',
        'raid': 'images/fbi-raid-manhattan-mansion.jpg'
    };
    
    for (const [keyword, imagePath] of Object.entries(keywords)) {
        if (titleLower.includes(keyword) || descLower.includes(keyword)) {
            return imagePath;
        }
    }
    
    // 6. Default images by category
    const categoryDefaults = {
        'events': 'images/people/enablers/jeffrey-epstein.jpg',
        'reports': 'images/miami-herald-perversion-of-justice-source2.jpg',
        'legal': 'images/southern-district-ny-courthouse.jpg',
        'investigations': 'images/fbi-raid-manhattan-mansion.jpg',
        'deaths': 'images/epstein-jail-cell.jpg'
    };
    
    return categoryDefaults[classname] || null;
}

/**
 * Adds image enhancement to SIMILE Timeline after creation
 */
function enhanceSimileTimelineImages(timeline) {
    if (!timeline || !timeline.getBandCount) {
        console.log("Timeline not ready for image enhancement");
        return;
    }
    
    console.log("🎨 Enhancing SIMILE Timeline with images...");
    
    try {
        // Enhance event bubbles with better image display
        const style = document.createElement('style');
        style.textContent = `
            .timeline-event-bubble img {
                max-width: 300px !important;
                max-height: 200px !important;
                border-radius: 8px !important;
                margin: 10px 0 !important;
                box-shadow: 0 4px 12px rgba(0,0,0,0.3) !important;
            }
            
            .timeline-event-bubble .event-image-container {
                text-align: center !important;
                margin: 10px 0 !important;
            }
            
            .timeline-event-bubble .event-image-caption {
                font-size: 11px !important;
                color: #a0aec0 !important;
                margin-top: 5px !important;
                font-style: italic !important;
            }
        `;
        document.head.appendChild(style);
        
        console.log("✅ SIMILE Timeline image enhancement complete");
        
    } catch (error) {
        console.error("Error enhancing SIMILE Timeline images:", error);
    }
}

/**
 * Initialize image enhancement system
 */
function initializeImageEnhancement() {
    console.log("🚀 Initializing Timeline Image Enhancement System");
    
    // Wait for Timeline to be ready
    if (typeof Timeline !== 'undefined' && Timeline.create) {
        enhanceTimelineWithImages();
    } else {
        // Wait for Timeline to load
        setTimeout(initializeImageEnhancement, 1000);
    }
}

// Auto-start when page loads
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeImageEnhancement);
} else {
    initializeImageEnhancement();
}

// Export for manual usage
window.TimelineImageEnhancer = {
    enhance: enhanceTimelineWithImages,
    enhanceSimile: enhanceSimileTimelineImages,
    findImage: findBestImage,
    mappings: TIMELINE_IMAGE_MAPPINGS
};