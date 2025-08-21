#!/bin/bash

# Generate comprehensive verification report for timeline data

LOG_FILE="/var/log/timeline-updates.log"
REPORT_DIR="/tmp/verification-reports"
TIMESTAMP=$(date +"%Y%m%d-%H%M%S")

log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a "$LOG_FILE"
}

# Create report directory
mkdir -p "$REPORT_DIR"

log "Generating verification report..."

# Run fact-checker
python3 /mnt/c/Users/Snorplee/Documents/Dropbox/apps/trumpstein-timeline/scripts/fact-checker.py

# Copy latest verification data
if [ -f "/tmp/fact-check-report.json" ]; then
    cp "/tmp/fact-check-report.json" "$REPORT_DIR/report-$TIMESTAMP.json"
    
    # Extract key metrics
    RELIABILITY=$(python3 -c "
import json
with open('/tmp/fact-check-report.json') as f:
    data = json.load(f)
    print(f\"{data['reliability_score']:.2%}\")
")
    
    VERIFIED_CLAIMS=$(python3 -c "
import json
with open('/tmp/fact-check-report.json') as f:
    data = json.load(f)
    print(data['verified_claims'])
")
    
    TOTAL_CLAIMS=$(python3 -c "
import json
with open('/tmp/fact-check-report.json') as f:
    data = json.load(f)
    print(data['total_claims'])
")
    
    log "Verification Report Generated:"
    log "  Reliability Score: $RELIABILITY"
    log "  Verified Claims: $VERIFIED_CLAIMS/$TOTAL_CLAIMS"
    log "  Report saved: $REPORT_DIR/report-$TIMESTAMP.json"
    
    # Create HTML report for web interface
    cat > "$REPORT_DIR/latest-report.html" << EOF
<!DOCTYPE html>
<html>
<head>
    <title>Timeline Verification Report</title>
    <meta charset="UTF-8">
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .metric { background: #f0f0f0; padding: 10px; margin: 10px 0; border-radius: 5px; }
        .verified { background: #d4edda; border-left: 4px solid #28a745; }
        .unverified { background: #f8d7da; border-left: 4px solid #dc3545; }
        .timestamp { color: #6c757d; font-size: 0.9em; }
    </style>
</head>
<body>
    <h1>🔍 Timeline Verification Report</h1>
    <div class="timestamp">Generated: $(date)</div>
    
    <div class="metric verified">
        <h3>📊 Overall Reliability: $RELIABILITY</h3>
        <p>$VERIFIED_CLAIMS out of $TOTAL_CLAIMS claims verified against multiple news sources</p>
    </div>
    
    <div class="metric">
        <h3>📰 Sources Checked</h3>
        <ul>
            <li>NPR News RSS</li>
            <li>CNN News RSS</li>
            <li>NBC News RSS</li>
            <li>CBC News RSS</li>
        </ul>
    </div>
    
    <div class="metric">
        <h3>🔗 Latest Report Data</h3>
        <p><a href="report-$TIMESTAMP.json">Download JSON Report</a></p>
    </div>
    
    <div class="metric">
        <h3>⚠️ Disclaimer</h3>
        <p>This automated verification system cross-references claims against current news sources. 
        All timeline events should be independently verified before use in research or reporting.</p>
    </div>
</body>
</html>
EOF
    
    # Update container with latest verification data
    if docker ps | grep -q "trumpstein-timeline"; then
        docker cp "$REPORT_DIR/latest-report.html" trumpstein-timeline:/usr/share/nginx/html/verification-report.html
        log "Verification report deployed to container"
    fi
    
else
    log "ERROR: Fact-check report not found"
    exit 1
fi

# Cleanup old reports (keep last 10)
find "$REPORT_DIR" -name "report-*.json" -type f | sort -r | tail -n +11 | xargs rm -f

log "Verification report generation complete"