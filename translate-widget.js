// SAFE Global Translation Widget for Creepstate Investigation
// Prioritizes languages from high-trafficking regions for victim accessibility
// ENHANCED with bulletproof error handling to prevent documentElement errors

function addTranslationWidget() {
    // Ensure DOM is ready and safe
    if (!document || !document.documentElement || !document.head || !document.body) {
        console.warn('DOM not ready for translation widget, retrying...');
        setTimeout(addTranslationWidget, 100);
        return;
    }
    
    try {
        // Add CSS styles if not already present
        if (!document.getElementById('translate-widget-styles')) {
            const style = document.createElement('style');
            style.id = 'translate-widget-styles';
            style.textContent = `
            /* Language Selector - Fixed position for easy access */
            .language-selector {
                position: fixed;
                top: 10px;
                right: 10px;
                z-index: 10001;
                background: rgba(26, 26, 26, 0.95);
                backdrop-filter: blur(10px);
                border-radius: 25px;
                padding: 10px 15px;
                border: 2px solid #4ecdc4;
                box-shadow: 0 4px 15px rgba(0,0,0,0.3);
            }
            
            .language-label {
                color: #4ecdc4;
                font-size: 11px;
                margin-right: 8px;
                font-weight: bold;
            }
            
            /* Google Translate Widget Styling */
            .goog-te-banner-frame.skiptranslate {
                display: none !important;
            }
            
            body {
                top: 0px !important;
            }
            
            .goog-te-gadget {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif !important;
            }
            
            .goog-te-gadget .goog-te-combo {
                background: rgba(26, 26, 26, 0.95) !important;
                color: white !important;
                border: 1px solid #4ecdc4 !important;
                border-radius: 15px !important;
                padding: 5px 10px !important;
                font-size: 12px !important;
            }
            
            .goog-te-gadget .goog-te-combo option {
                background: #2d2d2d !important;
                color: white !important;
            }
        `;
            document.head.appendChild(style);
        }

        // Add HTML structure if not already present
        if (!document.getElementById('google_translate_element')) {
            const widget = document.createElement('div');
            widget.className = 'language-selector';
            widget.innerHTML = `
                <span class="language-label">🌐 Language:</span>
                <div id="google_translate_element"></div>
            `;
            
            // Safely insert widget
            if (document.body && document.body.firstChild) {
                document.body.insertBefore(widget, document.body.firstChild);
            } else if (document.body) {
                document.body.appendChild(widget);
            }
        }
        
        // Load Google Translate script safely
        loadGoogleTranslateScript();
        
    } catch (error) {
        console.warn('Error creating translation widget:', error);
        // Continue without translation widget rather than breaking the page
    }
}

function loadGoogleTranslateScript() {
    // Check if Google Translate script is already loaded
    if (window.google && window.google.translate) {
        console.log('Google Translate already loaded');
        googleTranslateElementInit();
        return;
    }
    
    // Prevent multiple script loads
    if (document.querySelector('script[src*="translate.google.com"]')) {
        console.log('Google Translate script already loading');
        return;
    }
    
    try {
        const script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
        script.onerror = function() {
            console.warn('Google Translate script failed to load - continuing without translation');
            // Hide the translation widget if script fails
            const widget = document.querySelector('.language-selector');
            if (widget) {
                widget.style.display = 'none';
            }
        };
        script.onload = function() {
            console.log('Google Translate script loaded successfully');
        };
        document.head.appendChild(script);
    } catch (error) {
        console.warn('Error loading Google Translate script:', error);
    }
}

// Google Translate Initialization - Comprehensive trafficking victim language support
function googleTranslateElementInit() {
    try {
        // Ensure Google Translate API is available
        if (!window.google || !window.google.translate || !window.google.translate.TranslateElement) {
            console.warn('Google Translate API not available');
            return;
        }
        
        // Ensure target element exists
        const targetElement = document.getElementById('google_translate_element');
        if (!targetElement) {
            console.warn('Google Translate target element not found');
            return;
        }
        
        new google.translate.TranslateElement({
        pageLanguage: 'en',
        // Comprehensive language list prioritizing trafficking source/destination countries:
        // 
        // HIGH PRIORITY (Major trafficking source/destination):
        // es = Spanish (Latin America - Mexico, Colombia, Guatemala, El Salvador)
        // ru = Russian (Eastern Europe, former Soviet states)
        // uk = Ukrainian (war displacement, high vulnerability)
        // zh-CN/zh-TW = Mandarin/Chinese (China, Taiwan - major source)
        // th = Thai (Thailand - major destination/transit)
        // tl = Filipino/Tagalog (Philippines - major source)
        // vi = Vietnamese (Vietnam - major source)
        // ko = Korean (South Korea - destination, North Korea - source)
        // hi = Hindi (India - major source)
        // ar = Arabic (Middle East - various countries)
        // pt = Portuguese (Brazil - major source/destination)
        // ro = Romanian (Romania - major EU source)
        // bg = Bulgarian (Bulgaria - major EU source)
        // tr = Turkish (Turkey - major transit)
        // pl = Polish (Poland - transit/destination)
        //
        // MEDIUM PRIORITY (Significant trafficking activity):
        // fr = French (West/Central Africa, France)
        // de = German (Germany - major destination)
        // it = Italian (Italy - major destination/transit)
        // hu = Hungarian (Hungary - transit/source)
        // cs = Czech (Czech Republic)
        // hr = Croatian (Croatia - Balkans)
        // sr = Serbian (Serbia - Balkans)
        // bs = Bosnian (Bosnia - Balkans)
        // sq = Albanian (Albania - major source)
        // mk = Macedonian (North Macedonia)
        // sl = Slovenian (Slovenia)
        // sk = Slovak (Slovakia)
        // et,lv,lt = Baltic states
        //
        // ADDITIONAL (Regional importance):
        // ja = Japanese (Japan - destination)
        // bn = Bengali (Bangladesh - source)
        // ur = Urdu (Pakistan - source)
        // fa = Persian/Farsi (Iran/Afghanistan)
        // he = Hebrew (Israel - destination)
        // ne = Nepali (Nepal - major source)
        // my = Burmese (Myanmar - source)
        // km = Khmer (Cambodia - source)
        // lo = Lao (Laos - source)
        // si = Sinhala (Sri Lanka - source)
        // ta = Tamil (India/Sri Lanka)
        // sw = Swahili (East Africa)
        // am = Amharic (Ethiopia)
        // ti = Tigrinya (Eritrea)
        // so = Somali (Somalia)
        // yo = Yoruba (Nigeria)
        // zu = Zulu (South Africa)
        // af = Afrikaans (South Africa)
        includedLanguages: 'es,ru,uk,zh-CN,zh-TW,th,tl,vi,ko,hi,ar,pt,ro,bg,tr,pl,fr,de,it,hu,cs,hr,sr,bs,sq,mk,sl,sk,et,lv,lt,ja,bn,ur,fa,he,ne,my,km,lo,si,ta,sw,am,ti,so,yo,zu,af,mt,ga,cy,eu,ca,gl,is,no,da,sv,fi,hy,az,kk,ky,uz,tg,mn,ka,be,gu,kn,ml,te,mr,or,as',
            layout: google.translate.TranslateElement.InlineLayout.SIMPLE,
            autoDisplay: false
        }, 'google_translate_element');
        
        console.log('Google Translate widget initialized successfully');
        
    } catch (error) {
        console.warn('Error initializing Google Translate widget:', error);
        // Hide the widget if initialization fails
        const widget = document.querySelector('.language-selector');
        if (widget) {
            widget.style.display = 'none';
        }
    }
}

// SAFE Auto-initialize when DOM is ready
function safeInitTranslation() {
    // Multiple safety checks
    if (!document || document.readyState === 'loading') {
        console.log('Waiting for DOM to be ready for translation widget...');
        document.addEventListener('DOMContentLoaded', addTranslationWidget);
        return;
    }
    
    // Extra safety delay to ensure everything is ready
    setTimeout(addTranslationWidget, 100);
}

// Initialize with multiple fallbacks
if (document.readyState === 'complete') {
    safeInitTranslation();
} else if (document.readyState === 'interactive') {
    setTimeout(safeInitTranslation, 100);
} else {
    document.addEventListener('DOMContentLoaded', safeInitTranslation);
    // Fallback timeout in case DOMContentLoaded doesn't fire
    setTimeout(safeInitTranslation, 2000);
}