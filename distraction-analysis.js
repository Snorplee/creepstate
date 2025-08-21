/**
 * Trump Distraction Pattern Recognition System - Web Interface
 * Real-time distraction analysis and correlation detection
 */

class DistractionAnalyzer {
    constructor() {
        this.currentData = null;
        this.alertThreshold = 0.6;
        this.updateInterval = null;
        this.charts = {};
        
        // Initialize the system
        this.initializeSystem();
    }
    
    async initializeSystem() {
        console.log('🕵️ Initializing Distraction Analysis System...');
        
        // Create alert container if it doesn't exist
        this.createAlertContainer();
        
        // Load initial data
        await this.loadDistractionData();
        
        // Setup periodic updates (every 5 minutes)
        this.updateInterval = setInterval(() => {
            this.loadDistractionData();
        }, 5 * 60 * 1000);
        
        // Setup event listeners
        this.setupEventListeners();
        
        console.log('✅ Distraction Analysis System initialized');
    }
    
    createAlertContainer() {
        // Check if alert container already exists
        if (document.getElementById('distraction-alerts')) {
            return;
        }
        
        // Create the alert container (hidden by default)
        const alertContainer = document.createElement('div');
        alertContainer.id = 'distraction-alerts';
        alertContainer.className = 'distraction-alert-container';
        alertContainer.style.display = 'none'; // Start hidden
        alertContainer.innerHTML = `
            <div class="alert-header">
                <h3>🚨 Distraction Pattern Analysis</h3>
                <button id="toggle-alerts" class="toggle-btn">Hide</button>
            </div>
            <div class="alert-content">
                <div id="threat-level-indicator" class="threat-indicator">
                    <span class="threat-label">Threat Level:</span>
                    <span id="threat-level-value" class="threat-value">READY</span>
                </div>
                <div id="correlation-strength" class="correlation-display">
                    <span class="correlation-label">Correlation Strength:</span>
                    <div class="correlation-bar">
                        <div id="correlation-fill" class="correlation-fill"></div>
                    </div>
                    <span id="correlation-value" class="correlation-value">0%</span>
                </div>
                <div id="active-alerts" class="alerts-list"></div>
                <div id="pattern-chart" class="pattern-chart"></div>
            </div>
        `;
        
        // Add CSS styles
        this.addAlertStyles();
        
        // Insert at the top of the page
        document.body.insertBefore(alertContainer, document.body.firstChild);
    }
    
    addAlertStyles() {
        if (document.getElementById('distraction-styles')) {
            return;
        }
        
        const styles = document.createElement('style');
        styles.id = 'distraction-styles';
        styles.textContent = `
            .distraction-alert-container {
                position: fixed;
                top: 10px;
                right: 10px;
                width: 350px;
                background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
                border: 2px solid #ff6b6b;
                border-radius: 12px;
                color: #ffffff;
                font-family: 'Courier New', monospace;
                box-shadow: 0 8px 32px rgba(255, 107, 107, 0.3);
                z-index: 10000;
                backdrop-filter: blur(10px);
                transition: all 0.3s ease;
            }
            
            .alert-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 12px 16px;
                background: rgba(255, 107, 107, 0.2);
                border-radius: 10px 10px 0 0;
                border-bottom: 1px solid #ff6b6b;
            }
            
            .alert-header h3 {
                margin: 0;
                font-size: 14px;
                font-weight: bold;
                color: #ff6b6b;
            }
            
            .toggle-btn {
                background: rgba(255, 107, 107, 0.3);
                border: 1px solid #ff6b6b;
                color: #ffffff;
                padding: 4px 8px;
                border-radius: 4px;
                cursor: pointer;
                font-size: 11px;
                transition: all 0.2s ease;
            }
            
            .toggle-btn:hover {
                background: rgba(255, 107, 107, 0.5);
            }
            
            .alert-content {
                padding: 16px;
                max-height: 400px;
                overflow-y: auto;
            }
            
            .alert-content.hidden {
                display: none;
            }
            
            .threat-indicator {
                display: flex;
                align-items: center;
                margin-bottom: 12px;
                padding: 8px;
                background: rgba(255, 255, 255, 0.05);
                border-radius: 6px;
            }
            
            .threat-label {
                font-size: 12px;
                margin-right: 8px;
                color: #cccccc;
            }
            
            .threat-value {
                font-weight: bold;
                font-size: 13px;
                padding: 2px 8px;
                border-radius: 4px;
            }
            
            .threat-value.CRITICAL {
                background: #dc3545;
                color: white;
                animation: pulse 2s infinite;
            }
            
            .threat-value.HIGH {
                background: #fd7e14;
                color: white;
            }
            
            .threat-value.MEDIUM {
                background: #ffc107;
                color: black;
            }
            
            .threat-value.LOW {
                background: #28a745;
                color: white;
            }
            
            .threat-value.MINIMAL {
                background: #6c757d;
                color: white;
            }
            
            @keyframes pulse {
                0% { opacity: 1; }
                50% { opacity: 0.5; }
                100% { opacity: 1; }
            }
            
            .correlation-display {
                margin-bottom: 16px;
            }
            
            .correlation-label {
                font-size: 12px;
                color: #cccccc;
                display: block;
                margin-bottom: 4px;
            }
            
            .correlation-bar {
                width: 100%;
                height: 12px;
                background: rgba(255, 255, 255, 0.1);
                border-radius: 6px;
                overflow: hidden;
                position: relative;
            }
            
            .correlation-fill {
                height: 100%;
                background: linear-gradient(90deg, #28a745 0%, #ffc107 50%, #dc3545 100%);
                transition: width 0.5s ease;
                border-radius: 6px;
            }
            
            .correlation-value {
                font-size: 11px;
                color: #cccccc;
                margin-left: 8px;
            }
            
            .alerts-list {
                margin-bottom: 16px;
            }
            
            .alert-item {
                background: rgba(255, 255, 255, 0.05);
                border-left: 4px solid;
                padding: 8px 12px;
                margin-bottom: 8px;
                border-radius: 0 6px 6px 0;
                font-size: 12px;
                transition: all 0.2s ease;
                cursor: pointer;
            }
            
            .alert-item:hover {
                background: rgba(255, 255, 255, 0.1);
            }
            
            .alert-item.CRITICAL {
                border-left-color: #dc3545;
                animation: alertPulse 3s infinite;
            }
            
            .alert-item.HIGH {
                border-left-color: #fd7e14;
            }
            
            .alert-item.MEDIUM {
                border-left-color: #ffc107;
            }
            
            .alert-item.LOW {
                border-left-color: #28a745;
            }
            
            @keyframes alertPulse {
                0%, 100% { background: rgba(255, 255, 255, 0.05); }
                50% { background: rgba(220, 53, 69, 0.1); }
            }
            
            .alert-pattern {
                font-weight: bold;
                color: #ff6b6b;
                margin-bottom: 4px;
            }
            
            .alert-description {
                color: #cccccc;
                margin-bottom: 4px;
                line-height: 1.3;
            }
            
            .alert-score {
                font-size: 11px;
                color: #aaaaaa;
            }
            
            .alert-score strong {
                color: #ff6b6b;
            }
            
            .alert-keywords {
                margin-top: 4px;
                font-size: 10px;
                color: #888888;
            }
            
            .keyword-tag {
                background: rgba(255, 107, 107, 0.2);
                color: #ff6b6b;
                padding: 1px 4px;
                border-radius: 3px;
                margin-right: 4px;
                display: inline-block;
                margin-bottom: 2px;
            }
            
            .pattern-chart {
                margin-top: 12px;
                padding: 8px;
                background: rgba(255, 255, 255, 0.02);
                border-radius: 6px;
                font-size: 11px;
            }
            
            .chart-title {
                color: #ff6b6b;
                font-weight: bold;
                margin-bottom: 8px;
            }
            
            .pattern-bar {
                display: flex;
                align-items: center;
                margin-bottom: 4px;
            }
            
            .pattern-name {
                width: 120px;
                font-size: 10px;
                color: #cccccc;
            }
            
            .pattern-visual {
                flex: 1;
                height: 8px;
                background: rgba(255, 255, 255, 0.1);
                border-radius: 4px;
                margin: 0 8px;
                overflow: hidden;
            }
            
            .pattern-fill {
                height: 100%;
                background: linear-gradient(90deg, #28a745, #ffc107, #fd7e14, #dc3545);
                border-radius: 4px;
                transition: width 0.3s ease;
            }
            
            .pattern-score {
                font-size: 10px;
                color: #aaaaaa;
                min-width: 30px;
            }
            
            .no-alerts {
                text-align: center;
                color: #666666;
                font-style: italic;
                padding: 20px;
            }
            
            /* Mobile responsiveness */
            @media (max-width: 768px) {
                .distraction-alert-container {
                    width: calc(100vw - 20px);
                    right: 10px;
                    left: 10px;
                }
            }
            
            /* Dark mode compatibility */
            [data-theme="dark"] .distraction-alert-container {
                background: linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%);
                border-color: #ff4757;
            }
            
            [data-theme="dark"] .alert-header {
                background: rgba(255, 71, 87, 0.2);
                border-bottom-color: #ff4757;
            }
            
            [data-theme="dark"] .alert-header h3 {
                color: #ff4757;
            }
        `;
        
        document.head.appendChild(styles);
    }
    
    async loadDistractionData() {
        try {
            console.log('📡 Loading distraction analysis data...');
            
            // Try to load from the JSON file generated by Python script
            const response = await fetch('./distraction-analysis.json?' + Date.now());
            
            if (response.ok) {
                this.currentData = await response.json();
                this.updateDisplay();
                console.log('✅ Distraction data loaded successfully');
            } else {
                // If no data file exists, create mock data for demonstration
                this.createMockData();
                console.log('⚠️ Using mock data - run auto-research.py to generate real data');
            }
        } catch (error) {
            console.error('❌ Failed to load distraction data:', error);
            this.createMockData();
        }
    }
    
    createMockData() {
        // Create realistic mock data for demonstration
        this.currentData = {
            timestamp: new Date().toISOString(),
            threat_level: 'MEDIUM',
            alerts: [
                {
                    id: 'mock001',
                    pattern: 'military_actions',
                    description: 'Military actions or threats used to dominate news cycles',
                    score: 0.75,
                    level: 'HIGH',
                    timestamp: new Date().toISOString(),
                    keywords: ['military strike', 'deploy troops'],
                    recommendations: [
                        'Monitor news cycles closely for buried Epstein stories',
                        'Verify military action claims through official DOD channels',
                        'Cross-reference timing with Epstein case calendar'
                    ]
                },
                {
                    id: 'mock002',
                    pattern: 'citizenship_threats',
                    description: 'Threats against celebrity or political figure citizenship',
                    score: 0.65,
                    level: 'MEDIUM',
                    timestamp: new Date().toISOString(),
                    keywords: ['revoke citizenship', 'deport celebrities'],
                    recommendations: [
                        'Document all related social media activity',
                        'Monitor mainstream media coverage patterns'
                    ]
                }
            ],
            summary: {
                total_alerts: 2,
                highest_score: 0.75,
                overall_threat_level: 'MEDIUM',
                top_concerns: [
                    {
                        pattern: 'military_actions',
                        score: 0.75,
                        description: 'Military actions or threats used to dominate news cycles'
                    }
                ]
            },
            correlation_analysis: {
                correlation_strength: 0.6,
                recommendation: 'MEDIUM ALERT: Notable correlation pattern. Monitor closely for emerging patterns.'
            }
        };
    }
    
    updateDisplay() {
        if (!this.currentData) return;
        
        this.updateThreatLevel();
        this.updateCorrelationStrength();
        this.updateAlertsList();
        this.updatePatternChart();
    }
    
    updateThreatLevel() {
        const threatElement = document.getElementById('threat-level-value');
        if (!threatElement) return;
        
        const threatLevel = this.currentData.threat_level || 
                           this.currentData.summary?.overall_threat_level || 
                           'UNKNOWN';
        
        threatElement.textContent = threatLevel;
        threatElement.className = `threat-value ${threatLevel}`;
    }
    
    updateCorrelationStrength() {
        const correlationFill = document.getElementById('correlation-fill');
        const correlationValue = document.getElementById('correlation-value');
        
        if (!correlationFill || !correlationValue) return;
        
        const strength = this.currentData.correlation_analysis?.correlation_strength || 0;
        const percentage = Math.round(strength * 100);
        
        correlationFill.style.width = `${percentage}%`;
        correlationValue.textContent = `${percentage}%`;
    }
    
    updateAlertsList() {
        const alertsList = document.getElementById('active-alerts');
        if (!alertsList) return;
        
        const alerts = this.currentData.alerts || [];
        
        if (alerts.length === 0) {
            alertsList.innerHTML = '<div class="no-alerts">No active distraction alerts</div>';
            return;
        }
        
        alertsList.innerHTML = alerts.map(alert => `
            <div class="alert-item ${alert.level}" onclick="distractionAnalyzer.showAlertDetails('${alert.id}')">
                <div class="alert-pattern">${this.formatPatternName(alert.pattern)}</div>
                <div class="alert-description">${alert.description}</div>
                <div class="alert-score">Score: <strong>${alert.score.toFixed(2)}</strong> | Level: <strong>${alert.level}</strong></div>
                ${alert.keywords && alert.keywords.length > 0 ? `
                    <div class="alert-keywords">
                        ${alert.keywords.map(keyword => `<span class="keyword-tag">${keyword}</span>`).join('')}
                    </div>
                ` : ''}
            </div>
        `).join('');
    }
    
    updatePatternChart() {
        const chartElement = document.getElementById('pattern-chart');
        if (!chartElement) return;
        
        const topConcerns = this.currentData.summary?.top_concerns || [];
        
        if (topConcerns.length === 0) {
            chartElement.innerHTML = '<div class="chart-title">Pattern Analysis</div><div class="no-alerts">No patterns detected</div>';
            return;
        }
        
        const chartHTML = `
            <div class="chart-title">Top Distraction Patterns</div>
            ${topConcerns.map(concern => `
                <div class="pattern-bar">
                    <div class="pattern-name">${this.formatPatternName(concern.pattern)}</div>
                    <div class="pattern-visual">
                        <div class="pattern-fill" style="width: ${concern.score * 100}%"></div>
                    </div>
                    <div class="pattern-score">${concern.score.toFixed(2)}</div>
                </div>
            `).join('')}
        `;
        
        chartElement.innerHTML = chartHTML;
    }
    
    formatPatternName(pattern) {
        return pattern.replace(/_/g, ' ')
                     .split(' ')
                     .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                     .join(' ');
    }
    
    showAlertDetails(alertId) {
        const alert = this.currentData.alerts?.find(a => a.id === alertId);
        if (!alert) return;
        
        const modal = this.createAlertModal(alert);
        document.body.appendChild(modal);
        
        // Show modal
        setTimeout(() => modal.classList.add('visible'), 10);
    }
    
    createAlertModal(alert) {
        const modal = document.createElement('div');
        modal.className = 'alert-detail-modal';
        modal.innerHTML = `
            <div class="modal-overlay" onclick="this.parentElement.remove()"></div>
            <div class="modal-content">
                <div class="modal-header">
                    <h3>🚨 ${this.formatPatternName(alert.pattern)}</h3>
                    <button onclick="this.closest('.alert-detail-modal').remove()" class="close-btn">&times;</button>
                </div>
                <div class="modal-body">
                    <div class="detail-section">
                        <strong>Description:</strong>
                        <p>${alert.description}</p>
                    </div>
                    <div class="detail-section">
                        <strong>Distraction Score:</strong> ${alert.score.toFixed(2)} / 1.00
                        <div class="score-bar">
                            <div class="score-fill" style="width: ${alert.score * 100}%"></div>
                        </div>
                    </div>
                    <div class="detail-section">
                        <strong>Alert Level:</strong> <span class="level-badge ${alert.level}">${alert.level}</span>
                    </div>
                    <div class="detail-section">
                        <strong>Detected At:</strong> ${new Date(alert.timestamp).toLocaleString()}
                    </div>
                    ${alert.keywords && alert.keywords.length > 0 ? `
                        <div class="detail-section">
                            <strong>Detected Keywords:</strong>
                            <div class="keywords-grid">
                                ${alert.keywords.map(keyword => `<span class="keyword-pill">${keyword}</span>`).join('')}
                            </div>
                        </div>
                    ` : ''}
                    ${alert.recommendations && alert.recommendations.length > 0 ? `
                        <div class="detail-section">
                            <strong>Recommendations:</strong>
                            <ul class="recommendations-list">
                                ${alert.recommendations.map(rec => `<li>${rec}</li>`).join('')}
                            </ul>
                        </div>
                    ` : ''}
                </div>
            </div>
        `;
        
        // Add modal styles
        this.addModalStyles();
        
        return modal;
    }
    
    addModalStyles() {
        if (document.getElementById('modal-styles')) return;
        
        const styles = document.createElement('style');
        styles.id = 'modal-styles';
        styles.textContent = `
            .alert-detail-modal {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                z-index: 20000;
                opacity: 0;
                transition: opacity 0.3s ease;
            }
            
            .alert-detail-modal.visible {
                opacity: 1;
            }
            
            .modal-overlay {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.8);
                backdrop-filter: blur(5px);
            }
            
            .modal-content {
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
                border: 2px solid #ff6b6b;
                border-radius: 12px;
                color: #ffffff;
                font-family: 'Courier New', monospace;
                max-width: 600px;
                max-height: 80vh;
                overflow-y: auto;
                box-shadow: 0 20px 60px rgba(255, 107, 107, 0.3);
            }
            
            .modal-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 16px 20px;
                background: rgba(255, 107, 107, 0.2);
                border-bottom: 1px solid #ff6b6b;
                border-radius: 10px 10px 0 0;
            }
            
            .modal-header h3 {
                margin: 0;
                color: #ff6b6b;
                font-size: 18px;
            }
            
            .close-btn {
                background: none;
                border: none;
                color: #ffffff;
                font-size: 24px;
                cursor: pointer;
                padding: 0;
                width: 30px;
                height: 30px;
                display: flex;
                align-items: center;
                justify-content: center;
                border-radius: 50%;
                transition: background 0.2s ease;
            }
            
            .close-btn:hover {
                background: rgba(255, 255, 255, 0.1);
            }
            
            .modal-body {
                padding: 20px;
            }
            
            .detail-section {
                margin-bottom: 20px;
            }
            
            .detail-section strong {
                color: #ff6b6b;
                display: block;
                margin-bottom: 8px;
                font-size: 14px;
            }
            
            .detail-section p {
                color: #cccccc;
                line-height: 1.5;
                margin: 0;
            }
            
            .score-bar {
                width: 100%;
                height: 16px;
                background: rgba(255, 255, 255, 0.1);
                border-radius: 8px;
                overflow: hidden;
                margin-top: 8px;
            }
            
            .score-fill {
                height: 100%;
                background: linear-gradient(90deg, #28a745 0%, #ffc107 50%, #fd7e14 75%, #dc3545 100%);
                transition: width 0.5s ease;
            }
            
            .level-badge {
                padding: 4px 8px;
                border-radius: 4px;
                font-weight: bold;
                font-size: 12px;
            }
            
            .level-badge.CRITICAL {
                background: #dc3545;
                color: white;
            }
            
            .level-badge.HIGH {
                background: #fd7e14;
                color: white;
            }
            
            .level-badge.MEDIUM {
                background: #ffc107;
                color: black;
            }
            
            .level-badge.LOW {
                background: #28a745;
                color: white;
            }
            
            .keywords-grid {
                display: flex;
                flex-wrap: wrap;
                gap: 6px;
                margin-top: 8px;
            }
            
            .keyword-pill {
                background: rgba(255, 107, 107, 0.2);
                color: #ff6b6b;
                padding: 4px 8px;
                border-radius: 12px;
                font-size: 12px;
                border: 1px solid rgba(255, 107, 107, 0.3);
            }
            
            .recommendations-list {
                margin: 8px 0 0 0;
                padding-left: 20px;
                color: #cccccc;
            }
            
            .recommendations-list li {
                margin-bottom: 8px;
                line-height: 1.4;
            }
        `;
        
        document.head.appendChild(styles);
    }
    
    setupEventListeners() {
        // Toggle alerts visibility
        const toggleBtn = document.getElementById('toggle-alerts');
        if (toggleBtn) {
            toggleBtn.addEventListener('click', () => {
                const content = document.querySelector('.alert-content');
                const isHidden = content.classList.contains('hidden');
                
                if (isHidden) {
                    content.classList.remove('hidden');
                    toggleBtn.textContent = 'Hide';
                } else {
                    content.classList.add('hidden');
                    toggleBtn.textContent = 'Show';
                }
            });
        }
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            // Alt + D to toggle distraction alerts
            if (e.altKey && e.key === 'd') {
                e.preventDefault();
                const container = document.getElementById('distraction-alerts');
                if (container) {
                    container.style.display = container.style.display === 'none' ? 'block' : 'none';
                }
            }
            
            // Alt + R to refresh data
            if (e.altKey && e.key === 'r') {
                e.preventDefault();
                this.loadDistractionData();
            }
        });
    }
    
    // Public methods for external integration
    
    getThreatLevel() {
        return this.currentData?.threat_level || 
               this.currentData?.summary?.overall_threat_level || 
               'UNKNOWN';
    }
    
    getCorrelationStrength() {
        return this.currentData?.correlation_analysis?.correlation_strength || 0;
    }
    
    getActiveAlerts() {
        return this.currentData?.alerts || [];
    }
    
    getCriticalAlerts() {
        return this.getActiveAlerts().filter(alert => alert.level === 'CRITICAL');
    }
    
    // Integration with timeline events
    correlateWithTimelineEvent(eventDate, eventTitle) {
        const alerts = this.getActiveAlerts();
        const eventTimestamp = new Date(eventDate).getTime();
        
        // Check for alerts within 24 hours of the event
        const correlatedAlerts = alerts.filter(alert => {
            const alertTimestamp = new Date(alert.timestamp).getTime();
            const timeDifference = Math.abs(eventTimestamp - alertTimestamp);
            return timeDifference <= 24 * 60 * 60 * 1000; // 24 hours
        });
        
        if (correlatedAlerts.length > 0) {
            console.log(`⚠️ Potential distraction correlation detected for event: ${eventTitle}`);
            console.log('Correlated alerts:', correlatedAlerts);
            
            // Highlight the timeline event if possible
            this.highlightTimelineEvent(eventDate, correlatedAlerts);
        }
        
        return correlatedAlerts;
    }
    
    highlightTimelineEvent(eventDate, alerts) {
        // Find timeline events and add distraction warning
        const timelineEvents = document.querySelectorAll('.timeline-event-bubble-body');
        
        timelineEvents.forEach(eventElement => {
            const eventText = eventElement.textContent;
            if (eventText.includes(eventDate.substring(0, 7))) { // Match year-month
                const warningElement = document.createElement('div');
                warningElement.className = 'distraction-warning';
                warningElement.innerHTML = `
                    <div style="background: rgba(255, 107, 107, 0.2); border: 1px solid #ff6b6b; 
                               padding: 8px; margin: 8px 0; border-radius: 4px; font-size: 11px;">
                        🚨 DISTRACTION ALERT: ${alerts.length} pattern${alerts.length > 1 ? 's' : ''} detected near this event
                        <br><small>Click for details</small>
                    </div>
                `;
                
                warningElement.addEventListener('click', () => {
                    const alertDetails = alerts.map(alert => 
                        `${this.formatPatternName(alert.pattern)}: ${alert.score.toFixed(2)}`
                    ).join('\\n');
                    
                    alert(`Distraction Patterns Detected:\\n\\n${alertDetails}\\n\\nThis may indicate an attempt to divert attention from Epstein-related news.`);
                });
                
                eventElement.appendChild(warningElement);
            }
        });
    }
    
    // Cleanup method
    destroy() {
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
        }
        
        const container = document.getElementById('distraction-alerts');
        if (container) {
            container.remove();
        }
        
        const styles = document.getElementById('distraction-styles');
        if (styles) {
            styles.remove();
        }
        
        const modalStyles = document.getElementById('modal-styles');
        if (modalStyles) {
            modalStyles.remove();
        }
    }
}

// Initialize the distraction analyzer when the page loads
let distractionAnalyzer;

// Wait for DOM to be ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        distractionAnalyzer = new DistractionAnalyzer();
    });
} else {
    distractionAnalyzer = new DistractionAnalyzer();
}

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DistractionAnalyzer;
}