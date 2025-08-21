/**
 * Trump-Epstein Timeline Version Management System
 * Centralized version tracking for all HTML pages
 * 
 * This file provides:
 * - Synchronized version numbers across all pages
 * - Build timestamp tracking
 * - Page-specific version information
 * - Console logging for debugging
 * - Footer and meta tag updates
 */

(function() {
    'use strict';
    
    // ========================================
    // VERSION CONFIGURATION
    // ========================================
    
    const VERSION_INFO = {
        major: 0,
        minor: 2,
        patch: 5,
        build: getBuildNumber(),
        timestamp: '2025-08-20T20:45:00Z',
        gitCommit: 'stable-2025-08-20', // Pre-release development
        environment: 'development',
        features: [
            'google-maps-kml-integration',
            'real-time-news-monitoring', 
            'automated-fact-checking',
            'container-auto-updates',
            'github-issues-tracking',
            'comprehensive-documentation'
        ],
        changelog: {
            'v0.2.5': {
                date: '2025-08-20',
                changes: [
                    'Added Google Maps KML flight visualization',
                    'Implemented real-time Reddit and news monitoring',
                    'Enhanced fact-checking with multi-source verification',
                    'Created automated container update system',
                    'Comprehensive GitHub issues tracking',
                    'Complete database schema documentation',
                    'Updated README with full feature overview'
                ]
            },
            'v0.2.4': {
                date: '2025-08-20',
                changes: [
                    'Enhanced timeline with future events through 2030',
                    'Added P. Diddy parallel trafficking network',
                    'Improved navigation consistency across pages',
                    'Fixed documentElement JavaScript errors',
                    'Added Kenneth Starr death event'
                ]
            }
        }
    };
    
    // ========================================
    // UTILITY FUNCTIONS
    // ========================================
    
    function getBuildNumber() {
        // Generate a build number based on current timestamp
        // In a real deployment, this would be set by the build system
        const now = new Date();
        const yearShort = now.getFullYear().toString().slice(-2);
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const hour = String(now.getHours()).padStart(2, '0');
        const minute = String(now.getMinutes()).padStart(2, '0');
        
        return `${yearShort}${month}${day}${hour}${minute}`;
    }
    
    function getVersionString() {
        return `v${VERSION_INFO.major}.${VERSION_INFO.minor}.${VERSION_INFO.patch}`;
    }
    
    function getFullVersionString() {
        return `v${VERSION_INFO.major}.${VERSION_INFO.minor}.${VERSION_INFO.patch}-${VERSION_INFO.build}`;
    }
    
    function getBuildTimestamp() {
        return new Date(VERSION_INFO.timestamp).toLocaleString('en-US', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            timeZoneName: 'short'
        });
    }
    
    function getCurrentPageName() {
        const path = window.location.pathname;
        const filename = path.split('/').pop() || 'index.html';
        return filename;
    }
    
    function getPageDisplayName(filename) {
        const pageNames = {
            'index.html': 'Interactive Timeline',
            'home.html': 'Home Page',
            'vertical-timeline.html': 'Vertical Timeline',
            'enhanced-visualizations.html': 'Network Visualizations',
            'stats.html': 'Statistics Dashboard',
            'names-and-shame.html': 'Associates Directory',
            'flight-logs.html': 'Flight Log Analysis',
            'resources.html': 'Victim Resources',
            'slideshow-timeline.html': 'Slideshow Timeline'
        };
        
        return pageNames[filename] || filename;
    }
    
    // ========================================
    // VERSION DISPLAY FUNCTIONS
    // ========================================
    
    function createVersionFooter() {
        const currentPage = getCurrentPageName();
        const pageDisplayName = getPageDisplayName(currentPage);
        const buildTime = getBuildTimestamp();
        
        const footerHTML = `
            <div class="version-info" id="versionInfo" style="
                background: rgba(0, 0, 0, 0.8);
                color: #ffffff;
                padding: 10px 20px;
                font-size: 12px;
                text-align: center;
                border-top: 2px solid #ff6b6b;
                font-family: 'Courier New', monospace;
                position: relative;
                z-index: 1000;
                backdrop-filter: blur(10px);
                border-radius: 0;
                margin-top: 40px;
            ">
                <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px;">
                    <div style="flex: 1; text-align: left; min-width: 200px;">
                        <strong>🔍 Trump-Epstein Timeline ${getVersionString()}</strong>
                    </div>
                    <div style="flex: 1; text-align: center; min-width: 250px;">
                        Built: ${buildTime} | Page: ${pageDisplayName}
                    </div>
                    <div style="flex: 1; text-align: right; min-width: 150px;">
                        <span onclick="copyVersionInfo()" style="cursor: pointer; text-decoration: underline; color: #4ecdc4;" title="Click to copy version info">
                            📋 Copy Version
                        </span>
                    </div>
                </div>
                <div style="font-size: 10px; color: #cccccc; margin-top: 5px; text-align: center;">
                    Build: ${VERSION_INFO.build} | Commit: ${VERSION_INFO.gitCommit} | Environment: ${VERSION_INFO.environment}
                </div>
            </div>
        `;
        
        return footerHTML;
    }
    
    function addVersionToMetaTags() {
        // Add version meta tag
        const versionMeta = document.createElement('meta');
        versionMeta.name = 'version';
        versionMeta.content = `${getFullVersionString()}-${VERSION_INFO.timestamp.split('T')[0]}`;
        document.head.appendChild(versionMeta);
        
        // Add build info meta tag
        const buildMeta = document.createElement('meta');
        buildMeta.name = 'build-info';
        buildMeta.content = `${VERSION_INFO.build}|${VERSION_INFO.gitCommit}|${VERSION_INFO.environment}`;
        document.head.appendChild(buildMeta);
        
        // Add last modified meta tag
        const lastModifiedMeta = document.createElement('meta');
        lastModifiedMeta.name = 'last-modified';
        lastModifiedMeta.content = VERSION_INFO.timestamp;
        document.head.appendChild(lastModifiedMeta);
    }
    
    function logVersionToConsole() {
        const currentPage = getCurrentPageName();
        const pageDisplayName = getPageDisplayName(currentPage);
        
        // ASCII art banner
        console.log(`
╔═══════════════════════════════════════════════════════════════╗
║                    🔍 TIMELINE SYSTEM LOADED                  ║
╠═══════════════════════════════════════════════════════════════╣
║  Version: ${getVersionString().padEnd(20)} Build: ${VERSION_INFO.build.padEnd(12)} ║
║  Page: ${pageDisplayName.padEnd(23)} Environment: ${VERSION_INFO.environment.padEnd(8)} ║
║  Built: ${getBuildTimestamp().padEnd(30)} ║
║  Commit: ${VERSION_INFO.gitCommit.padEnd(8)} Timestamp: ${VERSION_INFO.timestamp.padEnd(20)} ║
╚═══════════════════════════════════════════════════════════════╝
        `);
        
        console.log('🔍 Timeline System v' + getVersionString() + ' loaded successfully');
        console.log('📄 Current page:', pageDisplayName);
        console.log('🏗️ Build information:', {
            version: getFullVersionString(),
            build: VERSION_INFO.build,
            timestamp: VERSION_INFO.timestamp,
            commit: VERSION_INFO.gitCommit,
            environment: VERSION_INFO.environment,
            page: currentPage
        });
        
        // Performance tracking
        if (window.performance && window.performance.timing) {
            const loadTime = window.performance.timing.loadEventEnd - window.performance.timing.navigationStart;
            if (loadTime > 0) {
                console.log('⚡ Page load time:', loadTime + 'ms');
            }
        }
        
        // Feature detection
        const features = {
            localStorage: typeof(Storage) !== "undefined",
            webGL: !!window.WebGLRenderingContext,
            geolocation: !!navigator.geolocation,
            serviceWorker: 'serviceWorker' in navigator,
            webAssembly: typeof WebAssembly === 'object'
        };
        console.log('🔧 Browser features:', features);
    }
    
    function copyVersionInfo() {
        const currentPage = getCurrentPageName();
        const pageDisplayName = getPageDisplayName(currentPage);
        const buildTime = getBuildTimestamp();
        
        const versionText = `Trump-Epstein Timeline ${getVersionString()}
Page: ${pageDisplayName}
Build: ${VERSION_INFO.build}
Built: ${buildTime}
Commit: ${VERSION_INFO.gitCommit}
Environment: ${VERSION_INFO.environment}
URL: ${window.location.href}
User Agent: ${navigator.userAgent}
Timestamp: ${new Date().toISOString()}`;

        if (navigator.clipboard && window.isSecureContext) {
            navigator.clipboard.writeText(versionText).then(() => {
                showVersionCopyNotification('Version information copied to clipboard!');
            }).catch(err => {
                console.error('Failed to copy version info:', err);
                fallbackCopyVersionInfo(versionText);
            });
        } else {
            fallbackCopyVersionInfo(versionText);
        }
    }
    
    function fallbackCopyVersionInfo(text) {
        // Create a temporary textarea element
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.left = '-9999px';
        textarea.style.top = '-9999px';
        document.body.appendChild(textarea);
        
        try {
            textarea.select();
            textarea.setSelectionRange(0, 99999); // For mobile devices
            const successful = document.execCommand('copy');
            
            if (successful) {
                showVersionCopyNotification('Version information copied to clipboard!');
            } else {
                showVersionCopyNotification('Please manually copy the version info from console', true);
                console.log('VERSION INFO TO COPY:\n', text);
            }
        } catch (err) {
            console.error('Fallback copy failed:', err);
            showVersionCopyNotification('Copy failed - check console for version info', true);
            console.log('VERSION INFO:\n', text);
        } finally {
            document.body.removeChild(textarea);
        }
    }
    
    function showVersionCopyNotification(message, isError = false) {
        // Create notification element
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${isError ? '#ff6b6b' : '#4ecdc4'};
            color: white;
            padding: 15px 20px;
            border-radius: 8px;
            font-size: 14px;
            font-weight: bold;
            z-index: 10000;
            box-shadow: 0 4px 15px rgba(0,0,0,0.3);
            transform: translateX(400px);
            transition: transform 0.3s ease;
            max-width: 300px;
            word-wrap: break-word;
        `;
        
        notification.innerHTML = `
            <div style="display: flex; align-items: center; gap: 10px;">
                <span>${isError ? '⚠️' : '✅'}</span>
                <span>${message}</span>
                <span onclick="this.parentElement.parentElement.remove()" style="cursor: pointer; margin-left: auto; font-size: 18px;">×</span>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Auto remove after 4 seconds
        setTimeout(() => {
            notification.style.transform = 'translateX(400px)';
            setTimeout(() => {
                if (notification.parentElement) {
                    notification.parentElement.removeChild(notification);
                }
            }, 300);
        }, 4000);
    }
    
    function addVersionIndicator() {
        // Add a small version indicator in the corner
        const indicator = document.createElement('div');
        indicator.id = 'versionIndicator';
        indicator.style.cssText = `
            position: fixed;
            top: 10px;
            left: 10px;
            background: rgba(0, 0, 0, 0.8);
            color: #4ecdc4;
            padding: 5px 10px;
            border-radius: 12px;
            font-size: 11px;
            font-family: 'Courier New', monospace;
            z-index: 9999;
            cursor: pointer;
            transition: all 0.3s ease;
            backdrop-filter: blur(5px);
            border: 1px solid rgba(78, 205, 196, 0.3);
        `;
        
        indicator.textContent = getVersionString();
        indicator.title = 'Click for version details';
        
        indicator.addEventListener('click', () => {
            logVersionToConsole();
            copyVersionInfo();
        });
        
        indicator.addEventListener('mouseenter', () => {
            indicator.style.transform = 'scale(1.1)';
            indicator.style.background = 'rgba(78, 205, 196, 0.2)';
        });
        
        indicator.addEventListener('mouseleave', () => {
            indicator.style.transform = 'scale(1)';
            indicator.style.background = 'rgba(0, 0, 0, 0.8)';
        });
        
        document.body.appendChild(indicator);
    }
    
    // ========================================
    // INITIALIZATION
    // ========================================
    
    function initializeVersionSystem() {
        try {
            // Add meta tags
            addVersionToMetaTags();
            
            // Log to console
            logVersionToConsole();
            
            // Add version footer when page is loaded
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', addVersionFooterToPage);
            } else {
                addVersionFooterToPage();
            }
            
            // Add version indicator
            addVersionIndicator();
            
            // Make copyVersionInfo globally available
            window.copyVersionInfo = copyVersionInfo;
            
            // Expose version info globally for debugging
            window.VERSION_INFO = VERSION_INFO;
            window.getVersionString = getVersionString;
            window.getFullVersionString = getFullVersionString;
            
        } catch (error) {
            console.error('Error initializing version system:', error);
        }
    }
    
    function addVersionFooterToPage() {
        // Find existing footer or create one
        let footer = document.querySelector('footer, .footer');
        if (!footer) {
            // Try to find the last element in body
            const bodyChildren = document.body.children;
            const lastElement = bodyChildren[bodyChildren.length - 1];
            
            // Insert after the last element
            const versionFooter = document.createElement('div');
            versionFooter.innerHTML = createVersionFooter();
            document.body.appendChild(versionFooter);
        } else {
            // Add to existing footer
            const versionDiv = document.createElement('div');
            versionDiv.innerHTML = createVersionFooter();
            footer.parentNode.insertBefore(versionDiv, footer.nextSibling);
        }
    }
    
    // ========================================
    // VERSION CHECKING & UPDATES
    // ========================================
    
    function checkForUpdates() {
        // In a real implementation, this would check a remote endpoint for version updates
        const lastCheckKey = 'timeline_version_last_check';
        const lastVersionKey = 'timeline_version_last_known';
        
        const now = new Date().getTime();
        const lastCheck = localStorage.getItem(lastCheckKey);
        const lastKnownVersion = localStorage.getItem(lastVersionKey);
        
        // Check every 6 hours
        if (!lastCheck || (now - parseInt(lastCheck)) > (6 * 60 * 60 * 1000)) {
            localStorage.setItem(lastCheckKey, now.toString());
            
            if (lastKnownVersion && lastKnownVersion !== getFullVersionString()) {
                console.log('🆕 New version detected:', getFullVersionString(), 'Previous:', lastKnownVersion);
                showVersionUpdateNotification();
            }
            
            localStorage.setItem(lastVersionKey, getFullVersionString());
        }
    }
    
    function showVersionUpdateNotification() {
        // Create update notification
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: linear-gradient(135deg, #ff6b6b, #4ecdc4);
            color: white;
            padding: 25px;
            border-radius: 15px;
            font-size: 16px;
            font-weight: bold;
            z-index: 15000;
            box-shadow: 0 10px 30px rgba(0,0,0,0.5);
            max-width: 400px;
            text-align: center;
            animation: fadeInScale 0.5s ease;
        `;
        
        notification.innerHTML = `
            <div style="margin-bottom: 15px;">🎉 Timeline Updated!</div>
            <div style="font-size: 14px; margin-bottom: 20px; font-weight: normal;">
                A new version (${getVersionString()}) of the Trump-Epstein Timeline is now available with improved features and data.
            </div>
            <div style="display: flex; gap: 10px; justify-content: center;">
                <button onclick="location.reload()" style="padding: 10px 20px; background: white; color: #333; border: none; border-radius: 8px; cursor: pointer; font-weight: bold;">
                    🔄 Refresh Now
                </button>
                <button onclick="this.parentElement.parentElement.remove()" style="padding: 10px 20px; background: rgba(255,255,255,0.2); color: white; border: 1px solid white; border-radius: 8px; cursor: pointer;">
                    Later
                </button>
            </div>
        `;
        
        // Add animation keyframes
        if (!document.getElementById('versionAnimations')) {
            const style = document.createElement('style');
            style.id = 'versionAnimations';
            style.textContent = `
                @keyframes fadeInScale {
                    from { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
                    to { opacity: 1; transform: translate(-50%, -50%) scale(1); }
                }
            `;
            document.head.appendChild(style);
        }
        
        document.body.appendChild(notification);
        
        // Auto-remove after 10 seconds
        setTimeout(() => {
            if (notification.parentElement) {
                notification.style.animation = 'fadeInScale 0.5s ease reverse';
                setTimeout(() => {
                    if (notification.parentElement) {
                        notification.parentElement.removeChild(notification);
                    }
                }, 500);
            }
        }, 10000);
    }
    
    // ========================================
    // START THE SYSTEM
    // ========================================
    
    // Initialize immediately if DOM is ready, otherwise wait
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeVersionSystem);
    } else {
        initializeVersionSystem();
    }
    
    // Check for updates when page loads
    window.addEventListener('load', checkForUpdates);
    
})();