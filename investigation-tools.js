/**
 * TheyrRule.net-style Investigation Tools
 * Advanced photo analysis, relationship mapping, and evidence correlation
 */

class InvestigationTools {
    constructor() {
        this.photoDatabase = window.photoDatabase;
        this.photoComponent = window.photoComponent;
        this.relationshipMap = new Map();
        this.evidenceChains = new Map();
        this.investigationHistory = [];
        this.bookmarks = new Set();
        
        this.initializeInvestigationFeatures();
    }

    initializeInvestigationFeatures() {
        // Build relationship networks
        this.buildRelationshipMap();
        
        // Initialize evidence chains
        this.buildEvidenceChains();
        
        // Setup investigation workspace
        this.setupInvestigationWorkspace();
        
        console.log('Investigation tools initialized');
    }

    buildRelationshipMap() {
        if (!this.photoDatabase) return;

        // Analyze photos to build relationship networks
        this.photoDatabase.photos.forEach((photo, photoId) => {
            const person = this.photoDatabase.people.get(photo.personId);
            if (!person) return;

            // Initialize person in relationship map
            if (!this.relationshipMap.has(photo.personId)) {
                this.relationshipMap.set(photo.personId, {
                    person: person,
                    connections: new Map(),
                    photos: [],
                    evidenceLevel: person.evidenceLevel || 'suspected',
                    categories: new Set([person.category])
                });
            }

            const personData = this.relationshipMap.get(photo.personId);
            personData.photos.push(photo);

            // Find connections through shared tags, dates, and locations
            this.photoDatabase.photos.forEach((otherPhoto, otherPhotoId) => {
                if (photoId === otherPhotoId) return;

                const otherPerson = this.photoDatabase.people.get(otherPhoto.personId);
                if (!otherPerson || otherPhoto.personId === photo.personId) return;

                const connectionStrength = this.calculateConnectionStrength(photo, otherPhoto);
                if (connectionStrength > 0) {
                    const existingConnection = personData.connections.get(otherPhoto.personId) || {
                        person: otherPerson,
                        strength: 0,
                        evidence: [],
                        sharedEvents: [],
                        sharedLocations: [],
                        sharedDates: []
                    };

                    existingConnection.strength = Math.max(existingConnection.strength, connectionStrength);
                    
                    // Add evidence for this connection
                    existingConnection.evidence.push({
                        photo1: photo,
                        photo2: otherPhoto,
                        type: this.getConnectionType(photo, otherPhoto),
                        strength: connectionStrength
                    });

                    personData.connections.set(otherPhoto.personId, existingConnection);
                }
            });
        });
    }

    calculateConnectionStrength(photo1, photo2) {
        let strength = 0;

        // Same event/date (high strength)
        if (photo1.date && photo2.date) {
            const date1 = new Date(photo1.date);
            const date2 = new Date(photo2.date);
            const daysDiff = Math.abs(date1 - date2) / (1000 * 60 * 60 * 24);
            
            if (daysDiff === 0) strength += 10; // Same day
            else if (daysDiff <= 7) strength += 5; // Same week
            else if (daysDiff <= 30) strength += 2; // Same month
        }

        // Shared tags (medium strength)
        if (photo1.tags && photo2.tags) {
            const sharedTags = photo1.tags.filter(tag => photo2.tags.includes(tag));
            strength += sharedTags.length * 3;
        }

        // Same location/event type (medium strength)
        const location1 = this.extractLocation(photo1);
        const location2 = this.extractLocation(photo2);
        if (location1 && location2 && location1 === location2) {
            strength += 5;
        }

        // Same source type (low strength)
        if (photo1.source === photo2.source) {
            strength += 1;
        }

        return strength;
    }

    getConnectionType(photo1, photo2) {
        // Analyze photos to determine connection type
        const tags1 = photo1.tags || [];
        const tags2 = photo2.tags || [];
        
        if (tags1.includes('party') && tags2.includes('party')) return 'social_event';
        if (tags1.includes('flight') && tags2.includes('flight')) return 'travel';
        if (tags1.includes('business') && tags2.includes('business')) return 'business';
        if (tags1.includes('island') && tags2.includes('island')) return 'location';
        if (tags1.includes('court') || tags2.includes('court')) return 'legal';
        
        return 'associated';
    }

    extractLocation(photo) {
        const tags = photo.tags || [];
        const description = photo.description.toLowerCase();
        
        // Known locations
        const locations = [
            'mar-a-lago', 'little-st-james', 'manhattan', 'palm-beach',
            'new-york', 'london', 'paris', 'windsor', 'ranch'
        ];
        
        for (const location of locations) {
            if (tags.includes(location) || description.includes(location)) {
                return location;
            }
        }
        
        return null;
    }

    buildEvidenceChains() {
        // Build evidence chains showing progression of relationships
        this.relationshipMap.forEach((personData, personId) => {
            const chains = [];
            
            // Sort photos by date to build timeline
            const sortedPhotos = personData.photos
                .filter(photo => photo.date)
                .sort((a, b) => new Date(a.date) - new Date(b.date));
            
            // Group by evidence level and time periods
            const evidenceGroups = {
                early: sortedPhotos.filter(p => new Date(p.date) < new Date('2000-01-01')),
                peak: sortedPhotos.filter(p => {
                    const date = new Date(p.date);
                    return date >= new Date('2000-01-01') && date < new Date('2010-01-01');
                }),
                late: sortedPhotos.filter(p => new Date(p.date) >= new Date('2010-01-01')),
                confirmed: sortedPhotos.filter(p => p.evidenceLevel === 'confirmed'),
                documented: sortedPhotos.filter(p => p.evidenceLevel === 'documented')
            };

            this.evidenceChains.set(personId, {
                person: personData.person,
                timeline: sortedPhotos,
                evidenceGroups: evidenceGroups,
                riskLevel: this.calculateRiskLevel(personData),
                keyEvidence: this.findKeyEvidence(sortedPhotos)
            });
        });
    }

    calculateRiskLevel(personData) {
        let riskScore = 0;
        
        // Evidence level scoring
        const evidenceLevels = { confirmed: 10, documented: 7, alleged: 4, suspected: 2 };
        riskScore += evidenceLevels[personData.evidenceLevel] || 0;
        
        // Photo count (more photos = more evidence)
        riskScore += Math.min(personData.photos.length, 10);
        
        // Connection strength
        personData.connections.forEach(connection => {
            riskScore += Math.min(connection.strength / 10, 5);
        });
        
        // Category risk (core network = highest)
        const categoryRisk = { core: 20, enablers: 15, politicians: 12, business: 8, celebrities: 5 };
        riskScore += categoryRisk[personData.person.category] || 0;
        
        // Normalize to 0-100 scale
        return Math.min(Math.round(riskScore * 2), 100);
    }

    findKeyEvidence(photos) {
        return photos
            .filter(photo => photo.evidenceLevel === 'confirmed' || photo.type === 'evidence')
            .slice(0, 3);
    }

    setupInvestigationWorkspace() {
        // Create investigation workspace UI
        if (document.getElementById('investigation-workspace')) return;

        const workspace = document.createElement('div');
        workspace.id = 'investigation-workspace';
        workspace.innerHTML = `
            <div class="investigation-panel" style="
                position: fixed;
                top: 10px;
                left: -400px;
                width: 380px;
                height: calc(100vh - 20px);
                background: rgba(26, 26, 26, 0.95);
                backdrop-filter: blur(10px);
                border: 2px solid var(--primary-color);
                border-radius: 15px;
                z-index: 10000;
                transition: left 0.3s ease;
                overflow: hidden;
                display: flex;
                flex-direction: column;
            ">
                <div class="investigation-header" style="
                    background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
                    padding: 15px;
                    color: white;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                ">
                    <h3>🔍 Investigation Tools</h3>
                    <button id="close-investigation" style="
                        background: none;
                        border: none;
                        color: white;
                        font-size: 20px;
                        cursor: pointer;
                    ">×</button>
                </div>
                
                <div class="investigation-content" style="
                    flex: 1;
                    overflow-y: auto;
                    padding: 15px;
                    color: white;
                ">
                    <div class="investigation-tabs" style="
                        display: flex;
                        margin-bottom: 15px;
                        border-bottom: 1px solid #444;
                    ">
                        <button class="investigation-tab active" data-tab="analysis" style="
                            background: none;
                            border: none;
                            color: white;
                            padding: 8px 12px;
                            cursor: pointer;
                            border-bottom: 2px solid transparent;
                            font-size: 0.9em;
                        ">📊 Analysis</button>
                        <button class="investigation-tab" data-tab="network" style="
                            background: none;
                            border: none;
                            color: white;
                            padding: 8px 12px;
                            cursor: pointer;
                            border-bottom: 2px solid transparent;
                            font-size: 0.9em;
                        ">🌐 Network</button>
                        <button class="investigation-tab" data-tab="timeline" style="
                            background: none;
                            border: none;
                            color: white;
                            padding: 8px 12px;
                            cursor: pointer;
                            border-bottom: 2px solid transparent;
                            font-size: 0.9em;
                        ">⏰ Timeline</button>
                        <button class="investigation-tab" data-tab="bookmarks" style="
                            background: none;
                            border: none;
                            color: white;
                            padding: 8px 12px;
                            cursor: pointer;
                            border-bottom: 2px solid transparent;
                            font-size: 0.9em;
                        ">📌 Saved</button>
                    </div>
                    
                    <div id="investigation-tab-content">
                        <!-- Tab content will be inserted here -->
                    </div>
                </div>
            </div>
            
            <button id="investigation-toggle" style="
                position: fixed;
                top: 50%;
                left: 10px;
                transform: translateY(-50%);
                background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
                color: white;
                border: none;
                padding: 12px 8px;
                border-radius: 0 10px 10px 0;
                cursor: pointer;
                z-index: 9999;
                font-size: 16px;
                writing-mode: vertical-lr;
                text-orientation: mixed;
            ">🔍 INVESTIGATE</button>
        `;

        document.body.appendChild(workspace);

        // Setup event listeners
        this.setupWorkspaceEventListeners();
        
        // Show analysis tab by default
        this.showInvestigationTab('analysis');
    }

    setupWorkspaceEventListeners() {
        const toggle = document.getElementById('investigation-toggle');
        const panel = document.querySelector('.investigation-panel');
        const close = document.getElementById('close-investigation');

        toggle.addEventListener('click', () => {
            if (panel.style.left === '10px') {
                panel.style.left = '-400px';
                toggle.style.left = '10px';
            } else {
                panel.style.left = '10px';
                toggle.style.left = '410px';
            }
        });

        close.addEventListener('click', () => {
            panel.style.left = '-400px';
            toggle.style.left = '10px';
        });

        // Tab switching
        document.querySelectorAll('.investigation-tab').forEach(tab => {
            tab.addEventListener('click', () => {
                document.querySelectorAll('.investigation-tab').forEach(t => {
                    t.classList.remove('active');
                    t.style.borderBottomColor = 'transparent';
                });
                tab.classList.add('active');
                tab.style.borderBottomColor = 'var(--primary-color)';
                
                this.showInvestigationTab(tab.dataset.tab);
            });
        });
    }

    showInvestigationTab(tabName) {
        const content = document.getElementById('investigation-tab-content');
        
        switch (tabName) {
            case 'analysis':
                content.innerHTML = this.createAnalysisTab();
                break;
            case 'network':
                content.innerHTML = this.createNetworkTab();
                break;
            case 'timeline':
                content.innerHTML = this.createTimelineTab();
                break;
            case 'bookmarks':
                content.innerHTML = this.createBookmarksTab();
                break;
        }
    }

    createAnalysisTab() {
        const manifest = this.photoDatabase.generatePhotoManifest();
        const evidenceStrength = this.photoDatabase.getEvidenceStrength();
        
        // Get top risk individuals
        const topRisk = Array.from(this.evidenceChains.entries())
            .sort(([,a], [,b]) => b.riskLevel - a.riskLevel)
            .slice(0, 5);

        return `
            <div class="analysis-section">
                <h4 style="color: var(--primary-color); margin-bottom: 10px;">📊 Investigation Summary</h4>
                <div class="stat-grid" style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 20px;">
                    <div class="stat-item" style="background: rgba(255,255,255,0.1); padding: 10px; border-radius: 8px; text-align: center;">
                        <div style="font-size: 1.5em; font-weight: bold; color: var(--primary-color);">${manifest.total_photos}</div>
                        <div style="font-size: 0.8em; opacity: 0.8;">Total Photos</div>
                    </div>
                    <div class="stat-item" style="background: rgba(255,255,255,0.1); padding: 10px; border-radius: 8px; text-align: center;">
                        <div style="font-size: 1.5em; font-weight: bold; color: var(--danger-color);">${evidenceStrength.confirmed}</div>
                        <div style="font-size: 0.8em; opacity: 0.8;">Confirmed Evidence</div>
                    </div>
                    <div class="stat-item" style="background: rgba(255,255,255,0.1); padding: 10px; border-radius: 8px; text-align: center;">
                        <div style="font-size: 1.5em; font-weight: bold; color: var(--secondary-color);">${manifest.people_with_photos}</div>
                        <div style="font-size: 0.8em; opacity: 0.8;">People Documented</div>
                    </div>
                    <div class="stat-item" style="background: rgba(255,255,255,0.1); padding: 10px; border-radius: 8px; text-align: center;">
                        <div style="font-size: 1.5em; font-weight: bold; color: var(--accent-color);">${this.relationshipMap.size}</div>
                        <div style="font-size: 0.8em; opacity: 0.8;">Connections</div>
                    </div>
                </div>

                <h4 style="color: var(--danger-color); margin-bottom: 10px;">⚠️ Highest Risk Individuals</h4>
                <div class="risk-list">
                    ${topRisk.map(([personId, data]) => `
                        <div class="risk-item" style="
                            display: flex;
                            justify-content: space-between;
                            align-items: center;
                            padding: 8px;
                            margin: 5px 0;
                            background: rgba(255,255,255,0.05);
                            border-radius: 5px;
                            cursor: pointer;
                        " onclick="investigationTools.investigatePerson('${personId}')">
                            <div>
                                <div style="font-weight: bold; font-size: 0.9em;">${data.person.name}</div>
                                <div style="font-size: 0.7em; opacity: 0.7;">${data.person.category} • ${data.timeline.length} photos</div>
                            </div>
                            <div class="risk-score" style="
                                background: ${data.riskLevel > 70 ? 'var(--danger-color)' : data.riskLevel > 40 ? '#FF4500' : 'var(--accent-color)'};
                                color: white;
                                padding: 2px 6px;
                                border-radius: 10px;
                                font-size: 0.7em;
                                font-weight: bold;
                            ">${data.riskLevel}%</div>
                        </div>
                    `).join('')}
                </div>

                <div class="analysis-actions" style="margin-top: 20px;">
                    <button onclick="investigationTools.generateReport()" style="
                        background: var(--primary-color);
                        color: white;
                        border: none;
                        padding: 8px 15px;
                        border-radius: 15px;
                        cursor: pointer;
                        font-size: 0.8em;
                        margin: 2px;
                    ">📄 Generate Report</button>
                    <button onclick="investigationTools.exportData()" style="
                        background: var(--secondary-color);
                        color: white;
                        border: none;
                        padding: 8px 15px;
                        border-radius: 15px;
                        cursor: pointer;
                        font-size: 0.8em;
                        margin: 2px;
                    ">💾 Export Data</button>
                </div>
            </div>
        `;
    }

    createNetworkTab() {
        return `
            <div class="network-section">
                <h4 style="color: var(--primary-color); margin-bottom: 10px;">🌐 Relationship Network</h4>
                <div class="network-controls" style="margin-bottom: 15px;">
                    <select id="network-filter" style="
                        background: rgba(255,255,255,0.1);
                        border: 1px solid var(--primary-color);
                        color: white;
                        padding: 5px;
                        border-radius: 5px;
                        width: 100%;
                        margin-bottom: 10px;
                    ">
                        <option value="all">All Connections</option>
                        <option value="high">High Confidence Only</option>
                        <option value="confirmed">Confirmed Evidence Only</option>
                        <option value="core">Core Network Only</option>
                    </select>
                </div>
                
                <div class="connection-strength-legend" style="margin-bottom: 15px; font-size: 0.8em;">
                    <div style="margin: 2px 0;"><span style="color: var(--danger-color);">●</span> Very Strong (10+)</div>
                    <div style="margin: 2px 0;"><span style="color: #FF4500;">●</span> Strong (5-9)</div>
                    <div style="margin: 2px 0;"><span style="color: var(--accent-color);">●</span> Moderate (2-4)</div>
                    <div style="margin: 2px 0;"><span style="color: #888;">●</span> Weak (1)</div>
                </div>

                <div id="network-connections" style="max-height: 400px; overflow-y: auto;">
                    ${this.generateNetworkConnections()}
                </div>
            </div>
        `;
    }

    generateNetworkConnections() {
        let html = '';
        
        this.relationshipMap.forEach((personData, personId) => {
            if (personData.connections.size === 0) return;
            
            html += `
                <div class="person-network" style="margin-bottom: 15px; padding: 10px; background: rgba(255,255,255,0.05); border-radius: 8px;">
                    <div class="network-person-header" style="font-weight: bold; color: var(--secondary-color); margin-bottom: 8px;">
                        ${personData.person.name} (${personData.connections.size} connections)
                    </div>
                    <div class="connections-list">
                        ${Array.from(personData.connections.entries())
                            .sort(([,a], [,b]) => b.strength - a.strength)
                            .slice(0, 5)
                            .map(([connectedPersonId, connection]) => {
                                const strengthColor = connection.strength >= 10 ? 'var(--danger-color)' :
                                                    connection.strength >= 5 ? '#FF4500' :
                                                    connection.strength >= 2 ? 'var(--accent-color)' : '#888';
                                return `
                                    <div class="connection-item" style="
                                        display: flex;
                                        justify-content: space-between;
                                        align-items: center;
                                        padding: 4px 0;
                                        font-size: 0.8em;
                                        cursor: pointer;
                                    " onclick="investigationTools.exploreConnection('${personId}', '${connectedPersonId}')">
                                        <span>${connection.person.name}</span>
                                        <span style="color: ${strengthColor};">● ${connection.strength}</span>
                                    </div>
                                `;
                            }).join('')}
                    </div>
                </div>
            `;
        });
        
        return html || '<div style="text-align: center; opacity: 0.7; padding: 20px;">No connections found</div>';
    }

    createTimelineTab() {
        const timelinePhotos = this.photoDatabase.getTimelinePhotos();
        const grouped = this.groupPhotosByYear(timelinePhotos);
        
        return `
            <div class="timeline-section">
                <h4 style="color: var(--primary-color); margin-bottom: 10px;">⏰ Evidence Timeline</h4>
                <div class="timeline-years" style="max-height: 500px; overflow-y: auto;">
                    ${Object.entries(grouped)
                        .sort(([a], [b]) => b.localeCompare(a))
                        .map(([year, photos]) => `
                            <div class="timeline-year" style="margin-bottom: 15px;">
                                <div class="year-header" style="
                                    font-weight: bold;
                                    color: var(--secondary-color);
                                    margin-bottom: 8px;
                                    padding: 5px 0;
                                    border-bottom: 1px solid var(--secondary-color);
                                ">${year} (${photos.length} photos)</div>
                                <div class="year-photos">
                                    ${photos.slice(0, 3).map(photo => `
                                        <div class="timeline-photo-item" style="
                                            display: flex;
                                            align-items: center;
                                            padding: 5px;
                                            margin: 3px 0;
                                            background: rgba(255,255,255,0.05);
                                            border-radius: 5px;
                                            cursor: pointer;
                                            font-size: 0.8em;
                                        " onclick="investigationTools.viewPhoto('${photo.id}')">
                                            <div class="photo-thumb" style="
                                                width: 30px;
                                                height: 30px;
                                                background: var(--card-bg);
                                                border-radius: 50%;
                                                margin-right: 8px;
                                                display: flex;
                                                align-items: center;
                                                justify-content: center;
                                                font-size: 12px;
                                            ">📷</div>
                                            <div class="photo-info" style="flex: 1;">
                                                <div style="font-weight: bold;">${photo.person?.name || 'Unknown'}</div>
                                                <div style="opacity: 0.7; font-size: 0.9em;">${photo.description?.substring(0, 30) || 'No description'}...</div>
                                            </div>
                                            <div class="evidence-badge" style="
                                                padding: 2px 6px;
                                                border-radius: 8px;
                                                font-size: 0.7em;
                                                background: ${photo.evidenceLevel === 'confirmed' ? 'var(--danger-color)' : 
                                                           photo.evidenceLevel === 'documented' ? '#FF4500' : 'var(--accent-color)'};
                                                color: white;
                                            ">${photo.evidenceLevel?.toUpperCase() || 'UNKNOWN'}</div>
                                        </div>
                                    `).join('')}
                                    ${photos.length > 3 ? `
                                        <div style="text-align: center; padding: 5px; opacity: 0.7; font-size: 0.8em;">
                                            +${photos.length - 3} more photos
                                        </div>
                                    ` : ''}
                                </div>
                            </div>
                        `).join('')}
                </div>
            </div>
        `;
    }

    groupPhotosByYear(photos) {
        const grouped = {};
        photos.forEach(photo => {
            if (!photo.date) return;
            const year = new Date(photo.date).getFullYear().toString();
            if (!grouped[year]) grouped[year] = [];
            grouped[year].push(photo);
        });
        return grouped;
    }

    createBookmarksTab() {
        return `
            <div class="bookmarks-section">
                <h4 style="color: var(--primary-color); margin-bottom: 10px;">📌 Saved Items</h4>
                <div class="bookmark-categories" style="margin-bottom: 15px;">
                    <button class="bookmark-filter active" data-filter="all" style="
                        background: rgba(255,255,255,0.1);
                        border: 1px solid var(--primary-color);
                        color: white;
                        padding: 5px 10px;
                        border-radius: 12px;
                        font-size: 0.8em;
                        margin: 2px;
                        cursor: pointer;
                    ">All</button>
                    <button class="bookmark-filter" data-filter="photos" style="
                        background: rgba(255,255,255,0.1);
                        border: 1px solid var(--primary-color);
                        color: white;
                        padding: 5px 10px;
                        border-radius: 12px;
                        font-size: 0.8em;
                        margin: 2px;
                        cursor: pointer;
                    ">Photos</button>
                    <button class="bookmark-filter" data-filter="people" style="
                        background: rgba(255,255,255,0.1);
                        border: 1px solid var(--primary-color);
                        color: white;
                        padding: 5px 10px;
                        border-radius: 12px;
                        font-size: 0.8em;
                        margin: 2px;
                        cursor: pointer;
                    ">People</button>
                    <button class="bookmark-filter" data-filter="connections" style="
                        background: rgba(255,255,255,0.1);
                        border: 1px solid var(--primary-color);
                        color: white;
                        padding: 5px 10px;
                        border-radius: 12px;
                        font-size: 0.8em;
                        margin: 2px;
                        cursor: pointer;
                    ">Connections</button>
                </div>
                
                <div id="bookmarks-list" style="max-height: 400px; overflow-y: auto;">
                    ${this.bookmarks.size === 0 ? 
                        '<div style="text-align: center; opacity: 0.7; padding: 40px;">No bookmarks yet<br><small>Click the bookmark icon on photos and people to save them here</small></div>' :
                        this.generateBookmarksList()
                    }
                </div>
                
                <div class="bookmark-actions" style="margin-top: 15px; text-align: center;">
                    <button onclick="investigationTools.clearBookmarks()" style="
                        background: var(--danger-color);
                        color: white;
                        border: none;
                        padding: 6px 12px;
                        border-radius: 12px;
                        cursor: pointer;
                        font-size: 0.8em;
                    ">🗑️ Clear All</button>
                </div>
            </div>
        `;
    }

    generateBookmarksList() {
        // Implementation for bookmarks list
        return '<div style="text-align: center; opacity: 0.7; padding: 20px;">Bookmarks functionality ready</div>';
    }

    // Investigation actions
    investigatePerson(personId) {
        const personData = this.evidenceChains.get(personId);
        if (!personData) return;

        console.log('Investigating:', personData.person.name);
        
        // Show detailed person investigation
        if (this.photoComponent) {
            const photos = this.photoDatabase.getPhotosByPerson(personId);
            if (photos.length > 0) {
                this.photoComponent.openPhotoModal(photos[0]);
            }
        }
    }

    exploreConnection(personId1, personId2) {
        console.log('Exploring connection between:', personId1, personId2);
        
        // Show connection analysis
        const person1Data = this.relationshipMap.get(personId1);
        const connection = person1Data?.connections.get(personId2);
        
        if (connection) {
            alert(`Connection Strength: ${connection.strength}\nShared Evidence: ${connection.evidence.length} items`);
        }
    }

    viewPhoto(photoId) {
        const photo = this.photoDatabase.photos.get(photoId);
        if (photo && this.photoComponent) {
            this.photoComponent.openPhotoModal(photo);
        }
    }

    generateReport() {
        console.log('Generating investigation report...');
        // Implementation for report generation
        alert('Report generation feature coming soon!');
    }

    exportData() {
        console.log('Exporting investigation data...');
        const data = {
            relationships: Object.fromEntries(this.relationshipMap),
            evidenceChains: Object.fromEntries(this.evidenceChains),
            bookmarks: Array.from(this.bookmarks),
            timestamp: new Date().toISOString()
        };
        
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `investigation-data-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
    }

    clearBookmarks() {
        this.bookmarks.clear();
        this.showInvestigationTab('bookmarks');
    }
}

// Initialize investigation tools when page loads
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => {
        if (window.photoDatabase && window.photoComponent) {
            window.investigationTools = new InvestigationTools();
        }
    }, 1000);
});

// Export for module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = InvestigationTools;
}