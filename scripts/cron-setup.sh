#!/bin/bash

# Setup automated fact-checking and container updates
# Runs fact-checker every 4 hours, auto-update daily

SCRIPT_DIR="/mnt/c/Users/snorplee/Documents/Dropbox/apps/trumpstein-timeline/scripts"

# Create log directories
sudo mkdir -p /var/log
sudo touch /var/log/timeline-updates.log /var/log/fact-checker.log
sudo chmod 666 /var/log/timeline-updates.log /var/log/fact-checker.log

# Install cron job for fact-checking (every 4 hours)
(crontab -l 2>/dev/null; echo "0 */4 * * * $SCRIPT_DIR/fact-checker.py >> /var/log/fact-checker.log 2>&1") | crontab -

# Install cron job for auto-updates (daily at 2 AM)
(crontab -l 2>/dev/null; echo "0 2 * * * $SCRIPT_DIR/auto-update.sh >> /var/log/timeline-updates.log 2>&1") | crontab -

# Install cron job for verification report (twice daily)
(crontab -l 2>/dev/null; echo "0 8,20 * * * $SCRIPT_DIR/generate-verification-report.sh >> /var/log/timeline-updates.log 2>&1") | crontab -

echo "Cron jobs installed successfully:"
echo "- Fact-checking: Every 4 hours"
echo "- Auto-updates: Daily at 2 AM"
echo "- Verification reports: 8 AM and 8 PM daily"
echo ""
echo "View logs with:"
echo "  tail -f /var/log/fact-checker.log"
echo "  tail -f /var/log/timeline-updates.log"