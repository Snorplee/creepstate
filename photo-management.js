/**
 * Photo Management and Evidence Correlation System
 * Advanced photo organization, verification, and evidence analysis
 */

class PhotoManagementSystem {
    constructor() {
        this.photoDatabase = window.photoDatabase;
        this.investigationTools = window.investigationTools;
        this.verificationQueue = [];
        this.correlationIndex = new Map();
        this.duplicateDetection = new Map();
        this.metadataExtractor = new Map();
        
        this.initializeManagementSystem();
    }

    initializeManagementSystem() {
        this.buildCorrelationIndex();
        this.setupVerificationSystem();
        this.initializeDuplicateDetection();
        this.setupPhotoMetadataExtraction();
        
        console.log('Photo management system initialized');
    }

    buildCorrelationIndex() {
        if (!this.photoDatabase) return;

        // Build comprehensive correlation index
        this.photoDatabase.photos.forEach((photo, photoId) => {
            const correlations = {
                temporal: [],     // Photos from same time period
                spatial: [],      // Photos from same location
                social: [],       // Photos from same social events
                evidential: [],   // Photos with legal/court connections
                facial: [],       // Photos showing same people
                contextual: []    // Photos with similar context/tags
            };

            // Find temporal correlations (same day/event)
            if (photo.date) {
                const photoDate = new Date(photo.date);
                this.photoDatabase.photos.forEach((otherPhoto, otherPhotoId) => {
                    if (photoId === otherPhotoId || !otherPhoto.date) return;
                    
                    const otherDate = new Date(otherPhoto.date);
                    const timeDiff = Math.abs(photoDate - otherDate);
                    const daysDiff = timeDiff / (1000 * 60 * 60 * 24);
                    
                    if (daysDiff <= 1) { // Same day or next day
                        correlations.temporal.push({
                            photo: otherPhoto,
                            strength: daysDiff === 0 ? 1.0 : 0.8,
                            type: 'temporal',
                            description: `Same ${daysDiff === 0 ? 'day' : 'timeframe'}`
                        });
                    }
                });
            }

            // Find spatial correlations (same location)
            const location = this.extractLocationFromPhoto(photo);
            if (location) {
                this.photoDatabase.photos.forEach((otherPhoto, otherPhotoId) => {
                    if (photoId === otherPhotoId) return;
                    
                    const otherLocation = this.extractLocationFromPhoto(otherPhoto);
                    if (otherLocation === location) {
                        correlations.spatial.push({
                            photo: otherPhoto,
                            strength: 0.9,
                            type: 'spatial',
                            description: `Same location: ${location}`
                        });
                    }
                });
            }

            // Find social correlations (same events/parties)
            const socialTags = photo.tags?.filter(tag => 
                ['party', 'social', 'event', 'wedding', 'dinner', 'meeting'].includes(tag)
            ) || [];
            
            if (socialTags.length > 0) {
                this.photoDatabase.photos.forEach((otherPhoto, otherPhotoId) => {
                    if (photoId === otherPhotoId) return;
                    
                    const otherSocialTags = otherPhoto.tags?.filter(tag => socialTags.includes(tag)) || [];
                    if (otherSocialTags.length > 0) {
                        correlations.social.push({
                            photo: otherPhoto,
                            strength: otherSocialTags.length / socialTags.length,
                            type: 'social',
                            description: `Shared social context: ${otherSocialTags.join(', ')}`
                        });
                    }
                });
            }

            // Find evidential correlations (court/legal connections)
            if (photo.evidenceLevel === 'confirmed' || photo.type === 'evidence' || photo.source_type === 'court_evidence') {
                this.photoDatabase.photos.forEach((otherPhoto, otherPhotoId) => {
                    if (photoId === otherPhotoId) return;
                    
                    if (otherPhoto.evidenceLevel === 'confirmed' || otherPhoto.type === 'evidence' || otherPhoto.source_type === 'court_evidence') {
                        correlations.evidential.push({
                            photo: otherPhoto,
                            strength: 1.0,
                            type: 'evidential',
                            description: 'Both are confirmed evidence'
                        });
                    }
                });
            }

            // Find contextual correlations (similar tags/descriptions)
            if (photo.tags && photo.tags.length > 0) {
                this.photoDatabase.photos.forEach((otherPhoto, otherPhotoId) => {
                    if (photoId === otherPhotoId || !otherPhoto.tags) return;
                    
                    const commonTags = photo.tags.filter(tag => otherPhoto.tags.includes(tag));
                    if (commonTags.length >= 2) { // At least 2 common tags
                        correlations.contextual.push({
                            photo: otherPhoto,
                            strength: commonTags.length / Math.max(photo.tags.length, otherPhoto.tags.length),
                            type: 'contextual',
                            description: `Common elements: ${commonTags.join(', ')}`
                        });
                    }
                });
            }

            this.correlationIndex.set(photoId, correlations);
        });
    }

    extractLocationFromPhoto(photo) {
        const knownLocations = [
            'mar-a-lago', 'little-st-james', 'manhattan', 'palm-beach',
            'new-york', 'london', 'paris', 'windsor', 'ranch', 'island',
            'nyc', 'miami', 'florida', 'uk', 'france', 'virgin-islands'
        ];

        const text = (photo.description + ' ' + (photo.tags?.join(' ') || '')).toLowerCase();
        
        for (const location of knownLocations) {
            if (text.includes(location)) {
                return location;
            }
        }
        
        return null;
    }

    setupVerificationSystem() {
        // Create verification workflow for photos
        this.verificationCriteria = {
            source_reliability: {
                'court_evidence': 1.0,
                'fbi': 1.0,
                'government': 0.9,
                'news_archive': 0.8,
                'wikipedia': 0.7,
                'social_media': 0.5,
                'anonymous': 0.2
            },
            evidence_markers: {
                'watermark': 0.8,
                'metadata': 0.9,
                'provenance': 1.0,
                'witness_confirmation': 0.9,
                'media_coverage': 0.7
            }
        };

        // Queue photos for verification
        this.photoDatabase.photos.forEach((photo, photoId) => {
            if (photo.verification_status === 'unverified') {
                this.verificationQueue.push({
                    photoId: photoId,
                    photo: photo,
                    priority: this.calculateVerificationPriority(photo)
                });
            }
        });

        // Sort by priority
        this.verificationQueue.sort((a, b) => b.priority - a.priority);
    }

    calculateVerificationPriority(photo) {
        let priority = 0;

        // Evidence level priority
        const evidencePriority = {
            'confirmed': 10,
            'documented': 8,
            'alleged': 5,
            'suspected': 3
        };
        priority += evidencePriority[photo.evidenceLevel] || 0;

        // Source reliability
        const sourceReliability = this.verificationCriteria.source_reliability[photo.source_type] || 0.5;
        priority += sourceReliability * 5;

        // Person importance (core network = higher priority)
        const person = this.photoDatabase.people.get(photo.personId);
        if (person) {
            const categoryPriority = {
                'core': 15,
                'politicians': 12,
                'enablers': 10,
                'royalty': 8,
                'business': 6,
                'celebrities': 4,
                'academics': 3,
                'victims': 12 // High priority for victim evidence
            };
            priority += categoryPriority[person.category] || 0;
        }

        // Correlations (more correlations = higher priority)
        const correlations = this.correlationIndex.get(photo.id);
        if (correlations) {
            const totalCorrelations = Object.values(correlations).reduce((sum, arr) => sum + arr.length, 0);
            priority += Math.min(totalCorrelations, 10); // Cap at 10
        }

        return priority;
    }

    initializeDuplicateDetection() {
        // Simple duplicate detection based on file hashes and similarity
        this.photoDatabase.photos.forEach((photo, photoId) => {
            if (photo.file_hash) {
                if (this.duplicateDetection.has(photo.file_hash)) {
                    const existing = this.duplicateDetection.get(photo.file_hash);
                    existing.push(photoId);
                } else {
                    this.duplicateDetection.set(photo.file_hash, [photoId]);
                }
            }
        });
    }

    setupPhotoMetadataExtraction() {
        // Extract additional metadata from photos
        this.photoDatabase.photos.forEach((photo, photoId) => {
            const metadata = this.extractPhotoMetadata(photo);
            this.metadataExtractor.set(photoId, metadata);
        });
    }

    extractPhotoMetadata(photo) {
        const metadata = {
            quality_score: 0,
            content_analysis: {},
            technical_details: {},
            verification_markers: []
        };

        // Quality scoring based on available information
        if (photo.date) metadata.quality_score += 20;
        if (photo.source && photo.source !== 'unknown') metadata.quality_score += 15;
        if (photo.description && photo.description.length > 10) metadata.quality_score += 10;
        if (photo.tags && photo.tags.length > 0) metadata.quality_score += 15;
        if (photo.evidenceLevel === 'confirmed') metadata.quality_score += 30;
        else if (photo.evidenceLevel === 'documented') metadata.quality_score += 20;

        // Content analysis
        metadata.content_analysis = {
            has_people: photo.tags?.includes('people') || false,
            is_social_event: photo.tags?.some(tag => ['party', 'event', 'social'].includes(tag)) || false,
            is_official: photo.type === 'official' || photo.source_type === 'government',
            is_evidence: photo.type === 'evidence' || photo.evidenceLevel === 'confirmed',
            location_identified: this.extractLocationFromPhoto(photo) !== null
        };

        // Verification markers
        if (photo.source_type === 'court_evidence') metadata.verification_markers.push('court_document');
        if (photo.source === 'FBI') metadata.verification_markers.push('fbi_source');
        if (photo.file_hash) metadata.verification_markers.push('integrity_hash');
        if (photo.download_date) metadata.verification_markers.push('provenance_tracked');

        return metadata;
    }

    // Photo Management Interface
    createManagementInterface() {
        // Add management interface to investigation tools
        if (!document.getElementById('investigation-workspace')) return;

        const managementTab = document.createElement('button');
        managementTab.className = 'investigation-tab';
        managementTab.dataset.tab = 'management';
        managementTab.innerHTML = '🛠️ Manage';
        managementTab.style.cssText = `
            background: none;
            border: none;
            color: white;
            padding: 8px 12px;
            cursor: pointer;
            border-bottom: 2px solid transparent;
            font-size: 0.9em;
        `;

        const tabsContainer = document.querySelector('.investigation-tabs');
        if (tabsContainer) {
            tabsContainer.appendChild(managementTab);
            
            managementTab.addEventListener('click', () => {
                document.querySelectorAll('.investigation-tab').forEach(t => {
                    t.classList.remove('active');
                    t.style.borderBottomColor = 'transparent';
                });
                managementTab.classList.add('active');
                managementTab.style.borderBottomColor = 'var(--primary-color)';
                
                this.showManagementTab();
            });
        }
    }

    showManagementTab() {
        const content = document.getElementById('investigation-tab-content');
        if (!content) return;

        const duplicates = Array.from(this.duplicateDetection.entries()).filter(([hash, photos]) => photos.length > 1);
        const unverified = this.verificationQueue.slice(0, 10);
        const highCorrelation = this.findHighCorrelationPhotos();

        content.innerHTML = `
            <div class="management-section">
                <h4 style="color: var(--primary-color); margin-bottom: 10px;">🛠️ Photo Management</h4>
                
                <!-- Management Statistics -->
                <div class="management-stats" style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 15px;">
                    <div style="background: rgba(255,255,255,0.1); padding: 8px; border-radius: 6px; text-align: center;">
                        <div style="font-size: 1.2em; font-weight: bold; color: var(--danger-color);">${duplicates.length}</div>
                        <div style="font-size: 0.7em; opacity: 0.8;">Potential Duplicates</div>
                    </div>
                    <div style="background: rgba(255,255,255,0.1); padding: 8px; border-radius: 6px; text-align: center;">
                        <div style="font-size: 1.2em; font-weight: bold; color: var(--accent-color);">${this.verificationQueue.length}</div>
                        <div style="font-size: 0.7em; opacity: 0.8;">Pending Verification</div>
                    </div>
                    <div style="background: rgba(255,255,255,0.1); padding: 8px; border-radius: 6px; text-align: center;">
                        <div style="font-size: 1.2em; font-weight: bold; color: var(--secondary-color);">${highCorrelation.length}</div>
                        <div style="font-size: 0.7em; opacity: 0.8;">High Correlations</div>
                    </div>
                    <div style="background: rgba(255,255,255,0.1); padding: 8px; border-radius: 6px; text-align: center;">
                        <div style="font-size: 1.2em; font-weight: bold; color: var(--primary-color);">${this.calculateQualityScore()}%</div>
                        <div style="font-size: 0.7em; opacity: 0.8;">Average Quality</div>
                    </div>
                </div>

                <!-- Management Actions -->
                <div class="management-actions" style="margin-bottom: 15px;">
                    <button onclick="photoManagement.runQualityCheck()" style="
                        background: var(--primary-color);
                        color: white;
                        border: none;
                        padding: 6px 12px;
                        border-radius: 12px;
                        cursor: pointer;
                        font-size: 0.8em;
                        margin: 2px;
                    ">🔍 Quality Check</button>
                    <button onclick="photoManagement.detectDuplicates()" style="
                        background: var(--secondary-color);
                        color: white;
                        border: none;
                        padding: 6px 12px;
                        border-radius: 12px;
                        cursor: pointer;
                        font-size: 0.8em;
                        margin: 2px;
                    ">👥 Find Duplicates</button>
                    <button onclick="photoManagement.verifyPhotos()" style="
                        background: var(--accent-color);
                        color: white;
                        border: none;
                        padding: 6px 12px;
                        border-radius: 12px;
                        cursor: pointer;
                        font-size: 0.8em;
                        margin: 2px;
                    ">✅ Verify Queue</button>
                </div>

                <!-- Verification Queue -->
                <div class="verification-section" style="margin-bottom: 15px;">
                    <h5 style="color: var(--accent-color); margin-bottom: 8px; font-size: 0.9em;">⏳ Verification Queue (Top Priority)</h5>
                    <div class="verification-list" style="max-height: 200px; overflow-y: auto;">
                        ${unverified.map(item => `
                            <div class="verification-item" style="
                                display: flex;
                                justify-content: space-between;
                                align-items: center;
                                padding: 6px;
                                margin: 3px 0;
                                background: rgba(255,255,255,0.05);
                                border-radius: 4px;
                                font-size: 0.8em;
                            ">
                                <div style="flex: 1;">
                                    <div style="font-weight: bold;">${item.photo.person?.name || 'Unknown Person'}</div>
                                    <div style="opacity: 0.7; font-size: 0.9em;">${item.photo.description?.substring(0, 30) || 'No description'}...</div>
                                </div>
                                <div style="text-align: right;">
                                    <div style="color: var(--primary-color); font-weight: bold;">P: ${item.priority.toFixed(1)}</div>
                                    <div style="font-size: 0.8em; opacity: 0.7;">${item.photo.evidenceLevel}</div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>

                <!-- High Correlation Alerts -->
                ${highCorrelation.length > 0 ? `
                    <div class="correlation-section">
                        <h5 style="color: var(--secondary-color); margin-bottom: 8px; font-size: 0.9em;">🔗 High Correlation Alerts</h5>
                        <div class="correlation-list" style="max-height: 150px; overflow-y: auto;">
                            ${highCorrelation.slice(0, 5).map(item => `
                                <div class="correlation-item" style="
                                    padding: 6px;
                                    margin: 3px 0;
                                    background: rgba(255,255,255,0.05);
                                    border-radius: 4px;
                                    font-size: 0.8em;
                                    cursor: pointer;
                                " onclick="photoManagement.exploreCorrelation('${item.photoId}')">
                                    <div style="font-weight: bold;">${item.description}</div>
                                    <div style="opacity: 0.7;">Strength: ${(item.strength * 100).toFixed(0)}% • ${item.correlations} connections</div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                ` : ''}
            </div>
        `;
    }

    findHighCorrelationPhotos() {
        const highCorrelations = [];
        
        this.correlationIndex.forEach((correlations, photoId) => {
            const totalCorrelations = Object.values(correlations).reduce((sum, arr) => sum + arr.length, 0);
            const avgStrength = Object.values(correlations).reduce((sum, arr) => {
                return sum + arr.reduce((subSum, item) => subSum + item.strength, 0);
            }, 0) / totalCorrelations;

            if (totalCorrelations >= 3 && avgStrength >= 0.7) {
                const photo = this.photoDatabase.photos.get(photoId);
                if (photo) {
                    highCorrelations.push({
                        photoId: photoId,
                        photo: photo,
                        correlations: totalCorrelations,
                        strength: avgStrength,
                        description: `${photo.person?.name || 'Unknown'} - ${totalCorrelations} strong connections`
                    });
                }
            }
        });

        return highCorrelations.sort((a, b) => (b.correlations * b.strength) - (a.correlations * a.strength));
    }

    calculateQualityScore() {
        const scores = Array.from(this.metadataExtractor.values()).map(metadata => metadata.quality_score);
        const average = scores.reduce((sum, score) => sum + score, 0) / scores.length;
        return Math.round(average);
    }

    // Management Actions
    runQualityCheck() {
        console.log('Running photo quality check...');
        
        const lowQualityPhotos = Array.from(this.metadataExtractor.entries())
            .filter(([photoId, metadata]) => metadata.quality_score < 40)
            .map(([photoId, metadata]) => ({
                photoId,
                photo: this.photoDatabase.photos.get(photoId),
                score: metadata.quality_score
            }));

        alert(`Quality Check Complete!\n\nTotal Photos: ${this.photoDatabase.photos.size}\nLow Quality: ${lowQualityPhotos.length}\nAverage Score: ${this.calculateQualityScore()}%\n\nLow quality photos may need additional verification or metadata.`);
    }

    detectDuplicates() {
        console.log('Detecting duplicate photos...');
        
        const duplicates = Array.from(this.duplicateDetection.entries())
            .filter(([hash, photos]) => photos.length > 1);

        if (duplicates.length > 0) {
            const message = `Found ${duplicates.length} potential duplicate groups:\n\n` +
                duplicates.slice(0, 3).map(([hash, photos]) => {
                    const photoNames = photos.map(id => {
                        const photo = this.photoDatabase.photos.get(id);
                        return photo?.person?.name || 'Unknown';
                    }).join(', ');
                    return `• ${photos.length} photos: ${photoNames}`;
                }).join('\n') +
                (duplicates.length > 3 ? `\n... and ${duplicates.length - 3} more groups` : '');
            
            alert(message);
        } else {
            alert('No duplicate photos detected!');
        }
    }

    verifyPhotos() {
        console.log('Processing verification queue...');
        
        // Simulate verification process
        const processed = Math.min(this.verificationQueue.length, 5);
        
        for (let i = 0; i < processed; i++) {
            const item = this.verificationQueue[i];
            const verificationScore = this.calculateVerificationScore(item.photo);
            
            // Update verification status based on score
            if (verificationScore >= 0.8) {
                item.photo.verification_status = 'verified';
            } else if (verificationScore >= 0.6) {
                item.photo.verification_status = 'partially_verified';
            } else {
                item.photo.verification_status = 'requires_review';
            }
        }

        this.verificationQueue.splice(0, processed);
        
        alert(`Verification Complete!\n\nProcessed: ${processed} photos\nRemaining in queue: ${this.verificationQueue.length}\n\nVerification status updated based on source reliability, metadata quality, and correlation analysis.`);
    }

    calculateVerificationScore(photo) {
        let score = 0;
        
        // Source reliability
        const sourceScore = this.verificationCriteria.source_reliability[photo.source_type] || 0.5;
        score += sourceScore * 0.4; // 40% weight
        
        // Metadata quality
        const metadata = this.metadataExtractor.get(photo.id);
        if (metadata) {
            score += (metadata.quality_score / 100) * 0.3; // 30% weight
        }
        
        // Evidence level
        const evidenceScores = { confirmed: 1.0, documented: 0.8, alleged: 0.5, suspected: 0.3 };
        score += (evidenceScores[photo.evidenceLevel] || 0.3) * 0.2; // 20% weight
        
        // Correlations (more correlations = higher confidence)
        const correlations = this.correlationIndex.get(photo.id);
        if (correlations) {
            const totalCorrelations = Object.values(correlations).reduce((sum, arr) => sum + arr.length, 0);
            score += Math.min(totalCorrelations / 10, 1.0) * 0.1; // 10% weight
        }
        
        return Math.min(score, 1.0);
    }

    exploreCorrelation(photoId) {
        const photo = this.photoDatabase.photos.get(photoId);
        const correlations = this.correlationIndex.get(photoId);
        
        if (photo && this.photoComponent) {
            this.photoComponent.openPhotoModal(photo);
        }
    }

    // Export management data
    exportManagementReport() {
        const report = {
            timestamp: new Date().toISOString(),
            total_photos: this.photoDatabase.photos.size,
            verification_stats: {
                verified: Array.from(this.photoDatabase.photos.values()).filter(p => p.verification_status === 'verified').length,
                unverified: this.verificationQueue.length,
                requires_review: Array.from(this.photoDatabase.photos.values()).filter(p => p.verification_status === 'requires_review').length
            },
            quality_analysis: {
                average_score: this.calculateQualityScore(),
                low_quality_count: Array.from(this.metadataExtractor.values()).filter(m => m.quality_score < 40).length,
                high_quality_count: Array.from(this.metadataExtractor.values()).filter(m => m.quality_score >= 80).length
            },
            duplicate_detection: {
                duplicate_groups: Array.from(this.duplicateDetection.values()).filter(group => group.length > 1).length,
                total_duplicates: Array.from(this.duplicateDetection.values()).reduce((sum, group) => sum + (group.length > 1 ? group.length - 1 : 0), 0)
            },
            correlation_analysis: {
                high_correlation_photos: this.findHighCorrelationPhotos().length,
                total_correlations: Array.from(this.correlationIndex.values()).reduce((sum, corr) => {
                    return sum + Object.values(corr).reduce((subSum, arr) => subSum + arr.length, 0);
                }, 0)
            }
        };

        return report;
    }
}

// Initialize photo management when investigation tools are ready
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => {
        if (window.photoDatabase && window.investigationTools) {
            window.photoManagement = new PhotoManagementSystem();
            
            // Add management interface after a delay to ensure investigation tools are loaded
            setTimeout(() => {
                if (window.photoManagement) {
                    window.photoManagement.createManagementInterface();
                }
            }, 2000);
        }
    }, 1500);
});

// Export for module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PhotoManagementSystem;
}