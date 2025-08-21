/**
 * Static Data Fallback System
 * Provides offline functionality when database connections fail
 */

(function() {
    'use strict';
    
    // Static investigation data for offline use
    const STATIC_DATA = {
        timeline_events: [
            {
                id: 1,
                date: '2019-07-06',
                title: 'Jeffrey Epstein Arrested',
                description: 'Epstein arrested on federal sex trafficking charges at Teterboro Airport',
                category: 'legal',
                evidenceLevel: 'confirmed',
                people: ['Jeffrey Epstein'],
                locations: ['Teterboro Airport', 'New York']
            },
            {
                id: 2,
                date: '2019-08-10',
                title: 'Jeffrey Epstein Found Dead',
                description: 'Epstein found dead in his jail cell at Metropolitan Correctional Center',
                category: 'deaths',
                evidenceLevel: 'confirmed',
                people: ['Jeffrey Epstein'],
                locations: ['Metropolitan Correctional Center', 'New York']
            },
            {
                id: 3,
                date: '2021-12-29',
                title: 'Ghislaine Maxwell Convicted',
                description: 'Maxwell found guilty on 5 of 6 federal charges related to sex trafficking',
                category: 'legal',
                evidenceLevel: 'confirmed',
                people: ['Ghislaine Maxwell'],
                locations: ['Federal Court', 'New York']
            },
            {
                id: 4,
                date: '1992-02-12',
                title: 'Trump-Epstein Mar-a-Lago Party',
                description: 'Trump and Epstein photographed together at Mar-a-Lago party',
                category: 'events',
                evidenceLevel: 'confirmed',
                people: ['Donald Trump', 'Jeffrey Epstein'],
                locations: ['Mar-a-Lago', 'Palm Beach']
            },
            {
                id: 5,
                date: '2001-03-13',
                title: 'Prince Andrew Photo with Giuffre',
                description: 'Famous photo of Prince Andrew with Virginia Giuffre and Ghislaine Maxwell',
                category: 'evidence',
                evidenceLevel: 'confirmed',
                people: ['Prince Andrew', 'Virginia Giuffre', 'Ghislaine Maxwell'],
                locations: ['London']
            }
        ],
        
        network_data: {
            nodes: [
                { id: 'jeffrey-epstein', name: 'Jeffrey Epstein', category: 'core', connections: 5 },
                { id: 'ghislaine-maxwell', name: 'Ghislaine Maxwell', category: 'core', connections: 4 },
                { id: 'donald-trump', name: 'Donald Trump', category: 'politicians', connections: 3 },
                { id: 'bill-clinton', name: 'Bill Clinton', category: 'politicians', connections: 2 },
                { id: 'prince-andrew', name: 'Prince Andrew', category: 'royalty', connections: 2 },
                { id: 'virginia-giuffre', name: 'Virginia Giuffre', category: 'victims', connections: 3 }
            ],
            links: [
                { source: 'jeffrey-epstein', target: 'ghislaine-maxwell', strength: 5 },
                { source: 'jeffrey-epstein', target: 'donald-trump', strength: 3 },
                { source: 'jeffrey-epstein', target: 'bill-clinton', strength: 2 },
                { source: 'jeffrey-epstein', target: 'prince-andrew', strength: 2 },
                { source: 'ghislaine-maxwell', target: 'prince-andrew', strength: 3 },
                { source: 'ghislaine-maxwell', target: 'virginia-giuffre', strength: 4 }
            ]
        },
        
        statistics: {
            total_events: 100,
            confirmed_victims: 1000,
            network_associates: 89,
            years_documented: 40,
            investigation_activity: {
                labels: ['2005', '2008', '2015', '2019', '2020', '2021', '2022', '2023', '2024', '2025'],
                investigation: [2, 1, 3, 15, 25, 35, 20, 15, 12, 18],
                media_coverage: [1, 2, 5, 45, 60, 40, 25, 20, 18, 22],
                public_awareness: [1, 1, 2, 30, 50, 45, 35, 30, 35, 40]
            }
        },
        
        latest_updates: [
            {
                date: 'August 20, 2025',
                title: 'Robert Maxwell Intelligence Connections Added',
                description: 'Added detailed timeline of Robert Maxwell\'s death, Israeli state funeral, and triple agent status (Mossad/MI6/KGB).'
            },
            {
                date: 'August 20, 2025',
                title: 'Advanced Filtering System',
                description: 'New person and geographic filters allow drilling down by Trump, Epstein, Maxwell, or locations like Mar-a-Lago and Little St. James.'
            },
            {
                date: 'August 19, 2025',
                title: 'Trump Distraction Analysis Dashboard',
                description: 'Real-time monitoring of Trump\'s distraction tactics including military deployments, territorial claims, and celebrity threats.'
            },
            {
                date: 'August 19, 2025',
                title: 'Flight Log Integration',
                description: 'Complete Lolita Express flight data with passenger frequency analysis and route visualization.'
            },
            {
                date: 'August 18, 2025',
                title: 'Victim Scale Update',
                description: 'Updated victim representation to reflect true scale of 1000+ victims across US, UK, EU, and Asia-Pacific regions.'
            }
        ]
    };
    
    // Performance optimization utilities
    const PerformanceManager = {
        // Lazy load images
        lazyLoadImages() {
            if ('IntersectionObserver' in window) {
                const imageObserver = new IntersectionObserver((entries, observer) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            const img = entry.target;
                            img.src = img.dataset.src;
                            img.classList.remove('lazy-load');
                            imageObserver.unobserve(img);
                        }
                    });
                });
                
                document.querySelectorAll('img[data-src]').forEach(img => {
                    imageObserver.observe(img);
                });
            } else {
                // Fallback for older browsers
                document.querySelectorAll('img[data-src]').forEach(img => {
                    img.src = img.dataset.src;
                });
            }
        },
        
        // Cache static resources
        cacheResources() {
            if ('serviceWorker' in navigator) {
                navigator.serviceWorker.register('./sw.js')
                    .then(registration => {
                        console.log('Service Worker registered:', registration);
                    })
                    .catch(error => {
                        console.log('Service Worker registration failed:', error);
                    });
            }
        },
        
        // Preload critical resources
        preloadCritical() {
            const criticalResources = [
                './version.js',
                './dark-mode.js',
                './photo-database.js'
            ];
            
            criticalResources.forEach(resource => {
                const link = document.createElement('link');
                link.rel = 'preload';
                link.as = 'script';
                link.href = resource;
                document.head.appendChild(link);
            });
        },
        
        // Optimize CSS delivery
        optimizeCSS() {
            // Inline critical CSS is already in the HTML
            // Non-critical CSS can be loaded asynchronously
            const nonCriticalCSS = [
                'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap'
            ];
            
            nonCriticalCSS.forEach(href => {
                const link = document.createElement('link');
                link.rel = 'stylesheet';
                link.href = href;
                link.media = 'print';
                link.onload = function() { this.media = 'all'; };
                document.head.appendChild(link);
            });
        }
    };
    
    // Static Data Manager
    const StaticDataManager = {
        isOnline: navigator.onLine,
        
        init() {
            this.checkConnectivity();
            this.setupEventListeners();
            this.loadStaticData();
        },
        
        checkConnectivity() {
            // Test connectivity by trying to fetch a small resource
            fetch('./version.js?t=' + Date.now(), { 
                method: 'HEAD',
                cache: 'no-cache',
                signal: AbortSignal.timeout(3000)
            })
                .then(response => {
                    this.isOnline = response.ok;
                    this.updateConnectivityStatus();
                })
                .catch(() => {
                    this.isOnline = false;
                    this.updateConnectivityStatus();
                });
        },
        
        setupEventListeners() {
            window.addEventListener('online', () => {
                this.isOnline = true;
                this.updateConnectivityStatus();
                console.log('Connection restored');
            });
            
            window.addEventListener('offline', () => {
                this.isOnline = false;
                this.updateConnectivityStatus();
                console.log('Connection lost - switching to offline mode');
            });
        },
        
        updateConnectivityStatus() {
            const indicator = document.getElementById('connectivity-indicator');
            if (!indicator) {
                this.createConnectivityIndicator();
            }
            
            const status = this.isOnline ? 'online' : 'offline';
            document.body.dataset.connectivity = status;
            
            if (!this.isOnline) {
                this.showOfflineMessage();
            }
        },
        
        createConnectivityIndicator() {
            const indicator = document.createElement('div');
            indicator.id = 'connectivity-indicator';
            indicator.style.cssText = `
                position: fixed;
                top: 60px;
                right: 20px;
                background: rgba(0,0,0,0.8);
                color: white;
                padding: 8px 16px;
                border-radius: 20px;
                font-size: 12px;
                z-index: 9000;
                transition: all 0.3s ease;
                opacity: 0;
            `;
            document.body.appendChild(indicator);
        },
        
        showOfflineMessage() {
            const indicator = document.getElementById('connectivity-indicator');
            if (indicator) {
                indicator.textContent = '📴 Offline Mode - Using Cached Data';
                indicator.style.opacity = '1';
                indicator.style.background = '#ff6b6b';
                
                setTimeout(() => {
                    indicator.style.opacity = '0';
                }, 5000);
            }
        },
        
        loadStaticData() {
            // Make static data available globally
            window.STATIC_DATA = STATIC_DATA;
            
            // Load static updates
            this.populateLatestUpdates();
            
            // Load static statistics
            this.populateStatistics();
            
            console.log('Static data loaded and ready for offline use');
        },
        
        populateLatestUpdates() {
            const updateFeed = document.querySelector('.update-feed');
            if (updateFeed && !this.isOnline) {
                updateFeed.innerHTML = '';
                STATIC_DATA.latest_updates.forEach(update => {
                    const item = document.createElement('div');
                    item.className = 'update-item';
                    item.innerHTML = `
                        <div class="update-date">${update.date}</div>
                        <div class="update-title">${update.title}</div>
                        <div class="update-description">${update.description}</div>
                    `;
                    updateFeed.appendChild(item);
                });
            }
        },
        
        populateStatistics() {
            const stats = STATIC_DATA.statistics;
            
            // Update stat cards
            const statCards = document.querySelectorAll('.stat-card');
            if (statCards.length >= 4) {
                statCards[0].querySelector('.stat-number').textContent = stats.confirmed_victims + '+';
                statCards[1].querySelector('.stat-number').textContent = stats.total_events + '+';
                statCards[2].querySelector('.stat-number').textContent = stats.network_associates + '+';
                statCards[3].querySelector('.stat-number').textContent = stats.years_documented + '+';
            }
        }
    };
    
    // Database fallback system
    const DatabaseFallback = {
        init() {
            // Override photo database if it fails
            if (typeof window.photoDatabase === 'undefined') {
                this.createPhotoFallback();
            }
        },
        
        createPhotoFallback() {
            window.photoDatabase = {
                photos: new Map(),
                people: new Map(),
                searchPhotos: function(query) {
                    console.log('Photo database offline - search disabled');
                    return [];
                },
                getPhotosByPerson: function(personId) {
                    console.log('Photo database offline');
                    return [];
                }
            };
            
            console.log('Photo database fallback created');
        }
    };
    
    // Initialize everything when DOM is ready
    function initialize() {
        try {
            StaticDataManager.init();
            DatabaseFallback.init();
            PerformanceManager.preloadCritical();
            PerformanceManager.optimizeCSS();
            
            // Delay non-critical optimizations
            setTimeout(() => {
                PerformanceManager.lazyLoadImages();
                PerformanceManager.cacheResources();
            }, 1000);
            
        } catch (error) {
            console.error('Static data initialization failed:', error);
        }
    }
    
    // Start initialization
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        initialize();
    }
    
    // Export for global access
    window.StaticDataManager = StaticDataManager;
    window.PerformanceManager = PerformanceManager;
    
})();