/**
 * Universal Dark Mode Toggle System
 * Provides consistent dark/light mode switching across all pages
 */

(function() {
    'use strict';

    // Dark mode configuration
    const DARK_MODE_CONFIG = {
        storageKey: 'trumpstein-timeline-dark-mode',
        toggleButtonId: 'darkModeToggle',
        darkClass: 'dark-mode',
        defaultMode: 'dark' // Default to dark mode for investigation theme
    };

    // CSS variables for dark/light themes
    const THEME_VARIABLES = {
        light: {
            '--bg-color': '#f5f5f5',
            '--container-bg': 'white',
            '--text-color': '#333',
            '--border-color': '#ddd',
            '--search-bg': '#f0f0f0',
            '--info-bg': '#f9f9f9',
            '--modal-bg': 'rgba(0,0,0,0.5)',
            '--input-bg': 'white',
            '--input-border': '#ddd',
            '--card-bg': '#ffffff',
            '--nav-bg': 'rgba(255,255,255,0.95)',
            '--footer-bg': '#f8f9fa'
        },
        dark: {
            '--bg-color': '#1a1a1a',
            '--container-bg': '#2d2d2d',
            '--text-color': '#e0e0e0',
            '--border-color': '#444',
            '--search-bg': '#333',
            '--info-bg': '#333',
            '--modal-bg': 'rgba(0,0,0,0.8)',
            '--input-bg': '#444',
            '--input-border': '#555',
            '--card-bg': '#2d2d2d',
            '--nav-bg': 'rgba(26, 26, 26, 0.95)',
            '--footer-bg': '#222'
        }
    };

    class DarkModeManager {
        constructor() {
            this.currentMode = this.getSavedMode();
            this.init();
        }

        init() {
            this.createToggleButton();
            this.applyTheme(this.currentMode);
            this.setupEventListeners();
            this.injectCSS();
            console.log('🌙 Dark Mode Manager initialized');
        }

        getSavedMode() {
            const saved = localStorage.getItem(DARK_MODE_CONFIG.storageKey);
            return saved || DARK_MODE_CONFIG.defaultMode;
        }

        saveMode(mode) {
            localStorage.setItem(DARK_MODE_CONFIG.storageKey, mode);
        }

        createToggleButton() {
            // Check if toggle already exists
            if (document.getElementById(DARK_MODE_CONFIG.toggleButtonId)) {
                return;
            }

            const toggle = document.createElement('button');
            toggle.id = DARK_MODE_CONFIG.toggleButtonId;
            toggle.className = 'dark-mode-toggle';
            toggle.setAttribute('aria-label', 'Toggle dark mode');
            toggle.innerHTML = this.getToggleIcon();
            
            // Add to page (try multiple locations)
            this.insertToggleButton(toggle);
        }

        insertToggleButton(toggle) {
            // Try to insert in existing theme toggle location
            const existingToggle = document.querySelector('.theme-toggle');
            if (existingToggle) {
                existingToggle.parentNode.replaceChild(toggle, existingToggle);
                return;
            }

            // Try to insert in navigation
            const nav = document.querySelector('.nav-container, .universal-nav .nav-container');
            if (nav) {
                toggle.style.cssText += 'margin-left: auto;';
                nav.appendChild(toggle);
                return;
            }

            // Fallback: insert as fixed position
            toggle.style.cssText += `
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 10000;
            `;
            document.body.appendChild(toggle);
        }

        getToggleIcon() {
            const isDark = this.currentMode === 'dark';
            return isDark ? '☀️' : '🌙';
        }

        setupEventListeners() {
            const toggle = document.getElementById(DARK_MODE_CONFIG.toggleButtonId);
            if (toggle) {
                toggle.addEventListener('click', () => this.toggleMode());
            }

            // Listen for storage changes (sync across tabs)
            window.addEventListener('storage', (e) => {
                if (e.key === DARK_MODE_CONFIG.storageKey) {
                    this.currentMode = e.newValue || DARK_MODE_CONFIG.defaultMode;
                    this.applyTheme(this.currentMode);
                    this.updateToggleIcon();
                }
            });
        }

        toggleMode() {
            this.currentMode = this.currentMode === 'dark' ? 'light' : 'dark';
            this.applyTheme(this.currentMode);
            this.saveMode(this.currentMode);
            this.updateToggleIcon();
            this.showModeNotification();
        }

        applyTheme(mode) {
            const root = document.documentElement;
            const vars = THEME_VARIABLES[mode];
            
            // Apply CSS variables
            Object.entries(vars).forEach(([property, value]) => {
                root.style.setProperty(property, value);
            });

            // Apply dark mode class
            if (mode === 'dark') {
                document.body.classList.add(DARK_MODE_CONFIG.darkClass);
                document.documentElement.setAttribute('data-theme', 'dark');
            } else {
                document.body.classList.remove(DARK_MODE_CONFIG.darkClass);
                document.documentElement.setAttribute('data-theme', 'light');
            }

            // Update charts if they exist
            this.updateChartThemes();
        }

        updateToggleIcon() {
            const toggle = document.getElementById(DARK_MODE_CONFIG.toggleButtonId);
            if (toggle) {
                toggle.innerHTML = this.getToggleIcon();
            }
        }

        updateChartThemes() {
            // Update Chart.js themes if charts exist
            if (typeof Chart !== 'undefined' && Chart.instances) {
                const isDark = this.currentMode === 'dark';
                const textColor = isDark ? '#e0e0e0' : '#333';
                const gridColor = isDark ? '#444' : '#ddd';

                Chart.instances.forEach(chart => {
                    if (chart.options.scales) {
                        // Update axis colors
                        Object.values(chart.options.scales).forEach(scale => {
                            if (scale.ticks) scale.ticks.color = textColor;
                            if (scale.grid) scale.grid.color = gridColor;
                        });
                    }
                    
                    // Update legend
                    if (chart.options.plugins?.legend?.labels) {
                        chart.options.plugins.legend.labels.color = textColor;
                    }
                    
                    chart.update('none');
                });
            }
        }

        showModeNotification() {
            const notification = document.createElement('div');
            notification.className = 'mode-notification';
            notification.innerHTML = `
                <span>${this.currentMode === 'dark' ? '🌙' : '☀️'}</span>
                ${this.currentMode === 'dark' ? 'Dark' : 'Light'} mode enabled
            `;
            
            notification.style.cssText = `
                position: fixed;
                top: 80px;
                right: 20px;
                background: var(--container-bg);
                color: var(--text-color);
                border: 1px solid var(--border-color);
                padding: 12px 20px;
                border-radius: 8px;
                box-shadow: 0 4px 15px rgba(0,0,0,0.3);
                z-index: 10001;
                font-size: 14px;
                font-weight: bold;
                opacity: 0;
                transform: translateX(100%);
                transition: all 0.3s ease;
            `;
            
            document.body.appendChild(notification);
            
            // Animate in
            setTimeout(() => {
                notification.style.opacity = '1';
                notification.style.transform = 'translateX(0)';
            }, 100);
            
            // Remove after 2 seconds
            setTimeout(() => {
                notification.style.opacity = '0';
                notification.style.transform = 'translateX(100%)';
                setTimeout(() => {
                    if (notification.parentNode) {
                        notification.parentNode.removeChild(notification);
                    }
                }, 300);
            }, 2000);
        }

        injectCSS() {
            if (document.getElementById('dark-mode-styles')) return;

            const style = document.createElement('style');
            style.id = 'dark-mode-styles';
            style.textContent = `
                .dark-mode-toggle {
                    background: var(--container-bg);
                    border: 1px solid var(--border-color);
                    color: var(--text-color);
                    padding: 10px;
                    border-radius: 50%;
                    cursor: pointer;
                    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                    transition: all 0.3s ease;
                    font-size: 16px;
                    width: 45px;
                    height: 45px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .dark-mode-toggle:hover {
                    transform: scale(1.1);
                    box-shadow: 0 4px 15px rgba(0,0,0,0.2);
                }

                .dark-mode-toggle:active {
                    transform: scale(0.95);
                }

                /* Dark mode specific styles */
                .dark-mode {
                    background: var(--bg-color);
                    color: var(--text-color);
                }

                .dark-mode .card,
                .dark-mode .person-card,
                .dark-mode .dashboard-panel,
                .dark-mode .section {
                    background: var(--container-bg);
                    border-color: var(--border-color);
                }

                .dark-mode input,
                .dark-mode select,
                .dark-mode textarea {
                    background: var(--input-bg);
                    border-color: var(--input-border);
                    color: var(--text-color);
                }

                .dark-mode .btn {
                    background: var(--container-bg);
                    border-color: var(--border-color);
                    color: var(--text-color);
                }

                .dark-mode .nav-bar,
                .dark-mode .universal-nav {
                    background: var(--nav-bg);
                    border-color: var(--border-color);
                }

                /* Smooth transitions for theme changes */
                * {
                    transition: background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease;
                }
            `;
            
            document.head.appendChild(style);
        }
    }

    // Initialize when DOM is ready
    function initializeDarkMode() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                new DarkModeManager();
            });
        } else {
            new DarkModeManager();
        }
    }

    // Start immediately
    initializeDarkMode();

    // Expose globally for manual control
    window.DarkModeManager = DarkModeManager;

})();