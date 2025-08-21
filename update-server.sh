#!/bin/bash

# Trump-Epstein Timeline Investigation - Server Automation Script
# This script automates updates, deployment, and monitoring of the investigation suite
# Usage: ./update-server.sh [action]
# Actions: update, deploy, backup, monitor, full

set -e

# Configuration
PROJECT_DIR="/opt/trumpstein-timeline"
BACKUP_DIR="/opt/backups/trumpstein-timeline"
CONTAINER_NAME="trumpstein-timeline"
PORT="8847"
LOG_FILE="/var/log/trumpstein-timeline.log"
GITHUB_REPO="https://github.com/snorplee/trumpstein-timeline.git"
NOTIFICATION_EMAIL="admin@investigation.org"  # Update with actual email

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Logging function
log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')] $1${NC}" | tee -a "$LOG_FILE"
}

error() {
    echo -e "${RED}[ERROR $(date +'%Y-%m-%d %H:%M:%S')] $1${NC}" | tee -a "$LOG_FILE"
}

warning() {
    echo -e "${YELLOW}[WARNING $(date +'%Y-%m-%d %H:%M:%S')] $1${NC}" | tee -a "$LOG_FILE"
}

# Check if running as root or with sudo
check_permissions() {
    if [[ $EUID -eq 0 ]]; then
        log "Running with root privileges"
    else
        error "This script requires root privileges. Please run with sudo."
        exit 1
    fi
}

# Create necessary directories
setup_directories() {
    log "Setting up directories..."
    mkdir -p "$PROJECT_DIR"
    mkdir -p "$BACKUP_DIR"
    mkdir -p "$(dirname "$LOG_FILE")"
    
    # Set proper permissions
    chmod 755 "$PROJECT_DIR"
    chmod 755 "$BACKUP_DIR"
    chown -R www-data:www-data "$PROJECT_DIR"
}

# Install dependencies
install_dependencies() {
    log "Installing system dependencies..."
    
    # Update package list
    apt-get update -qq
    
    # Install required packages
    apt-get install -y \
        docker.io \
        docker-compose \
        git \
        curl \
        wget \
        jq \
        nginx \
        certbot \
        python3-certbot-nginx \
        fail2ban \
        ufw \
        logrotate \
        rsync \
        cron
    
    # Start and enable Docker
    systemctl start docker
    systemctl enable docker
    
    # Start and enable Nginx
    systemctl start nginx
    systemctl enable nginx
    
    log "Dependencies installed successfully"
}

# Setup firewall
setup_firewall() {
    log "Configuring firewall..."
    
    # Reset UFW to default
    ufw --force reset
    
    # Default policies
    ufw default deny incoming
    ufw default allow outgoing
    
    # Allow SSH (be careful!)
    ufw allow ssh
    
    # Allow HTTP and HTTPS
    ufw allow 80
    ufw allow 443
    
    # Allow our application port
    ufw allow "$PORT"
    
    # Enable firewall
    ufw --force enable
    
    log "Firewall configured successfully"
}

# Setup fail2ban
setup_fail2ban() {
    log "Configuring fail2ban..."
    
    cat > /etc/fail2ban/jail.local << EOF
[DEFAULT]
bantime = 3600
findtime = 600
maxretry = 3

[sshd]
enabled = true

[nginx-http-auth]
enabled = true

[nginx-limit-req]
enabled = true
filter = nginx-limit-req
action = iptables-multiport[name=ReqLimit, port="http,https", protocol=tcp]
logpath = /var/log/nginx/error.log
maxretry = 10
findtime = 600
bantime = 7200
EOF

    systemctl restart fail2ban
    systemctl enable fail2ban
    
    log "Fail2ban configured successfully"
}

# Pull latest code from repository
update_code() {
    log "Updating code from repository..."
    
    cd "$PROJECT_DIR"
    
    if [ -d ".git" ]; then
        log "Pulling latest changes..."
        git fetch origin
        git reset --hard origin/main
    else
        log "Cloning repository..."
        git clone "$GITHUB_REPO" .
    fi
    
    # Ensure proper permissions
    chown -R www-data:www-data "$PROJECT_DIR"
    
    log "Code updated successfully"
}

# Update timeline data from external sources
update_timeline_data() {
    log "Updating timeline data from external sources..."
    
    cd "$PROJECT_DIR"
    
    # Create data update script
    cat > update_data.py << 'EOF'
#!/usr/bin/env python3
import json
import xml.etree.ElementTree as ET
import requests
from datetime import datetime
import sys

def fetch_court_records():
    """Fetch latest court records and documents"""
    # This would connect to PACER, Court Listener, or other legal databases
    print("Fetching latest court records...")
    return []

def fetch_news_updates():
    """Fetch latest news and investigative reports"""
    # This would connect to news APIs for relevant updates
    print("Fetching latest news updates...")
    return []

def update_xml_timeline(new_events):
    """Update the XML timeline with new events"""
    try:
        tree = ET.parse('timeline-comprehensive.xml')
        root = tree.getroot()
        
        # Add new events
        for event in new_events:
            event_elem = ET.SubElement(root, 'event')
            event_elem.set('start', event.get('date', ''))
            event_elem.set('title', event.get('title', ''))
            event_elem.set('icon', event.get('icon', ''))
            event_elem.text = event.get('description', '')
        
        # Save updated timeline
        tree.write('timeline-comprehensive.xml', encoding='utf-8', xml_declaration=True)
        print(f"Added {len(new_events)} new events to timeline")
        
    except Exception as e:
        print(f"Error updating timeline: {e}")

def main():
    print("Starting data update process...")
    
    # Fetch updates
    court_updates = fetch_court_records()
    news_updates = fetch_news_updates()
    
    # Combine and process
    all_updates = court_updates + news_updates
    
    if all_updates:
        update_xml_timeline(all_updates)
        print(f"Timeline updated with {len(all_updates)} new events")
    else:
        print("No new events to add")

if __name__ == "__main__":
    main()
EOF

    # Make script executable
    chmod +x update_data.py
    
    # Run data update
    python3 update_data.py
    
    log "Timeline data update completed"
}

# Create backup
create_backup() {
    log "Creating backup..."
    
    BACKUP_FILE="$BACKUP_DIR/backup-$(date +%Y%m%d-%H%M%S).tar.gz"
    
    # Create compressed backup
    tar -czf "$BACKUP_FILE" -C "$(dirname "$PROJECT_DIR")" "$(basename "$PROJECT_DIR")"
    
    # Keep only last 10 backups
    find "$BACKUP_DIR" -name "backup-*.tar.gz" -type f -mtime +10 -delete
    
    log "Backup created: $BACKUP_FILE"
}

# Build and deploy Docker container
deploy_container() {
    log "Deploying Docker container..."
    
    cd "$PROJECT_DIR"
    
    # Stop existing container
    if docker ps -q -f name="$CONTAINER_NAME" | grep -q .; then
        log "Stopping existing container..."
        docker stop "$CONTAINER_NAME"
        docker rm "$CONTAINER_NAME"
    fi
    
    # Remove old images
    docker image prune -f
    
    # Build new image
    log "Building new Docker image..."
    docker build -t trumpstein-timeline .
    
    # Run new container
    log "Starting new container..."
    docker run -d \
        --name "$CONTAINER_NAME" \
        --restart unless-stopped \
        -p "$PORT:80" \
        trumpstein-timeline
    
    # Wait for container to be ready
    sleep 10
    
    # Health check
    if curl -f "http://localhost:$PORT" > /dev/null 2>&1; then
        log "Container deployed successfully and is healthy"
    else
        error "Container health check failed"
        return 1
    fi
}

# Setup SSL certificate with Let's Encrypt
setup_ssl() {
    local domain="$1"
    
    if [ -z "$domain" ]; then
        warning "No domain provided, skipping SSL setup"
        return 0
    fi
    
    log "Setting up SSL certificate for $domain..."
    
    # Create nginx config
    cat > "/etc/nginx/sites-available/trumpstein-timeline" << EOF
server {
    listen 80;
    server_name $domain;
    
    location / {
        proxy_pass http://localhost:$PORT;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }
}
EOF

    # Enable site
    ln -sf "/etc/nginx/sites-available/trumpstein-timeline" "/etc/nginx/sites-enabled/"
    
    # Test nginx config
    nginx -t
    
    # Reload nginx
    systemctl reload nginx
    
    # Get SSL certificate
    certbot --nginx -d "$domain" --non-interactive --agree-tos --email "$NOTIFICATION_EMAIL"
    
    log "SSL certificate setup completed"
}

# Monitor system health
monitor_system() {
    log "Performing system health check..."
    
    # Check disk space
    DISK_USAGE=$(df / | awk 'NR==2{print $5}' | sed 's/%//')
    if [ "$DISK_USAGE" -gt 85 ]; then
        warning "Disk usage is high: ${DISK_USAGE}%"
    fi
    
    # Check memory usage
    MEM_USAGE=$(free | awk 'NR==2{printf "%.0f", $3*100/$2}')
    if [ "$MEM_USAGE" -gt 85 ]; then
        warning "Memory usage is high: ${MEM_USAGE}%"
    fi
    
    # Check Docker container
    if ! docker ps -q -f name="$CONTAINER_NAME" | grep -q .; then
        error "Docker container is not running"
        return 1
    fi
    
    # Check application health
    if ! curl -f "http://localhost:$PORT" > /dev/null 2>&1; then
        error "Application health check failed"
        return 1
    fi
    
    # Check log file size
    if [ -f "$LOG_FILE" ]; then
        LOG_SIZE=$(stat --format="%s" "$LOG_FILE")
        if [ "$LOG_SIZE" -gt 104857600 ]; then  # 100MB
            warning "Log file is large: $(($LOG_SIZE / 1024 / 1024))MB"
        fi
    fi
    
    log "System health check completed successfully"
}

# Setup log rotation
setup_logrotate() {
    log "Setting up log rotation..."
    
    cat > "/etc/logrotate.d/trumpstein-timeline" << EOF
$LOG_FILE {
    daily
    missingok
    rotate 30
    compress
    delaycompress
    notifempty
    copytruncate
}
EOF

    log "Log rotation configured"
}

# Setup cron jobs
setup_cron() {
    log "Setting up cron jobs..."
    
    # Create cron script
    cat > "/usr/local/bin/trumpstein-update" << EOF
#!/bin/bash
$0 update
EOF
    
    chmod +x "/usr/local/bin/trumpstein-update"
    
    # Add cron jobs
    (crontab -l 2>/dev/null; echo "0 2 * * * /usr/local/bin/trumpstein-update") | crontab -
    (crontab -l 2>/dev/null; echo "0 6,12,18 * * * $0 monitor") | crontab -
    
    log "Cron jobs configured"
}

# Send notification
send_notification() {
    local subject="$1"
    local message="$2"
    
    if command -v mail >/dev/null 2>&1; then
        echo "$message" | mail -s "$subject" "$NOTIFICATION_EMAIL"
    fi
    
    log "Notification sent: $subject"
}

# Main update function
update_all() {
    log "Starting full update process..."
    
    create_backup
    update_code
    update_timeline_data
    deploy_container
    monitor_system
    
    send_notification "Trump-Epstein Timeline Updated" "The investigation timeline has been successfully updated and deployed."
    
    log "Full update process completed successfully"
}

# Main installation function
full_install() {
    log "Starting full installation..."
    
    check_permissions
    setup_directories
    install_dependencies
    setup_firewall
    setup_fail2ban
    update_code
    deploy_container
    setup_logrotate
    setup_cron
    
    # Optional SSL setup (uncomment and provide domain)
    # setup_ssl "your-domain.com"
    
    send_notification "Trump-Epstein Timeline Installed" "The investigation timeline has been successfully installed and deployed."
    
    log "Full installation completed successfully"
}

# Show usage information
show_usage() {
    echo "Trump-Epstein Investigation - Server Automation Script"
    echo ""
    echo "Usage: $0 [action]"
    echo ""
    echo "Actions:"
    echo "  install     - Full installation and setup"
    echo "  update      - Update code and data, redeploy"
    echo "  deploy      - Build and deploy container only"
    echo "  backup      - Create backup only"
    echo "  monitor     - Health check only"
    echo "  ssl DOMAIN  - Setup SSL certificate for domain"
    echo "  logs        - Show recent logs"
    echo "  status      - Show system status"
    echo ""
    echo "Examples:"
    echo "  $0 install"
    echo "  $0 update"
    echo "  $0 ssl investigation.example.com"
    echo ""
}

# Show logs
show_logs() {
    if [ -f "$LOG_FILE" ]; then
        tail -50 "$LOG_FILE"
    else
        echo "No log file found at $LOG_FILE"
    fi
}

# Show status
show_status() {
    echo "=== Trump-Epstein Timeline Investigation Status ==="
    echo ""
    echo "Container Status:"
    docker ps -f name="$CONTAINER_NAME" --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
    echo ""
    echo "Application Health:"
    if curl -f "http://localhost:$PORT" > /dev/null 2>&1; then
        echo "✅ Application is responding"
    else
        echo "❌ Application is not responding"
    fi
    echo ""
    echo "System Resources:"
    echo "Disk Usage: $(df / | awk 'NR==2{print $5}')"
    echo "Memory Usage: $(free | awk 'NR==2{printf "%.1f%%", $3*100/$2}')"
    echo "Load Average: $(uptime | awk -F'load average:' '{print $2}')"
    echo ""
    echo "Recent Activity:"
    if [ -f "$LOG_FILE" ]; then
        tail -5 "$LOG_FILE"
    else
        echo "No recent activity logged"
    fi
}

# Main script logic
case "${1:-help}" in
    install)
        full_install
        ;;
    update)
        update_all
        ;;
    deploy)
        deploy_container
        ;;
    backup)
        create_backup
        ;;
    monitor)
        monitor_system
        ;;
    ssl)
        setup_ssl "$2"
        ;;
    logs)
        show_logs
        ;;
    status)
        show_status
        ;;
    help|--help|-h)
        show_usage
        ;;
    *)
        echo "Unknown action: $1"
        echo ""
        show_usage
        exit 1
        ;;
esac