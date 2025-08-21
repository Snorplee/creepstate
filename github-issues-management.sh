#!/bin/bash

# Creepstate Investigation Platform - GitHub Issues Management Script
# Quick commands for managing issues after initial setup

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🔧 Creepstate Investigation Platform - Issues Management${NC}"
echo ""

# Function to check gh CLI
check_gh_cli() {
    if ! command -v gh &> /dev/null; then
        echo -e "${RED}❌ GitHub CLI (gh) is not installed${NC}"
        exit 1
    fi
    
    if ! gh auth status &> /dev/null; then
        echo -e "${RED}❌ GitHub CLI is not authenticated${NC}"
        exit 1
    fi
    
    echo -e "${GREEN}✅ GitHub CLI ready${NC}"
}

# Function to display menu
show_menu() {
    echo -e "${YELLOW}Select an option:${NC}"
    echo "1. List all issues"
    echo "2. List critical issues"
    echo "3. List issues by milestone"
    echo "4. List issues by label"
    echo "5. Create project board"
    echo "6. Update issue priorities"
    echo "7. Close resolved issues"
    echo "8. Add issue to milestone"
    echo "9. Generate status report"
    echo "0. Exit"
    echo ""
}

# Function to list all issues
list_all_issues() {
    echo -e "${BLUE}📋 All Issues:${NC}"
    gh issue list --state all --limit 50
}

# Function to list critical issues
list_critical_issues() {
    echo -e "${RED}🚨 Critical Issues:${NC}"
    gh issue list --label "critical" --state open
    echo ""
    echo -e "${RED}🔒 Security Issues:${NC}"
    gh issue list --label "security" --state open
}

# Function to list issues by milestone
list_by_milestone() {
    echo -e "${YELLOW}Select milestone:${NC}"
    echo "1. v2.1.5 - Emergency Fixes"
    echo "2. v2.2.0 - Database Integration"
    echo "3. v2.3.0 - Enhanced Features"
    echo "4. v3.0.0 - Complete Platform"
    read -p "Enter choice (1-4): " milestone_choice
    
    case $milestone_choice in
        1) gh issue list --milestone "v2.1.5 - Emergency Fixes" ;;
        2) gh issue list --milestone "v2.2.0 - Database Integration" ;;
        3) gh issue list --milestone "v2.3.0 - Enhanced Features" ;;
        4) gh issue list --milestone "v3.0.0 - Complete Platform" ;;
        *) echo "Invalid choice" ;;
    esac
}

# Function to list issues by label
list_by_label() {
    echo -e "${YELLOW}Common labels:${NC}"
    echo "bug, feature, enhancement, security, critical, frontend, backend, database"
    echo "visualization, timeline, flight-logs, network-analysis, documentation"
    echo ""
    read -p "Enter label name: " label_name
    gh issue list --label "$label_name"
}

# Function to create project board
create_project_board() {
    echo -e "${BLUE}🗂️ Creating Project Board...${NC}"
    
    # Check if project already exists
    if gh project list | grep -q "Creepstate Investigation Platform Tracker"; then
        echo -e "${YELLOW}⚠️ Project board already exists${NC}"
        gh project list
        return
    fi
    
    # Create project board
    echo "Creating project board..."
    gh project create --title "Creepstate Investigation Platform Tracker" --body "Comprehensive tracking for timeline project development"
    
    echo -e "${GREEN}✅ Project board created${NC}"
    echo "You can now manually add issues to the project board via the GitHub web interface"
}

# Function to update issue priorities
update_priorities() {
    echo -e "${BLUE}🎯 Updating Issue Priorities...${NC}"
    
    # List issues that might need priority updates
    echo "Issues that might need priority review:"
    gh issue list --label "needs-investigation" --state open
    
    echo ""
    echo "To update priorities, use commands like:"
    echo "  gh issue edit [issue-number] --add-label 'priority-high'"
    echo "  gh issue edit [issue-number] --remove-label 'priority-medium'"
}

# Function to close resolved issues
close_resolved_issues() {
    echo -e "${BLUE}✅ Managing Resolved Issues...${NC}"
    
    echo "Issues that might be resolved (check manually):"
    gh issue list --label "needs-testing" --state open
    
    echo ""
    echo "To close issues, use:"
    echo "  gh issue close [issue-number] --comment 'Issue resolved in v2.1.4'"
    
    # Show specific resolved issues that should be closed
    echo ""
    echo -e "${GREEN}Known resolved issues that should be closed:${NC}"
    echo "- JavaScript documentElement error (resolved in v2.1.4)"
    echo "- Version tracking system (completed)"
    echo "- Docker optimization (completed)"
}

# Function to add issue to milestone
add_to_milestone() {
    echo -e "${BLUE}🎯 Add Issue to Milestone${NC}"
    
    read -p "Enter issue number: " issue_number
    echo ""
    echo "Available milestones:"
    echo "1. v2.1.5 - Emergency Fixes"
    echo "2. v2.2.0 - Database Integration"
    echo "3. v2.3.0 - Enhanced Features"
    echo "4. v3.0.0 - Complete Platform"
    read -p "Enter milestone choice (1-4): " milestone_choice
    
    case $milestone_choice in
        1) milestone="v2.1.5 - Emergency Fixes" ;;
        2) milestone="v2.2.0 - Database Integration" ;;
        3) milestone="v2.3.0 - Enhanced Features" ;;
        4) milestone="v3.0.0 - Complete Platform" ;;
        *) echo "Invalid choice"; return ;;
    esac
    
    gh issue edit "$issue_number" --milestone "$milestone"
    echo -e "${GREEN}✅ Issue #$issue_number added to $milestone${NC}"
}

# Function to generate status report
generate_status_report() {
    echo -e "${BLUE}📊 Generating Status Report...${NC}"
    
    echo "======================================"
    echo "Creepstate Investigation Platform - Status Report"
    echo "Generated: $(date)"
    echo "======================================"
    echo ""
    
    echo "## Issue Summary"
    echo "Total Open Issues: $(gh issue list --state open | wc -l)"
    echo "Total Closed Issues: $(gh issue list --state closed | wc -l)"
    echo ""
    
    echo "## By Priority"
    echo "Critical: $(gh issue list --label 'priority-critical' --state open | wc -l)"
    echo "High: $(gh issue list --label 'priority-high' --state open | wc -l)"
    echo "Medium: $(gh issue list --label 'priority-medium' --state open | wc -l)"
    echo "Low: $(gh issue list --label 'priority-low' --state open | wc -l)"
    echo ""
    
    echo "## By Component"
    echo "Frontend: $(gh issue list --label 'frontend' --state open | wc -l)"
    echo "Backend: $(gh issue list --label 'backend' --state open | wc -l)"
    echo "Database: $(gh issue list --label 'database' --state open | wc -l)"
    echo "Security: $(gh issue list --label 'security' --state open | wc -l)"
    echo ""
    
    echo "## By Milestone"
    echo "v2.1.5: $(gh issue list --milestone 'v2.1.5 - Emergency Fixes' --state open | wc -l)"
    echo "v2.2.0: $(gh issue list --milestone 'v2.2.0 - Database Integration' --state open | wc -l)"
    echo "v2.3.0: $(gh issue list --milestone 'v2.3.0 - Enhanced Features' --state open | wc -l)"
    echo "v3.0.0: $(gh issue list --milestone 'v3.0.0 - Complete Platform' --state open | wc -l)"
    echo ""
    
    echo "## Critical Issues Requiring Immediate Attention"
    gh issue list --label 'critical' --state open --json number,title | jq -r '.[] | "Issue #\(.number): \(.title)"'
    echo ""
    
    echo "## Security Issues"
    gh issue list --label 'security' --state open --json number,title | jq -r '.[] | "Issue #\(.number): \(.title)"'
    
    echo ""
    echo "======================================"
}

# Main script execution
check_gh_cli

while true; do
    show_menu
    read -p "Enter your choice (0-9): " choice
    
    case $choice in
        1) list_all_issues ;;
        2) list_critical_issues ;;
        3) list_by_milestone ;;
        4) list_by_label ;;
        5) create_project_board ;;
        6) update_priorities ;;
        7) close_resolved_issues ;;
        8) add_to_milestone ;;
        9) generate_status_report ;;
        0) echo -e "${GREEN}👋 Goodbye!${NC}"; exit 0 ;;
        *) echo -e "${RED}❌ Invalid choice. Please try again.${NC}" ;;
    esac
    
    echo ""
    read -p "Press Enter to continue..."
    echo ""
done