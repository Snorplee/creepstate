/**
 * Service Worker for Trump-Epstein Timeline
 * Provides offline functionality and caching
 */

const CACHE_NAME = 'trumpstein-timeline-v1.0';
const urlsToCache = [
    './',
    './index.html',
    './version.js',
    './dark-mode.js',
    './photo-database.js',
    './photo-components.js',
    './static-data.js',
    './timeline-comprehensive.xml',
    // Add more critical resources as needed
];

// Install event - cache resources
self.addEventListener('install', event => {
    console.log('Service Worker installing...');
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Caching app shell');
                return cache.addAll(urlsToCache);
            })
            .catch(error => {
                console.error('Cache installation failed:', error);
            })
    );
});

// Activate event - cleanup old caches
self.addEventListener('activate', event => {
    console.log('Service Worker activating...');
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

// Fetch event - serve from cache with network fallback
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                // Return cached version or fetch from network
                if (response) {
                    console.log('Serving from cache:', event.request.url);
                    return response;
                }
                
                return fetch(event.request).then(response => {
                    // Don't cache non-successful responses
                    if (!response || response.status !== 200 || response.type !== 'basic') {
                        return response;
                    }
                    
                    // Clone the response
                    const responseToCache = response.clone();
                    
                    caches.open(CACHE_NAME)
                        .then(cache => {
                            cache.put(event.request, responseToCache);
                        });
                    
                    return response;
                });
            })
            .catch(() => {
                // Return a fallback page for navigation requests
                if (event.request.destination === 'document') {
                    return caches.match('./index.html');
                }
                
                // Return a fallback response for other requests
                return new Response('Offline - Content Not Available', {
                    status: 503,
                    statusText: 'Service Unavailable'
                });
            })
    );
});