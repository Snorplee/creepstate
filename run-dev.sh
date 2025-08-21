#!/bin/bash

# Creepstate Investigation Platform - Development Server
# Run this script for development work on port 8845

set -e

# Configuration for development
PORT=8845
HOST="127.0.0.1"
LOG_FILE="/tmp/creepstate-dev.log"

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

log() {
    echo -e "${GREEN}[DEV $(date +'%H:%M:%S')] $1${NC}" | tee -a "$LOG_FILE"
}

info() {
    echo -e "${BLUE}[DEV INFO] $1${NC}" | tee -a "$LOG_FILE"
}

# Show development server info
echo ""
echo "╔══════════════════════════════════════════════════════════════╗"
echo "║         🔧 Creepstate Investigation Platform - DEVELOPMENT MODE         ║"
echo "╠══════════════════════════════════════════════════════════════╣"
echo "║  🌐 Dev Server URL: http://$HOST:$PORT                      ║"
echo "║  📁 Serving from: $(pwd)                    ║"
echo "║  🔒 Security: Localhost only (127.0.0.1)                    ║"
echo "║  📊 Dev logs: $LOG_FILE           ║"
echo "╠══════════════════════════════════════════════════════════════╣"
echo "║  🚀 Production Server: ./run-local.sh (port 8847)           ║"
echo "║  🔧 Development Server: ./run-dev.sh (port 8845)            ║"
echo "╚══════════════════════════════════════════════════════════════╝"
echo ""

# Check if we're in the right directory
if [ ! -f "index.html" ]; then
    echo "❌ ERROR: index.html not found in current directory"
    echo "Please run this script from the creepstate directory"
    exit 1
fi

# Check if port is available
if lsof -Pi :$PORT -sTCP:LISTEN -t >/dev/null 2>&1; then
    echo "❌ ERROR: Development port $PORT is already in use"
    echo "Checking what's using port $PORT:"
    lsof -Pi :$PORT -sTCP:LISTEN
    exit 1
fi

log "🔧 Starting DEVELOPMENT server on port $PORT..."
info "Press Ctrl+C to stop the development server"
echo ""

# Start Python development server with hot reload capabilities
if command -v python3 >/dev/null 2>&1; then
    log "Using Python 3 HTTP server for development"
    python3 -m http.server $PORT --bind $HOST 2>&1 | while read line; do
        echo "[DEV $(date +'%H:%M:%S')] $line" | tee -a "$LOG_FILE"
    done
else
    echo "❌ ERROR: Python 3 not found!"
    echo "Please install Python 3 for development server"
    exit 1
fi