#!/bin/bash

# Trump-Epstein Timeline - Local Development Server
# Run this script to start a secure local server for private investigation

set -e

# Configuration
PORT=${1:-8847}
HOST="127.0.0.1"  # Localhost only for security
LOG_FILE="/tmp/trumpstein-timeline-local.log"

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Logging function
log() {
    echo -e "${GREEN}[$(date +'%H:%M:%S')] $1${NC}" | tee -a "$LOG_FILE"
}

warning() {
    echo -e "${YELLOW}[WARNING] $1${NC}" | tee -a "$LOG_FILE"
}

error() {
    echo -e "${RED}[ERROR] $1${NC}" | tee -a "$LOG_FILE"
}

info() {
    echo -e "${BLUE}[INFO] $1${NC}" | tee -a "$LOG_FILE"
}

# Check if port is available
check_port() {
    if lsof -Pi :$PORT -sTCP:LISTEN -t >/dev/null 2>&1; then
        error "Port $PORT is already in use"
        info "Checking what's using port $PORT:"
        lsof -Pi :$PORT -sTCP:LISTEN
        echo ""
        warning "Try a different port: ./run-local.sh 8080"
        exit 1
    fi
}

# Security check
security_check() {
    log "🔒 Performing security checks..."
    
    # Check if running as root (not recommended)
    if [ "$EUID" -eq 0 ]; then
        warning "Running as root is not recommended for security"
        warning "Consider running as a regular user"
    fi
    
    # Check firewall status
    if command -v ufw >/dev/null 2>&1; then
        if ufw status | grep -q "Status: active"; then
            info "✅ UFW firewall is active"
        else
            warning "⚠️  UFW firewall is not active"
        fi
    fi
    
    # Check for VPN connection
    if ip route | grep -q "tun\|tap"; then
        info "✅ VPN connection detected"
    else
        warning "⚠️  No VPN detected - consider using VPN for additional privacy"
    fi
}

# Show server info
show_server_info() {
    echo ""
    echo "╔══════════════════════════════════════════════════════════════╗"
    echo "║             🕵️  Trump-Epstein Timeline Investigation          ║"
    echo "║                      Local Development Server                 ║"
    echo "╠══════════════════════════════════════════════════════════════╣"
    echo "║  🌐 Server URL: http://$HOST:$PORT                           ║"
    echo "║  📁 Serving from: $(pwd)                    ║"
    echo "║  🔒 Security: Localhost only (127.0.0.1)                    ║"
    echo "║  📊 Access logs: $LOG_FILE           ║"
    echo "╠══════════════════════════════════════════════════════════════╣"
    echo "║  📖 Pages Available:                                         ║"
    echo "║    • Timeline:        http://$HOST:$PORT/                   ║"
    echo "║    • Visualizations:  http://$HOST:$PORT/enhanced-visualizations.html ║"
    echo "║    • Statistics:      http://$HOST:$PORT/stats.html         ║"
    echo "║    • Names & Shame:   http://$HOST:$PORT/names-and-shame.html ║"
    echo "║    • Resources:       http://$HOST:$PORT/resources.html     ║"
    echo "║    • Slideshow:       http://$HOST:$PORT/slideshow-timeline.html ║"
    echo "╚══════════════════════════════════════════════════════════════╝"
    echo ""
    info "🚀 Server starting on port $PORT..."
    info "Press Ctrl+C to stop the server"
    echo ""
}

# Cleanup function
cleanup() {
    echo ""
    log "🛑 Shutting down server..."
    
    # Kill any background processes
    jobs -p | xargs -r kill
    
    # Clear sensitive logs if requested
    if [ "$CLEAR_LOGS" = "true" ]; then
        warning "Clearing access logs for security..."
        > "$LOG_FILE"
    fi
    
    log "✅ Server stopped safely"
    exit 0
}

# Set up signal handlers
trap cleanup SIGINT SIGTERM

# Main function
main() {
    # Check if we're in the right directory
    if [ ! -f "index.html" ]; then
        error "index.html not found in current directory"
        error "Please run this script from the trumpstein-timeline directory"
        info "Usage: cd /path/to/trumpstein-timeline && ./run-local.sh [port]"
        exit 1
    fi
    
    # Perform security checks
    security_check
    
    # Check port availability
    check_port
    
    # Show server information
    show_server_info
    
    # Log startup
    log "Starting Trump-Epstein Timeline Investigation server"
    log "Host: $HOST, Port: $PORT, Directory: $(pwd)"
    
    # Try different server methods in order of preference
    if command -v python3 >/dev/null 2>&1; then
        log "Using Python 3 HTTP server"
        python3 -m http.server $PORT --bind $HOST 2>&1 | while read line; do
            echo "[$(date +'%H:%M:%S')] $line" | tee -a "$LOG_FILE"
        done
    elif command -v python >/dev/null 2>&1; then
        log "Using Python 2 HTTP server"
        python -m SimpleHTTPServer $PORT 2>&1 | while read line; do
            echo "[$(date +'%H:%M:%S')] $line" | tee -a "$LOG_FILE"
        done
    elif command -v php >/dev/null 2>&1; then
        log "Using PHP built-in server"
        php -S $HOST:$PORT 2>&1 | while read line; do
            echo "[$(date +'%H:%M:%S')] $line" | tee -a "$LOG_FILE"
        done
    elif command -v node >/dev/null 2>&1; then
        log "Using Node.js HTTP server"
        node -e "
        const http = require('http');
        const fs = require('fs');
        const path = require('path');
        const url = require('url');
        
        const server = http.createServer((req, res) => {
            let filePath = '.' + url.parse(req.url).pathname;
            if (filePath === './') filePath = './index.html';
            
            const extname = String(path.extname(filePath)).toLowerCase();
            const mimeTypes = {
                '.html': 'text/html',
                '.js': 'text/javascript',
                '.css': 'text/css',
                '.xml': 'application/xml',
                '.jpg': 'image/jpeg',
                '.png': 'image/png',
                '.gif': 'image/gif'
            };
            
            const contentType = mimeTypes[extname] || 'application/octet-stream';
            
            fs.readFile(filePath, (error, content) => {
                if (error) {
                    if(error.code == 'ENOENT') {
                        res.writeHead(404);
                        res.end('File not found');
                    } else {
                        res.writeHead(500);
                        res.end('Server error: '+error.code);
                    }
                } else {
                    res.writeHead(200, { 'Content-Type': contentType });
                    res.end(content, 'utf-8');
                }
            });
        });
        
        server.listen($PORT, '$HOST', () => {
            console.log('Server running at http://$HOST:$PORT/');
        });
        " 2>&1 | while read line; do
            echo "[$(date +'%H:%M:%S')] $line" | tee -a "$LOG_FILE"
        done
    else
        error "No suitable server found!"
        error "Please install one of the following:"
        error "  - Python 3: sudo apt install python3"
        error "  - Python 2: sudo apt install python"
        error "  - PHP: sudo apt install php"
        error "  - Node.js: sudo apt install nodejs"
        exit 1
    fi
}

# Help function
show_help() {
    echo "Trump-Epstein Timeline Investigation - Local Server"
    echo ""
    echo "Usage: $0 [PORT]"
    echo ""
    echo "Options:"
    echo "  PORT          Port number to use (default: 8847)"
    echo ""
    echo "Environment Variables:"
    echo "  CLEAR_LOGS    Set to 'true' to clear logs on exit"
    echo ""
    echo "Examples:"
    echo "  $0            # Start on port 8847"
    echo "  $0 8080       # Start on port 8080"
    echo "  CLEAR_LOGS=true $0  # Clear logs on exit"
    echo ""
    echo "Security Notes:"
    echo "  - Server binds to localhost (127.0.0.1) only"
    echo "  - Only accessible from your local machine"
    echo "  - Consider using VPN for additional privacy"
    echo "  - Check firewall settings if needed"
    echo ""
}

# Check command line arguments
case "${1:-}" in
    -h|--help|help)
        show_help
        exit 0
        ;;
    *)
        if [[ "$1" =~ ^[0-9]+$ ]] && [ "$1" -ge 1024 ] && [ "$1" -le 65535 ]; then
            PORT="$1"
        elif [ -n "$1" ]; then
            error "Invalid port number: $1"
            error "Port must be between 1024 and 65535"
            exit 1
        fi
        ;;
esac

# Run main function
main