/**
 * Photo Fallback System
 * Handles missing photos and creates placeholders
 */

(function() {
    'use strict';
    
    const PhotoFallback = {
        // Default placeholder images for categories
        placeholders: {
            core: '👤',
            politicians: '🏛️',
            royalty: '👑',
            business: '💼',
            celebrities: '🎭',
            enablers: '⚠️',
            victims: '💔',
            academics: '🎓',
            media: '📺',
            intelligence: '🕵️',
            legal: '⚖️',
            international: '🌍',
            russian: '🇷🇺'
        },
        
        init() {
            this.handleMissingImages();
            this.createPhotoManifest();
            console.log('Photo fallback system initialized');
        },
        
        handleMissingImages() {
            // Find all images and add error handlers
            document.querySelectorAll('img').forEach(img => {
                if (!img.dataset.fallbackHandled) {
                    img.addEventListener('error', (e) => this.handleImageError(e));
                    img.dataset.fallbackHandled = 'true';
                }
            });
            
            // Use MutationObserver for dynamically added images
            if (window.MutationObserver) {
                const observer = new MutationObserver(mutations => {
                    mutations.forEach(mutation => {
                        mutation.addedNodes.forEach(node => {
                            if (node.nodeType === 1) { // Element node
                                const images = node.tagName === 'IMG' ? [node] : node.querySelectorAll('img');
                                images.forEach(img => {
                                    if (!img.dataset.fallbackHandled) {
                                        img.addEventListener('error', (e) => this.handleImageError(e));
                                        img.dataset.fallbackHandled = 'true';
                                    }
                                });
                            }
                        });
                    });
                });
                
                observer.observe(document.body, { childList: true, subtree: true });
            }
        },
        
        handleImageError(event) {
            const img = event.target;
            const src = img.src;
            
            console.log('Image failed to load:', src);
            
            // Try to determine category from path
            const category = this.extractCategoryFromPath(src);
            const personName = this.extractPersonNameFromPath(src);
            
            // Create placeholder element
            const placeholder = this.createPlaceholder(category, personName);
            
            // Replace image with placeholder
            img.parentNode.replaceChild(placeholder, img);
        },
        
        extractCategoryFromPath(path) {
            const match = path.match(/\/people\/([^\/]+)\//);
            return match ? match[1] : 'core';
        },
        
        extractPersonNameFromPath(path) {
            const filename = path.split('/').pop();
            const nameMatch = filename.match(/^([^-]+)/);
            if (nameMatch) {
                return nameMatch[1].replace(/[-_]/g, ' ').replace(/\w\S*/g, 
                    txt => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
            }
            return 'Unknown Person';
        },
        
        createPlaceholder(category, personName) {
            const placeholder = document.createElement('div');
            const emoji = this.placeholders[category] || '👤';
            
            placeholder.className = 'photo-placeholder';
            placeholder.style.cssText = `
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                background: linear-gradient(135deg, #2d2d2d, #3d3d3d);
                border: 2px solid #ff6b6b;
                border-radius: 8px;
                color: white;
                font-size: 14px;
                text-align: center;
                padding: 20px;
                min-width: 120px;
                min-height: 120px;
                box-sizing: border-box;
            `;
            
            placeholder.innerHTML = `
                <div style="font-size: 2em; margin-bottom: 10px;">${emoji}</div>
                <div style="font-weight: bold; margin-bottom: 5px;">${personName}</div>
                <div style="font-size: 0.8em; opacity: 0.7;">Photo Not Available</div>
            `;
            
            return placeholder;
        },
        
        createPhotoManifest() {
            // Create a list of expected photos for debugging
            const expectedPhotos = {
                core: ['jeffrey-epstein', 'ghislaine-maxwell', 'donald-trump', 'bill-clinton'],
                politicians: ['alan-dershowitz', 'alex-acosta', 'ehud-barak', 'hillary-clinton', 'vladimir-putin'],
                royalty: ['prince-andrew', 'mohammed-bin-salman'],
                business: ['bill-gates', 'elon-musk', 'glenn-dubin', 'leon-black', 'les-wexner'],
                celebrities: ['chris-tucker', 'kevin-spacey', 'michael-wolff', 'mick-jagger', 'woody-allen'],
                enablers: ['jean-luc-brunel', 'sarah-kellen'],
                victims: ['virginia-giuffre'],
                academics: ['george-church', 'marvin-minsky', 'stephen-hawking', 'steven-pinker']
            };
            
            const manifest = {
                timestamp: new Date().toISOString(),
                expectedPhotos: expectedPhotos,
                availablePhotos: {},
                missingPhotos: {}
            };
            
            // Check which photos are available
            Object.keys(expectedPhotos).forEach(category => {
                manifest.availablePhotos[category] = [];
                manifest.missingPhotos[category] = [];
                
                expectedPhotos[category].forEach(person => {
                    const photoPath = `images/people/${category}/${person}.jpg`;
                    
                    // Create a test image to check if it exists
                    const testImg = new Image();
                    testImg.onload = () => {
                        manifest.availablePhotos[category].push(person);
                    };
                    testImg.onerror = () => {
                        manifest.missingPhotos[category].push(person);
                    };
                    testImg.src = photoPath;
                });
            });
            
            // Make manifest available globally
            window.photoManifest = manifest;
            
            setTimeout(() => {
                console.log('Photo Manifest:', manifest);
            }, 2000);
        }
    };
    
    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => PhotoFallback.init());
    } else {
        PhotoFallback.init();
    }
    
    // Export for global access
    window.PhotoFallback = PhotoFallback;
    
})();