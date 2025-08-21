#!/bin/bash

# Creepstate Investigation Platform - Anonymous Distribution Helper
# This script helps prepare the investigation for anonymous distribution

set -e

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

log() {
    echo -e "${GREEN}[DIST] $1${NC}"
}

warning() {
    echo -e "${YELLOW}[WARNING] $1${NC}"
}

error() {
    echo -e "${RED}[ERROR] $1${NC}"
}

info() {
    echo -e "${BLUE}[INFO] $1${NC}"
}

# Show distribution menu
show_menu() {
    echo ""
    echo "╔══════════════════════════════════════════════════════════════╗"
    echo "║        🕴️ Creepstate Investigation Platform - Distribution Helper        ║"
    echo "╠══════════════════════════════════════════════════════════════╣"
    echo "║  1) Create distribution package                              ║"
    echo "║  2) Generate IPFS-ready bundle                               ║"
    echo "║  3) Create torrent file                                      ║"
    echo "║  4) Generate QR codes for links                              ║"
    echo "║  5) Create social media graphics                             ║"
    echo "║  6) Security check                                           ║"
    echo "║  7) View distribution guide                                  ║"
    echo "║  0) Exit                                                     ║"
    echo "╚══════════════════════════════════════════════════════════════╝"
    echo ""
}

# Security checks
security_check() {
    log "🔒 Performing security checks..."
    
    # Check Tor
    if curl -s --proxy socks5h://127.0.0.1:9050 "https://check.torproject.org/api/ip" | grep -q "true"; then
        log "✅ Tor is active"
    else
        warning "⚠️  Tor not detected - RECOMMENDED for anonymous distribution"
        info "Install Tor: sudo apt install tor"
    fi
    
    # Check VPN
    REAL_IP=$(curl -s ifconfig.me 2>/dev/null || echo "unknown")
    TOR_IP=$(curl -s --proxy socks5h://127.0.0.1:9050 ifconfig.me 2>/dev/null || echo "unknown")
    
    if [ "$REAL_IP" != "$TOR_IP" ] && [ "$TOR_IP" != "unknown" ]; then
        log "✅ IP anonymization detected"
    else
        warning "⚠️  Consider using VPN + Tor for maximum anonymity"
    fi
    
    # Check for sensitive files
    if [ -f ".git/config" ]; then
        if grep -q "github.com" .git/config; then
            warning "⚠️  Git remote detected - ensure you're using anonymous account"
        fi
    fi
    
    # Check for personal information
    if find . -name "*.html" -o -name "*.md" | xargs grep -i "personal.*info\|real.*name\|private.*email" >/dev/null 2>&1; then
        error "❌ Personal information detected in files!"
        error "Review and remove before distribution"
        return 1
    fi
    
    log "✅ Basic security check completed"
}

# Create distribution package
create_package() {
    log "📦 Creating distribution package..."
    
    PACKAGE_DIR="creepstate-dist"
    PACKAGE_FILE="creepstate-investigation.zip"
    
    # Create clean directory
    rm -rf "$PACKAGE_DIR" "$PACKAGE_FILE"
    mkdir -p "$PACKAGE_DIR"
    
    # Copy essential files
    cp -r \
        index.html \
        enhanced-visualizations.html \
        slideshow-timeline.html \
        stats.html \
        resources.html \
        names-and-shame.html \
        documentation.html \
        timeline-comprehensive.xml \
        events-simple.xml \
        images/ \
        README.md \
        SIMPLE-INSTALL.md \
        PRIVATE-HOSTING.md \
        ANONYMOUS-HOSTING.md \
        ANONYMOUS-DISTRIBUTION.md \
        run-local.sh \
        run-local.bat \
        run-dev.sh \
        Dockerfile \
        docker-compose.yml \
        "$PACKAGE_DIR/"
    
    # Create distribution README
    cat > "$PACKAGE_DIR/DISTRIBUTION-README.txt" << 'EOF'
🕵️ TRUMP-EPSTEIN TIMELINE INVESTIGATION

This is an anonymous investigation resource for justice and truth.

QUICK START:
1. Extract all files to a folder
2. Run: ./run-local.sh (Linux/Mac) or run-local.bat (Windows)
3. Open: http://localhost:8847

FEATURES:
- 78+ documented timeline events
- 152+ network associates directory
- Statistics on deaths, victims, convictions
- Victim support resources
- Network visualizations and analysis

SAFETY:
- Review PRIVATE-HOSTING.md for security
- Use ANONYMOUS-HOSTING.md for public deployment
- See ANONYMOUS-DISTRIBUTION.md for sharing

This investigation was compiled from public sources for educational
and journalistic purposes. All information is documented with sources.

For justice and truth.
EOF

    # Create anonymous deployment script
    cat > "$PACKAGE_DIR/quick-deploy.sh" << 'EOF'
#!/bin/bash
echo "🕵️ Creepstate Investigation Platform Investigation"
echo "Quick Anonymous Deployment"
echo ""
echo "1) Local server (safest): ./run-local.sh"
echo "2) Docker deployment: docker-compose up -d"
echo "3) Simple Python: python3 -m http.server 8847"
echo ""
echo "Access at: http://localhost:8847"
echo ""
echo "For security tips, read PRIVATE-HOSTING.md"
EOF
    chmod +x "$PACKAGE_DIR/quick-deploy.sh"
    
    # Create ZIP package
    cd "$PACKAGE_DIR"
    zip -r "../$PACKAGE_FILE" . -q
    cd ..
    
    # Calculate hashes
    SHA256=$(sha256sum "$PACKAGE_FILE" | awk '{print $1}')
    MD5=$(md5sum "$PACKAGE_FILE" | awk '{print $1}')
    
    # Create verification file
    cat > "${PACKAGE_FILE}.verify" << EOF
Creepstate Investigation Platform Investigation Package
File: $PACKAGE_FILE
Size: $(stat --format="%s" "$PACKAGE_FILE") bytes
Created: $(date -u)

Checksums:
SHA256: $SHA256
MD5: $MD5

Verification:
sha256sum $PACKAGE_FILE
md5sum $PACKAGE_FILE
EOF

    log "✅ Distribution package created: $PACKAGE_FILE"
    log "📊 Package size: $(du -h "$PACKAGE_FILE" | cut -f1)"
    log "🔑 SHA256: $SHA256"
    
    # Cleanup
    rm -rf "$PACKAGE_DIR"
}

# Generate QR codes
generate_qr_codes() {
    log "📱 Generating QR codes..."
    
    if ! command -v qrencode >/dev/null; then
        warning "qrencode not found. Install with: sudo apt install qrencode"
        return 1
    fi
    
    mkdir -p qr-codes
    
    # Example URLs (user will need to update these)
    SAMPLE_URLS=(
        "http://localhost:8847"
        "https://your-domain.com"
        "https://ipfs.io/ipfs/YOUR_HASH_HERE"
        "http://YOUR_ONION_ADDRESS.onion"
    )
    
    for i, url in enumerate("${SAMPLE_URLS[@]}"); do
        qrencode -o "qr-codes/qr-code-$((i+1)).png" -s 10 "$url"
        log "Generated QR code for: $url"
    done
    
    # Create QR code HTML page
    cat > qr-codes/qr-codes.html << 'EOF'
<!DOCTYPE html>
<html>
<head><title>Creepstate Investigation Platform - QR Codes</title></head>
<body style="font-family: Arial; text-align: center; background: #1a1a1a; color: white;">
<h1>🕵️ Creepstate Investigation Platform QR Codes</h1>
<p>Scan to access the investigation anonymously</p>
<div style="display: flex; flex-wrap: wrap; justify-content: center; gap: 20px;">
<div><h3>Local Server</h3><img src="qr-code-1.png" alt="Local"><br>localhost:8847</div>
<div><h3>Public Site</h3><img src="qr-code-2.png" alt="Public"><br>Update URL</div>
<div><h3>IPFS Mirror</h3><img src="qr-code-3.png" alt="IPFS"><br>Permanent Storage</div>
<div><h3>Tor Hidden</h3><img src="qr-code-4.png" alt="Tor"><br>Anonymous Access</div>
</div>
</body>
</html>
EOF

    log "✅ QR codes generated in qr-codes/ directory"
}

# Create social media graphics template
create_social_graphics() {
    log "📸 Creating social media templates..."
    
    mkdir -p social-graphics
    
    # Create HTML templates for screenshots
    cat > social-graphics/social-template.html << 'EOF'
<!DOCTYPE html>
<html>
<head>
    <title>Creepstate Investigation</title>
    <style>
        body { font-family: Arial; background: linear-gradient(135deg, #1a1a1a, #2d2d2d); color: white; margin: 0; padding: 40px; }
        .card { background: rgba(255,255,255,0.1); border-radius: 15px; padding: 30px; text-align: center; max-width: 800px; margin: 0 auto; }
        h1 { color: #ff6b6b; font-size: 2.5em; margin-bottom: 20px; }
        .stats { display: flex; justify-content: space-around; margin: 30px 0; }
        .stat { text-align: center; }
        .stat-number { font-size: 3em; font-weight: bold; color: #4ecdc4; display: block; }
        .stat-label { font-size: 1.2em; opacity: 0.8; }
        .cta { background: #ff6b6b; color: white; padding: 15px 30px; border-radius: 25px; text-decoration: none; font-weight: bold; display: inline-block; margin-top: 20px; }
    </style>
</head>
<body>
    <div class="card">
        <h1>🕵️ Creepstate Investigation</h1>
        <p style="font-size: 1.3em; margin-bottom: 30px;">Comprehensive Timeline & Network Analysis</p>
        <div class="stats">
            <div class="stat"><span class="stat-number">78+</span><div class="stat-label">Timeline Events</div></div>
            <div class="stat"><span class="stat-number">152+</span><div class="stat-label">Network Associates</div></div>
            <div class="stat"><span class="stat-number">7</span><div class="stat-label">Suspicious Deaths</div></div>
        </div>
        <p>Interactive timeline, network maps, statistics, victim resources</p>
        <a href="#" class="cta">Access Investigation</a>
        <p style="margin-top: 20px; font-size: 0.9em; opacity: 0.7;">For justice and truth</p>
    </div>
</body>
</html>
EOF

    log "✅ Social media templates created in social-graphics/"
    info "Use browser screenshot tools to create graphics from social-template.html"
}

# Show distribution guide
show_guide() {
    if [ -f "ANONYMOUS-DISTRIBUTION.md" ]; then
        log "📖 Opening distribution guide..."
        less ANONYMOUS-DISTRIBUTION.md
    else
        error "Distribution guide not found"
    fi
}

# Main menu loop
main() {
    while true; do
        show_menu
        read -p "Select option (0-7): " choice
        
        case $choice in
            1)
                security_check && create_package
                ;;
            2)
                log "📡 IPFS Distribution:"
                info "1. Install IPFS: https://ipfs.io/install/"
                info "2. Add your package: ipfs add -r creepstate-investigation.zip"
                info "3. Share the hash: ipfs://QmYourHashHere"
                info "4. Pin to multiple nodes for redundancy"
                ;;
            3)
                log "🌊 Torrent Creation:"
                info "1. Install mktorrent: sudo apt install mktorrent"
                info "2. Create torrent: mktorrent -a udp://tracker.openbittorrent.com:80 creepstate-investigation.zip"
                info "3. Upload .torrent file to anonymous sites"
                ;;
            4)
                generate_qr_codes
                ;;
            5)
                create_social_graphics
                ;;
            6)
                security_check
                ;;
            7)
                show_guide
                ;;
            0)
                log "Stay safe. For justice and truth. 🕵️"
                exit 0
                ;;
            *)
                error "Invalid option"
                ;;
        esac
        
        echo ""
        read -p "Press Enter to continue..."
    done
}

# Check if we're in the right directory
if [ ! -f "index.html" ]; then
    error "Run this script from the creepstate directory"
    exit 1
fi

# Run main menu
main