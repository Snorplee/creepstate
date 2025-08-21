/**
 * Universal Photo Components for Trump-Epstein Investigation
 * Reusable photo display components with zoom, metadata, and investigation features
 */

class PhotoComponent {
    constructor() {
        this.photoDatabase = window.photoDatabase;
        this.currentModal = null;
        this.currentGallery = null;
        this.zoomLevel = 1;
        this.initializeStyles();
    }

    initializeStyles() {
        // Only add styles if not already present
        if (document.getElementById('photo-component-styles')) return;

        const styles = document.createElement('style');
        styles.id = 'photo-component-styles';
        styles.textContent = `
            /* Photo Component Styles */
            .photo-container {
                position: relative;
                display: inline-block;
                cursor: pointer;
                overflow: hidden;
                border-radius: 8px;
                transition: all 0.3s ease;
            }

            .photo-container:hover {
                transform: scale(1.05);
                box-shadow: 0 8px 25px rgba(0,0,0,0.3);
            }

            .photo-img {
                width: 100%;
                height: 100%;
                object-fit: cover;
                transition: all 0.3s ease;
            }

            .photo-overlay {
                position: absolute;
                bottom: 0;
                left: 0;
                right: 0;
                background: linear-gradient(transparent, rgba(0,0,0,0.8));
                color: white;
                padding: 15px;
                transform: translateY(100%);
                transition: transform 0.3s ease;
            }

            .photo-container:hover .photo-overlay {
                transform: translateY(0);
            }

            .photo-title {
                font-weight: bold;
                margin-bottom: 5px;
            }

            .photo-meta {
                font-size: 0.8em;
                opacity: 0.9;
            }

            .evidence-badge {
                position: absolute;
                top: 10px;
                right: 10px;
                padding: 4px 8px;
                border-radius: 12px;
                font-size: 0.7em;
                font-weight: bold;
                text-transform: uppercase;
            }

            .evidence-confirmed { background: #8B0000; color: white; }
            .evidence-documented { background: #FF4500; color: white; }
            .evidence-alleged { background: #FFD700; color: black; }
            .evidence-suspected { background: #696969; color: white; }

            /* Photo Modal */
            .photo-modal {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0,0,0,0.95);
                z-index: 10000;
                display: flex;
                justify-content: center;
                align-items: center;
                opacity: 0;
                visibility: hidden;
                transition: all 0.3s ease;
            }

            .photo-modal.active {
                opacity: 1;
                visibility: visible;
            }

            .photo-modal-content {
                position: relative;
                max-width: 90vw;
                max-height: 90vh;
                background: #1a1a1a;
                border-radius: 10px;
                overflow: hidden;
                display: flex;
                box-shadow: 0 20px 60px rgba(0,0,0,0.5);
            }

            .photo-modal-image {
                max-width: 70vw;
                max-height: 90vh;
                object-fit: contain;
                cursor: zoom-in;
            }

            .photo-modal-image.zoomed {
                cursor: zoom-out;
                transform-origin: center;
            }

            .photo-modal-sidebar {
                width: 350px;
                padding: 20px;
                background: #2d2d2d;
                overflow-y: auto;
                color: white;
            }

            .photo-modal-close {
                position: absolute;
                top: 20px;
                right: 20px;
                background: rgba(255,255,255,0.2);
                border: none;
                color: white;
                font-size: 24px;
                width: 40px;
                height: 40px;
                border-radius: 50%;
                cursor: pointer;
                z-index: 10001;
                transition: background 0.3s ease;
            }

            .photo-modal-close:hover {
                background: rgba(255,255,255,0.3);
            }

            .photo-info-section {
                margin-bottom: 20px;
                padding-bottom: 15px;
                border-bottom: 1px solid #444;
            }

            .photo-info-title {
                color: #ff6b6b;
                font-size: 1.1em;
                font-weight: bold;
                margin-bottom: 10px;
            }

            .photo-tags {
                display: flex;
                flex-wrap: wrap;
                gap: 5px;
                margin-top: 10px;
            }

            .photo-tag {
                background: #ff6b6b;
                color: white;
                padding: 2px 8px;
                border-radius: 12px;
                font-size: 0.7em;
                cursor: pointer;
            }

            .cross-reference {
                background: rgba(255,255,255,0.1);
                padding: 10px;
                margin: 5px 0;
                border-radius: 5px;
                cursor: pointer;
                transition: background 0.3s ease;
            }

            .cross-reference:hover {
                background: rgba(255,255,255,0.2);
            }

            /* Photo Gallery Grid */
            .photo-gallery {
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
                gap: 15px;
                margin: 20px 0;
            }

            .photo-gallery.compact {
                grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
                gap: 10px;
            }

            .photo-gallery.large {
                grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
                gap: 20px;
            }

            /* Photo Search Interface */
            .photo-search {
                background: #2d2d2d;
                padding: 20px;
                border-radius: 10px;
                margin-bottom: 20px;
            }

            .photo-search-input {
                width: 100%;
                padding: 12px;
                border: 2px solid #ff6b6b;
                border-radius: 25px;
                background: #1a1a1a;
                color: white;
                font-size: 1em;
                margin-bottom: 15px;
            }

            .photo-filters {
                display: flex;
                flex-wrap: wrap;
                gap: 10px;
                margin-bottom: 15px;
            }

            .photo-filter {
                background: rgba(255,107,107,0.2);
                border: 1px solid #ff6b6b;
                color: white;
                padding: 8px 15px;
                border-radius: 20px;
                cursor: pointer;
                transition: all 0.3s ease;
            }

            .photo-filter.active {
                background: #ff6b6b;
            }

            /* Profile Photo Integration */
            .profile-photo {
                width: 120px;
                height: 120px;
                border-radius: 50%;
                object-fit: cover;
                border: 3px solid;
                cursor: pointer;
                transition: all 0.3s ease;
            }

            .profile-photo:hover {
                transform: scale(1.1);
                box-shadow: 0 8px 25px rgba(0,0,0,0.3);
            }

            /* Network Node Photos */
            .network-node-photo {
                width: 60px;
                height: 60px;
                border-radius: 50%;
                object-fit: cover;
                border: 2px solid white;
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
            }

            /* Timeline Event Photos */
            .timeline-photo {
                width: 80px;
                height: 80px;
                border-radius: 8px;
                object-fit: cover;
                margin: 5px;
                cursor: pointer;
                transition: all 0.3s ease;
            }

            .timeline-photo:hover {
                transform: scale(1.2);
                z-index: 100;
            }

            /* Photo Loading States */
            .photo-loading {
                background: linear-gradient(90deg, #333 25%, #444 50%, #333 75%);
                background-size: 200% 100%;
                animation: loading 1.5s infinite;
            }

            .photo-error {
                background: #444;
                display: flex;
                align-items: center;
                justify-content: center;
                color: #999;
                font-size: 0.8em;
            }

            @keyframes loading {
                0% { background-position: 200% 0; }
                100% { background-position: -200% 0; }
            }

            /* Responsive Design */
            @media (max-width: 768px) {
                .photo-modal-content {
                    flex-direction: column;
                    max-width: 95vw;
                    max-height: 95vh;
                }

                .photo-modal-sidebar {
                    width: 100%;
                    max-height: 300px;
                }

                .photo-gallery {
                    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
                }
            }
        `;
        document.head.appendChild(styles);
    }

    // Create a photo thumbnail with hover effects
    createPhotoThumbnail(photoData, options = {}) {
        const {
            size = 'medium',
            showOverlay = true,
            showBadge = true,
            customClass = ''
        } = options;

        const container = document.createElement('div');
        container.className = `photo-container ${size} ${customClass}`;
        
        const img = document.createElement('img');
        img.className = 'photo-img';
        img.src = this.getPhotoPath(photoData);
        img.alt = photoData.description || photoData.person?.name || 'Investigation Photo';
        img.loading = 'lazy';

        // Add error handling
        img.onerror = () => {
            container.innerHTML = '<div class="photo-error">📷 Photo not found</div>';
        };

        // Add loading state
        img.onload = () => {
            container.classList.remove('photo-loading');
        };

        container.classList.add('photo-loading');
        container.appendChild(img);

        // Evidence level badge
        if (showBadge && photoData.evidenceLevel) {
            const badge = document.createElement('div');
            badge.className = `evidence-badge evidence-${photoData.evidenceLevel}`;
            badge.textContent = photoData.evidenceLevel.toUpperCase();
            container.appendChild(badge);
        }

        // Hover overlay
        if (showOverlay) {
            const overlay = document.createElement('div');
            overlay.className = 'photo-overlay';
            
            const title = document.createElement('div');
            title.className = 'photo-title';
            title.textContent = photoData.person?.name || photoData.description || 'Investigation Photo';
            
            const meta = document.createElement('div');
            meta.className = 'photo-meta';
            meta.textContent = `${photoData.date || 'Date unknown'} • ${photoData.source || 'Unknown source'}`;
            
            overlay.appendChild(title);
            overlay.appendChild(meta);
            container.appendChild(overlay);
        }

        // Click to open modal
        container.addEventListener('click', () => {
            this.openPhotoModal(photoData);
        });

        return container;
    }

    // Create a profile photo specifically for person cards
    createProfilePhoto(personId, options = {}) {
        const photos = this.photoDatabase.getPhotosByPerson(personId);
        const profilePhoto = photos.find(p => p.type === 'official') || photos[0];
        
        if (!profilePhoto) {
            return this.createPlaceholderPhoto(personId, options);
        }

        const {
            size = 120,
            borderColor = 'var(--primary-color)'
        } = options;

        const img = document.createElement('img');
        img.className = 'profile-photo';
        img.src = this.getPhotoPath(profilePhoto);
        img.alt = profilePhoto.person?.name || 'Profile Photo';
        img.style.width = `${size}px`;
        img.style.height = `${size}px`;
        img.style.borderColor = borderColor;

        img.addEventListener('click', () => {
            this.openPhotoModal(profilePhoto);
        });

        return img;
    }

    // Create placeholder for missing photos
    createPlaceholderPhoto(personId, options = {}) {
        const { size = 120 } = options;
        const person = this.photoDatabase.people.get(personId);
        
        const placeholder = document.createElement('div');
        placeholder.className = 'profile-photo photo-error';
        placeholder.style.width = `${size}px`;
        placeholder.style.height = `${size}px`;
        placeholder.style.display = 'flex';
        placeholder.style.alignItems = 'center';
        placeholder.style.justifyContent = 'center';
        placeholder.style.fontSize = '24px';
        placeholder.textContent = person?.name?.charAt(0) || '?';

        return placeholder;
    }

    // Create a photo gallery
    createPhotoGallery(photos, options = {}) {
        const {
            layout = 'grid',
            size = 'medium',
            showSearch = true,
            showFilters = true
        } = options;

        const container = document.createElement('div');
        container.className = 'photo-gallery-container';

        // Search and filters
        if (showSearch || showFilters) {
            const searchContainer = this.createSearchInterface(photos, options);
            container.appendChild(searchContainer);
        }

        // Gallery grid
        const gallery = document.createElement('div');
        gallery.className = `photo-gallery ${size}`;
        gallery.id = 'photo-gallery-grid';

        this.populateGallery(gallery, photos, options);
        container.appendChild(gallery);

        return container;
    }

    // Create search and filter interface
    createSearchInterface(photos, options) {
        const searchContainer = document.createElement('div');
        searchContainer.className = 'photo-search';

        // Search input
        const searchInput = document.createElement('input');
        searchInput.className = 'photo-search-input';
        searchInput.type = 'text';
        searchInput.placeholder = '🔍 Search photos by description, person, or tags...';

        searchInput.addEventListener('input', (e) => {
            const query = e.target.value;
            const filtered = query ? this.photoDatabase.searchPhotos(query) : photos;
            this.updateGallery(filtered, options);
        });

        searchContainer.appendChild(searchInput);

        // Filter buttons
        const filtersContainer = document.createElement('div');
        filtersContainer.className = 'photo-filters';

        const filters = [
            { label: 'All', value: 'all' },
            { label: 'Confirmed', value: 'confirmed' },
            { label: 'Documented', value: 'documented' },
            { label: 'Social Events', value: 'social' },
            { label: 'Official Photos', value: 'official' },
            { label: 'Evidence', value: 'evidence' }
        ];

        filters.forEach(filter => {
            const button = document.createElement('button');
            button.className = 'photo-filter';
            button.textContent = filter.label;
            button.dataset.value = filter.value;

            if (filter.value === 'all') {
                button.classList.add('active');
            }

            button.addEventListener('click', () => {
                // Update active state
                filtersContainer.querySelectorAll('.photo-filter').forEach(b => 
                    b.classList.remove('active')
                );
                button.classList.add('active');

                // Filter photos
                let filtered = photos;
                if (filter.value !== 'all') {
                    filtered = photos.filter(photo => 
                        photo.evidenceLevel === filter.value || photo.type === filter.value
                    );
                }
                this.updateGallery(filtered, options);
            });

            filtersContainer.appendChild(button);
        });

        searchContainer.appendChild(filtersContainer);
        return searchContainer;
    }

    // Populate gallery with photos
    populateGallery(gallery, photos, options) {
        gallery.innerHTML = '';
        
        photos.forEach(photo => {
            const thumbnail = this.createPhotoThumbnail(photo, options);
            gallery.appendChild(thumbnail);
        });
    }

    // Update gallery with new photos
    updateGallery(photos, options) {
        const gallery = document.getElementById('photo-gallery-grid');
        if (gallery) {
            this.populateGallery(gallery, photos, options);
        }
    }

    // Open photo in modal with detailed information
    openPhotoModal(photoData) {
        const modal = document.createElement('div');
        modal.className = 'photo-modal';
        
        const content = document.createElement('div');
        content.className = 'photo-modal-content';

        // Close button
        const closeBtn = document.createElement('button');
        closeBtn.className = 'photo-modal-close';
        closeBtn.innerHTML = '×';
        closeBtn.addEventListener('click', () => this.closePhotoModal());

        // Main image
        const img = document.createElement('img');
        img.className = 'photo-modal-image';
        img.src = this.getPhotoPath(photoData);
        img.alt = photoData.description;

        // Zoom functionality
        let isZoomed = false;
        img.addEventListener('click', () => {
            if (isZoomed) {
                img.style.transform = 'scale(1)';
                img.classList.remove('zoomed');
            } else {
                img.style.transform = 'scale(2)';
                img.classList.add('zoomed');
            }
            isZoomed = !isZoomed;
        });

        // Sidebar with information
        const sidebar = this.createPhotoSidebar(photoData);

        content.appendChild(img);
        content.appendChild(sidebar);
        modal.appendChild(closeBtn);
        modal.appendChild(content);

        document.body.appendChild(modal);
        
        // Activate modal
        setTimeout(() => modal.classList.add('active'), 10);

        // Close on escape or background click
        document.addEventListener('keydown', this.handleModalKeydown);
        modal.addEventListener('click', (e) => {
            if (e.target === modal) this.closePhotoModal();
        });

        this.currentModal = modal;
    }

    // Create detailed sidebar for photo modal
    createPhotoSidebar(photoData) {
        const sidebar = document.createElement('div');
        sidebar.className = 'photo-modal-sidebar';

        // Basic Information
        const basicInfo = document.createElement('div');
        basicInfo.className = 'photo-info-section';
        basicInfo.innerHTML = `
            <div class="photo-info-title">📸 Photo Information</div>
            <div><strong>Description:</strong> ${photoData.description || 'No description'}</div>
            <div><strong>Date:</strong> ${photoData.date || 'Unknown'}</div>
            <div><strong>Source:</strong> ${photoData.source || 'Unknown'}</div>
            <div><strong>Type:</strong> ${photoData.type || 'Unknown'}</div>
            <div><strong>Evidence Level:</strong> <span class="evidence-badge evidence-${photoData.evidenceLevel}">${photoData.evidenceLevel?.toUpperCase()}</span></div>
        `;

        // Person Information
        if (photoData.person) {
            const personInfo = document.createElement('div');
            personInfo.className = 'photo-info-section';
            personInfo.innerHTML = `
                <div class="photo-info-title">👤 Person Details</div>
                <div><strong>Name:</strong> ${photoData.person.name}</div>
                <div><strong>Category:</strong> ${photoData.person.category}</div>
                <div><strong>Description:</strong> ${photoData.person.description || 'No description'}</div>
            `;
            sidebar.appendChild(personInfo);
        }

        sidebar.appendChild(basicInfo);

        // Tags
        if (photoData.tags && photoData.tags.length > 0) {
            const tagsSection = document.createElement('div');
            tagsSection.className = 'photo-info-section';
            
            const tagsTitle = document.createElement('div');
            tagsTitle.className = 'photo-info-title';
            tagsTitle.textContent = '🏷️ Tags';
            
            const tagsContainer = document.createElement('div');
            tagsContainer.className = 'photo-tags';
            
            photoData.tags.forEach(tag => {
                const tagElement = document.createElement('span');
                tagElement.className = 'photo-tag';
                tagElement.textContent = tag;
                tagElement.addEventListener('click', () => {
                    this.closePhotoModal();
                    // Trigger search for this tag
                    const searchInput = document.querySelector('.photo-search-input');
                    if (searchInput) {
                        searchInput.value = tag;
                        searchInput.dispatchEvent(new Event('input'));
                    }
                });
                tagsContainer.appendChild(tagElement);
            });
            
            tagsSection.appendChild(tagsTitle);
            tagsSection.appendChild(tagsContainer);
            sidebar.appendChild(tagsSection);
        }

        // Cross References
        const crossRefs = this.photoDatabase.getCrossReferences(photoData.id);
        if (crossRefs.length > 0) {
            const crossRefsSection = document.createElement('div');
            crossRefsSection.className = 'photo-info-section';
            
            const title = document.createElement('div');
            title.className = 'photo-info-title';
            title.textContent = '🔗 Related Photos';
            crossRefsSection.appendChild(title);

            crossRefs.slice(0, 5).forEach(ref => {
                const refElement = document.createElement('div');
                refElement.className = 'cross-reference';
                refElement.innerHTML = `
                    <div><strong>${ref.person?.name || 'Unknown'}</strong></div>
                    <div style="font-size: 0.8em; opacity: 0.8;">${ref.photo.description}</div>
                    <div style="font-size: 0.7em; color: #ff6b6b;">Common: ${ref.commonElements?.join(', ')}</div>
                `;
                
                refElement.addEventListener('click', () => {
                    this.closePhotoModal();
                    this.openPhotoModal(ref.photo);
                });
                
                crossRefsSection.appendChild(refElement);
            });

            sidebar.appendChild(crossRefsSection);
        }

        return sidebar;
    }

    // Close photo modal
    closePhotoModal() {
        if (this.currentModal) {
            this.currentModal.classList.remove('active');
            setTimeout(() => {
                document.body.removeChild(this.currentModal);
                this.currentModal = null;
            }, 300);
            
            document.removeEventListener('keydown', this.handleModalKeydown);
        }
    }

    // Handle keyboard events for modal
    handleModalKeydown = (e) => {
        if (e.key === 'Escape') {
            this.closePhotoModal();
        }
    }

    // Get the correct path for a photo
    getPhotoPath(photoData) {
        if (photoData.filename.startsWith('http')) {
            return photoData.filename;
        }
        
        // Construct path based on person category
        const person = photoData.person || this.photoDatabase.people.get(photoData.personId);
        const category = person?.category || 'general';
        
        return `images/people/${category}/${photoData.filename}`;
    }

    // Create a mini photo widget for timeline events
    createTimelinePhotoWidget(eventData) {
        const container = document.createElement('div');
        container.className = 'timeline-photos';
        
        // Find relevant photos for this event
        const relevantPhotos = this.findEventPhotos(eventData);
        
        relevantPhotos.slice(0, 3).forEach(photo => {
            const img = document.createElement('img');
            img.className = 'timeline-photo';
            img.src = this.getPhotoPath(photo);
            img.alt = photo.description;
            img.title = `${photo.person?.name || 'Unknown'} - ${photo.description}`;
            
            img.addEventListener('click', () => {
                this.openPhotoModal(photo);
            });
            
            container.appendChild(img);
        });

        return container;
    }

    // Find photos relevant to a timeline event
    findEventPhotos(eventData) {
        const photos = [];
        const eventDate = new Date(eventData.date);
        const eventKeywords = (eventData.title + ' ' + eventData.description).toLowerCase();

        this.photoDatabase.photos.forEach(photo => {
            const photoDate = new Date(photo.date);
            const timeDiff = Math.abs(eventDate - photoDate);
            const daysDiff = timeDiff / (1000 * 60 * 60 * 24);

            // Include photos within 30 days of event or with matching keywords
            if (daysDiff <= 30 || photo.tags?.some(tag => eventKeywords.includes(tag))) {
                photos.push(photo);
            }
        });

        return photos.sort((a, b) => {
            const aDate = new Date(a.date);
            const bDate = new Date(b.date);
            return Math.abs(eventDate - aDate) - Math.abs(eventDate - bDate);
        });
    }

    // Create photo grid for network visualization nodes
    createNetworkNodePhoto(personId) {
        const photos = this.photoDatabase.getPhotosByPerson(personId);
        const profilePhoto = photos.find(p => p.type === 'official') || photos[0];
        
        if (!profilePhoto) {
            return null;
        }

        const img = document.createElement('img');
        img.className = 'network-node-photo';
        img.src = this.getPhotoPath(profilePhoto);
        img.alt = profilePhoto.person?.name;
        
        return img;
    }

    // Batch load photos for performance
    batchLoadPhotos(photoIds, callback) {
        const loaded = [];
        let loadedCount = 0;

        photoIds.forEach(photoId => {
            const photo = this.photoDatabase.photos.get(photoId);
            if (photo) {
                const img = new Image();
                img.onload = () => {
                    loadedCount++;
                    loaded.push({ id: photoId, photo, element: img });
                    if (loadedCount === photoIds.length) {
                        callback(loaded);
                    }
                };
                img.src = this.getPhotoPath(photo);
            }
        });
    }
}

// Global instance
window.photoComponent = new PhotoComponent();

// Utility functions for easy integration
window.addPhotoToElement = function(elementId, photoData, options = {}) {
    const element = document.getElementById(elementId);
    if (element && photoData) {
        const photo = window.photoComponent.createPhotoThumbnail(photoData, options);
        element.appendChild(photo);
    }
};

window.addProfilePhotoToElement = function(elementId, personId, options = {}) {
    const element = document.getElementById(elementId);
    if (element) {
        const photo = window.photoComponent.createProfilePhoto(personId, options);
        element.appendChild(photo);
    }
};

window.addPhotoGalleryToElement = function(elementId, photos, options = {}) {
    const element = document.getElementById(elementId);
    if (element && photos) {
        const gallery = window.photoComponent.createPhotoGallery(photos, options);
        element.appendChild(gallery);
    }
};

// Export for module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PhotoComponent;
}