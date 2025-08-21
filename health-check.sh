#!/bin/bash

# Health Check Script for Trump-Epstein Timeline Investigation
# This script performs comprehensive health checks and can be run via cron

set -e

# Configuration
CONTAINER_NAME="trumpstein-timeline"
APP_PORT="8847"
LOG_FILE="/var/log/trumpstein-timeline-health.log"
ALERT_EMAIL="admin@investigation.org"
WEBHOOK_URL=""  # Add Slack/Discord webhook URL if needed

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Logging
log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')] $1${NC}" | tee -a "$LOG_FILE"
}

error() {
    echo -e "${RED}[ERROR $(date +'%Y-%m-%d %H:%M:%S')] $1${NC}" | tee -a "$LOG_FILE"
}

warning() {
    echo -e "${YELLOW}[WARNING $(date +'%Y-%m-%d %H:%M:%S')] $1${NC}" | tee -a "$LOG_FILE"
}

# Send alert
send_alert() {
    local severity="$1"
    local message="$2"
    
    # Email alert
    if command -v mail >/dev/null 2>&1; then
        echo "$message" | mail -s "[$severity] Trump-Epstein Timeline Alert" "$ALERT_EMAIL"
    fi
    
    # Webhook alert (Slack/Discord)
    if [ -n "$WEBHOOK_URL" ]; then
        curl -X POST "$WEBHOOK_URL" \
            -H "Content-Type: application/json" \
            -d "{\"text\": \"[$severity] Trump-Epstein Timeline: $message\"}" \
            >/dev/null 2>&1 || true
    fi
    
    log "Alert sent: [$severity] $message"
}

# Check Docker container
check_container() {
    log "Checking Docker container..."
    
    if ! docker ps -q -f name="$CONTAINER_NAME" | grep -q .; then
        error "Container $CONTAINER_NAME is not running"
        send_alert "CRITICAL" "Docker container is not running. Attempting restart..."
        
        # Attempt to restart
        if docker start "$CONTAINER_NAME" 2>/dev/null; then
            log "Container restarted successfully"
            sleep 10
        else
            error "Failed to restart container"
            return 1
        fi
    else
        log "Container is running"
    fi
    
    # Check container health
    CONTAINER_STATUS=$(docker inspect --format='{{.State.Health.Status}}' "$CONTAINER_NAME" 2>/dev/null || echo "unknown")
    if [ "$CONTAINER_STATUS" = "unhealthy" ]; then
        warning "Container reports unhealthy status"
        send_alert "WARNING" "Container health check is failing"
    fi
}

# Check application response
check_application() {
    log "Checking application response..."
    
    local max_attempts=3
    local attempt=1
    
    while [ $attempt -le $max_attempts ]; do
        if curl -f -s --max-time 10 "http://localhost:$APP_PORT" >/dev/null; then
            log "Application is responding (attempt $attempt)"
            return 0
        else
            warning "Application not responding (attempt $attempt)"
            if [ $attempt -lt $max_attempts ]; then
                sleep 5
            fi
        fi
        ((attempt++))
    done
    
    error "Application failed to respond after $max_attempts attempts"
    send_alert "CRITICAL" "Application is not responding on port $APP_PORT"
    return 1
}

# Check system resources
check_resources() {
    log "Checking system resources..."
    
    # Disk space
    DISK_USAGE=$(df / | awk 'NR==2{print $5}' | sed 's/%//')
    if [ "$DISK_USAGE" -gt 90 ]; then
        error "Critical disk usage: ${DISK_USAGE}%"
        send_alert "CRITICAL" "Disk usage is critically high: ${DISK_USAGE}%"
    elif [ "$DISK_USAGE" -gt 80 ]; then
        warning "High disk usage: ${DISK_USAGE}%"
        send_alert "WARNING" "Disk usage is high: ${DISK_USAGE}%"
    else
        log "Disk usage is normal: ${DISK_USAGE}%"
    fi
    
    # Memory usage
    MEM_USAGE=$(free | awk 'NR==2{printf "%.0f", $3*100/$2}')
    if [ "$MEM_USAGE" -gt 90 ]; then
        warning "High memory usage: ${MEM_USAGE}%"
        send_alert "WARNING" "Memory usage is high: ${MEM_USAGE}%"
    else
        log "Memory usage is normal: ${MEM_USAGE}%"
    fi
    
    # Load average
    LOAD_AVG=$(uptime | awk -F'load average:' '{print $2}' | awk '{print $1}' | sed 's/,//')
    CPU_COUNT=$(nproc)
    if (( $(echo "$LOAD_AVG > $CPU_COUNT * 2" | bc -l) )); then
        warning "High load average: $LOAD_AVG (CPUs: $CPU_COUNT)"
        send_alert "WARNING" "System load is high: $LOAD_AVG"
    else
        log "Load average is normal: $LOAD_AVG"
    fi
}

# Check log files
check_logs() {
    log "Checking log files..."
    
    # Check for errors in container logs
    ERROR_COUNT=$(docker logs "$CONTAINER_NAME" --since="1h" 2>&1 | grep -i "error\|exception\|fatal" | wc -l || echo "0")
    if [ "$ERROR_COUNT" -gt 0 ]; then
        warning "Found $ERROR_COUNT errors in container logs (last hour)"
        if [ "$ERROR_COUNT" -gt 10 ]; then
            send_alert "WARNING" "High error count in logs: $ERROR_COUNT errors in last hour"
        fi
    else
        log "No errors found in recent logs"
    fi
    
    # Check log file sizes
    if [ -f "$LOG_FILE" ]; then
        LOG_SIZE=$(stat --format="%s" "$LOG_FILE" 2>/dev/null || echo "0")
        if [ "$LOG_SIZE" -gt 104857600 ]; then  # 100MB
            warning "Log file is large: $(($LOG_SIZE / 1024 / 1024))MB"
        fi
    fi
}

# Check SSL certificate expiry
check_ssl() {
    local domain="$1"
    
    if [ -z "$domain" ]; then
        log "No domain specified, skipping SSL check"
        return 0
    fi
    
    log "Checking SSL certificate for $domain..."
    
    # Check certificate expiry
    CERT_EXPIRY=$(echo | openssl s_client -servername "$domain" -connect "$domain:443" 2>/dev/null | \
                  openssl x509 -noout -enddate 2>/dev/null | cut -d= -f2)
    
    if [ -n "$CERT_EXPIRY" ]; then
        EXPIRY_EPOCH=$(date -d "$CERT_EXPIRY" +%s 2>/dev/null || echo "0")
        CURRENT_EPOCH=$(date +%s)
        DAYS_LEFT=$(( (EXPIRY_EPOCH - CURRENT_EPOCH) / 86400 ))
        
        if [ "$DAYS_LEFT" -lt 7 ]; then
            error "SSL certificate expires in $DAYS_LEFT days"
            send_alert "CRITICAL" "SSL certificate for $domain expires in $DAYS_LEFT days"
        elif [ "$DAYS_LEFT" -lt 30 ]; then
            warning "SSL certificate expires in $DAYS_LEFT days"
            send_alert "WARNING" "SSL certificate for $domain expires in $DAYS_LEFT days"
        else
            log "SSL certificate is valid for $DAYS_LEFT more days"
        fi
    else
        warning "Could not check SSL certificate for $domain"
    fi
}

# Check external dependencies
check_external() {
    log "Checking external dependencies..."
    
    # Check internet connectivity
    if ! ping -c 1 8.8.8.8 >/dev/null 2>&1; then
        error "No internet connectivity"
        send_alert "CRITICAL" "Server has lost internet connectivity"
    else
        log "Internet connectivity is working"
    fi
    
    # Check Docker Hub connectivity
    if ! curl -f -s --max-time 10 "https://hub.docker.com" >/dev/null; then
        warning "Cannot reach Docker Hub"
    else
        log "Docker Hub is reachable"
    fi
}

# Check security
check_security() {
    log "Checking security..."
    
    # Check for failed SSH attempts
    FAILED_SSH=$(grep "Failed password" /var/log/auth.log 2>/dev/null | grep "$(date '+%b %d')" | wc -l || echo "0")
    if [ "$FAILED_SSH" -gt 20 ]; then
        warning "High number of failed SSH attempts today: $FAILED_SSH"
        send_alert "WARNING" "High number of failed SSH attempts: $FAILED_SSH today"
    fi
    
    # Check fail2ban status
    if command -v fail2ban-client >/dev/null 2>&1; then
        BANNED_IPS=$(fail2ban-client status sshd 2>/dev/null | grep "Currently banned" | awk '{print $4}' || echo "0")
        if [ "$BANNED_IPS" -gt 0 ]; then
            log "Fail2ban has banned $BANNED_IPS IPs"
        fi
    fi
    
    # Check for suspicious processes
    SUSPICIOUS_PROCS=$(ps aux | grep -E "(nc|netcat|tcpdump|nmap)" | grep -v grep | wc -l || echo "0")
    if [ "$SUSPICIOUS_PROCS" -gt 0 ]; then
        warning "Found $SUSPICIOUS_PROCS potentially suspicious processes"
    fi
}

# Performance check
check_performance() {
    log "Checking performance metrics..."
    
    # Response time check
    RESPONSE_TIME=$(curl -w "%{time_total}" -s -o /dev/null "http://localhost:$APP_PORT" || echo "0")
    RESPONSE_MS=$(echo "$RESPONSE_TIME * 1000" | bc -l | cut -d. -f1)
    
    if [ "$RESPONSE_MS" -gt 5000 ]; then
        warning "Slow response time: ${RESPONSE_MS}ms"
        send_alert "WARNING" "Application response time is slow: ${RESPONSE_MS}ms"
    elif [ "$RESPONSE_MS" -gt 0 ]; then
        log "Response time is good: ${RESPONSE_MS}ms"
    fi
    
    # Check Docker stats
    DOCKER_CPU=$(docker stats "$CONTAINER_NAME" --no-stream --format "{{.CPUPerc}}" 2>/dev/null | sed 's/%//' || echo "0")
    DOCKER_MEM=$(docker stats "$CONTAINER_NAME" --no-stream --format "{{.MemPerc}}" 2>/dev/null | sed 's/%//' || echo "0")
    
    if (( $(echo "$DOCKER_CPU > 80" | bc -l 2>/dev/null || echo "0") )); then
        warning "High container CPU usage: ${DOCKER_CPU}%"
    fi
    
    if (( $(echo "$DOCKER_MEM > 80" | bc -l 2>/dev/null || echo "0") )); then
        warning "High container memory usage: ${DOCKER_MEM}%"
    fi
}

# Generate health report
generate_report() {
    local report_file="/tmp/health-report-$(date +%Y%m%d-%H%M%S).txt"
    
    {
        echo "=== Trump-Epstein Timeline Investigation Health Report ==="
        echo "Generated: $(date)"
        echo ""
        echo "=== System Status ==="
        echo "Uptime: $(uptime)"
        echo "Disk Usage: $(df -h / | awk 'NR==2{print $5}')"
        echo "Memory Usage: $(free -h | awk 'NR==2{printf "%.1f%% (%s/%s)", $3*100/$2, $3, $2}')"
        echo "Load Average: $(uptime | awk -F'load average:' '{print $2}')"
        echo ""
        echo "=== Docker Status ==="
        docker ps -f name="$CONTAINER_NAME" --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
        echo ""
        echo "=== Recent Logs ==="
        tail -20 "$LOG_FILE" 2>/dev/null || echo "No logs available"
    } > "$report_file"
    
    log "Health report generated: $report_file"
    
    # Optionally email the report
    if [ "$1" = "email" ] && command -v mail >/dev/null 2>&1; then
        mail -s "Trump-Epstein Timeline Health Report" "$ALERT_EMAIL" < "$report_file"
        log "Health report emailed to $ALERT_EMAIL"
    fi
}

# Main health check function
main() {
    log "Starting health check..."
    
    local exit_code=0
    
    # Run all checks
    check_container || exit_code=1
    check_application || exit_code=1
    check_resources || exit_code=1
    check_logs || exit_code=1
    check_external || exit_code=1
    check_security || exit_code=1
    check_performance || exit_code=1
    
    # Optional SSL check (uncomment and add domain)
    # check_ssl "your-domain.com" || exit_code=1
    
    if [ $exit_code -eq 0 ]; then
        log "All health checks passed ✅"
    else
        error "Some health checks failed ❌"
        send_alert "ERROR" "Health check completed with failures"
    fi
    
    log "Health check completed"
    return $exit_code
}

# Script entry point
case "${1:-check}" in
    check)
        main
        ;;
    report)
        generate_report "$2"
        ;;
    container)
        check_container
        ;;
    app)
        check_application
        ;;
    resources)
        check_resources
        ;;
    ssl)
        check_ssl "$2"
        ;;
    security)
        check_security
        ;;
    performance)
        check_performance
        ;;
    help|--help|-h)
        echo "Health Check Script for Trump-Epstein Timeline Investigation"
        echo ""
        echo "Usage: $0 [action]"
        echo ""
        echo "Actions:"
        echo "  check       - Run all health checks (default)"
        echo "  report      - Generate health report"
        echo "  container   - Check Docker container only"
        echo "  app         - Check application response only"
        echo "  resources   - Check system resources only"
        echo "  ssl DOMAIN  - Check SSL certificate for domain"
        echo "  security    - Check security status only"
        echo "  performance - Check performance metrics only"
        echo ""
        ;;
    *)
        echo "Unknown action: $1"
        echo "Use '$0 help' for usage information"
        exit 1
        ;;
esac