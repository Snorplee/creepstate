#!/bin/bash

# Trump-Epstein Timeline - Issues Setup Verification Script
# Verifies that all GitHub issues, labels, and milestones were created correctly

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🔍 Trump-Epstein Timeline - Issues Setup Verification${NC}"
echo "=================================================="
echo ""

# Function to check if command exists
check_command() {
    if ! command -v "$1" &> /dev/null; then
        echo -e "${RED}❌ $1 is not installed${NC}"
        return 1
    fi
    return 0
}

# Function to check GitHub CLI authentication
check_auth() {
    if ! gh auth status &> /dev/null; then
        echo -e "${RED}❌ GitHub CLI is not authenticated${NC}"
        echo "Please run: gh auth login"
        return 1
    fi
    return 0
}

# Function to verify labels
verify_labels() {
    echo -e "${YELLOW}🏷️  Verifying Labels...${NC}"
    
    expected_labels=(
        "bug"
        "security" 
        "critical"
        "enhancement"
        "feature"
        "documentation"
        "frontend"
        "backend"
        "database"
        "visualization"
        "timeline"
        "flight-logs"
        "network-analysis"
        "priority-critical"
        "priority-high"
        "priority-medium"
        "priority-low"
        "in-progress"
        "needs-investigation"
        "blocked"
        "needs-testing"
        "investigation"
        "infrastructure"
        "performance"
    )
    
    echo "Checking for ${#expected_labels[@]} expected labels..."
    
    # Get all labels
    existing_labels=$(gh label list --json name -q '.[].name')
    
    missing_labels=()
    for label in "${expected_labels[@]}"; do
        if echo "$existing_labels" | grep -q "^$label$"; then
            echo -e "${GREEN}✅ $label${NC}"
        else
            echo -e "${RED}❌ $label (missing)${NC}"
            missing_labels+=("$label")
        fi
    done
    
    if [ ${#missing_labels[@]} -eq 0 ]; then
        echo -e "${GREEN}✅ All labels verified successfully${NC}"
        return 0
    else
        echo -e "${RED}❌ ${#missing_labels[@]} labels missing${NC}"
        return 1
    fi
}

# Function to verify milestones
verify_milestones() {
    echo -e "${YELLOW}🎯 Verifying Milestones...${NC}"
    
    expected_milestones=(
        "v2.1.5 - Emergency Fixes"
        "v2.2.0 - Database Integration"
        "v2.3.0 - Enhanced Features"
        "v3.0.0 - Complete Platform"
    )
    
    echo "Checking for ${#expected_milestones[@]} expected milestones..."
    
    # Get all milestones
    existing_milestones=$(gh api repos/:owner/:repo/milestones -q '.[].title')
    
    missing_milestones=()
    for milestone in "${expected_milestones[@]}"; do
        if echo "$existing_milestones" | grep -q "^$milestone$"; then
            echo -e "${GREEN}✅ $milestone${NC}"
        else
            echo -e "${RED}❌ $milestone (missing)${NC}"
            missing_milestones+=("$milestone")
        fi
    done
    
    if [ ${#missing_milestones[@]} -eq 0 ]; then
        echo -e "${GREEN}✅ All milestones verified successfully${NC}"
        return 0
    else
        echo -e "${RED}❌ ${#missing_milestones[@]} milestones missing${NC}"
        return 1
    fi
}

# Function to verify issues
verify_issues() {
    echo -e "${YELLOW}📋 Verifying Issues...${NC}"
    
    # Check total number of issues
    total_issues=$(gh issue list --state all --limit 100 | wc -l)
    echo "Total issues found: $total_issues"
    
    # Check for critical issues
    critical_count=$(gh issue list --label "critical" --state all | wc -l)
    echo "Critical issues: $critical_count"
    
    # Check for security issues
    security_count=$(gh issue list --label "security" --state all | wc -l)
    echo "Security issues: $security_count"
    
    # Check for specific high-priority issues
    echo ""
    echo "Key issues to verify:"
    
    # Look for image corruption issue
    if gh issue list --search "image corruption" --state all | grep -q "corruption"; then
        echo -e "${GREEN}✅ Image corruption issue found${NC}"
    else
        echo -e "${RED}❌ Image corruption issue missing${NC}"
    fi
    
    # Look for database credential issue
    if gh issue list --search "hardcoded credentials" --state all | grep -q "credentials"; then
        echo -e "${GREEN}✅ Database credentials security issue found${NC}"
    else
        echo -e "${RED}❌ Database credentials security issue missing${NC}"
    fi
    
    # Look for PostgreSQL integration
    if gh issue list --search "PostgreSQL" --state all | grep -q "PostgreSQL"; then
        echo -e "${GREEN}✅ PostgreSQL integration issue found${NC}"
    else
        echo -e "${RED}❌ PostgreSQL integration issue missing${NC}"
    fi
    
    # Check if issues have proper labels and milestones
    echo ""
    echo "Checking issue assignments:"
    unlabeled_count=$(gh issue list --no-assignee --state open | wc -l)
    echo "Issues without assignee: $unlabeled_count"
    
    if [ "$total_issues" -ge 10 ]; then
        echo -e "${GREEN}✅ Good number of issues created ($total_issues)${NC}"
        return 0
    else
        echo -e "${YELLOW}⚠️ Only $total_issues issues found (expected 10+)${NC}"
        return 1
    fi
}

# Function to verify issue templates
verify_templates() {
    echo -e "${YELLOW}📝 Verifying Issue Templates...${NC}"
    
    template_dir=".github/ISSUE_TEMPLATE"
    
    if [ ! -d "$template_dir" ]; then
        echo -e "${RED}❌ Issue template directory missing${NC}"
        return 1
    fi
    
    expected_templates=(
        "bug_report.md"
        "feature_request.md"
        "security_issue.md"
        "documentation_improvement.md"
    )
    
    missing_templates=()
    for template in "${expected_templates[@]}"; do
        if [ -f "$template_dir/$template" ]; then
            echo -e "${GREEN}✅ $template${NC}"
        else
            echo -e "${RED}❌ $template (missing)${NC}"
            missing_templates+=("$template")
        fi
    done
    
    if [ ${#missing_templates[@]} -eq 0 ]; then
        echo -e "${GREEN}✅ All issue templates verified${NC}"
        return 0
    else
        echo -e "${RED}❌ ${#missing_templates[@]} templates missing${NC}"
        return 1
    fi
}

# Function to generate verification report
generate_report() {
    echo ""
    echo "=================================================="
    echo -e "${BLUE}📊 VERIFICATION REPORT${NC}"
    echo "=================================================="
    
    echo "Repository: $(gh repo view --json nameWithOwner -q .nameWithOwner)"
    echo "Verified at: $(date)"
    echo ""
    
    echo "## Summary"
    gh issue list --state all --limit 1 > /dev/null 2>&1 && echo "✅ GitHub API access working" || echo "❌ GitHub API access failed"
    echo "Total Issues: $(gh issue list --state all --limit 100 | wc -l)"
    echo "Open Issues: $(gh issue list --state open | wc -l)"
    echo "Closed Issues: $(gh issue list --state closed | wc -l)"
    echo ""
    
    echo "## Issues by Priority"
    echo "Critical: $(gh issue list --label 'priority-critical' --state open | wc -l)"
    echo "High: $(gh issue list --label 'priority-high' --state open | wc -l)"
    echo "Medium: $(gh issue list --label 'priority-medium' --state open | wc -l)"
    echo "Low: $(gh issue list --label 'priority-low' --state open | wc -l)"
    echo ""
    
    echo "## Issues by Type"
    echo "Bugs: $(gh issue list --label 'bug' --state open | wc -l)"
    echo "Features: $(gh issue list --label 'feature' --state open | wc -l)"
    echo "Enhancements: $(gh issue list --label 'enhancement' --state open | wc -l)"
    echo "Security: $(gh issue list --label 'security' --state open | wc -l)"
    echo ""
    
    echo "## Next Steps"
    echo "1. Review all issues for accuracy"
    echo "2. Update priorities as needed"
    echo "3. Create project board for visual tracking"
    echo "4. Begin work on critical issues"
    echo "5. Set up regular issue triage meetings"
    echo ""
    
    echo "🔗 View issues: https://github.com/$(gh repo view --json nameWithOwner -q .nameWithOwner)/issues"
}

# Main verification process
main() {
    echo "Starting verification process..."
    echo ""
    
    # Check prerequisites
    if ! check_command "gh"; then
        echo "Please install GitHub CLI: https://cli.github.com/"
        exit 1
    fi
    
    if ! check_command "jq"; then
        echo -e "${YELLOW}⚠️ jq not found. Some features may not work perfectly.${NC}"
    fi
    
    if ! check_auth; then
        exit 1
    fi
    
    echo -e "${GREEN}✅ Prerequisites checked${NC}"
    echo ""
    
    # Run verifications
    verification_results=()
    
    verify_labels && verification_results+=("labels:✅") || verification_results+=("labels:❌")
    echo ""
    
    verify_milestones && verification_results+=("milestones:✅") || verification_results+=("milestones:❌")
    echo ""
    
    verify_issues && verification_results+=("issues:✅") || verification_results+=("issues:❌")
    echo ""
    
    verify_templates && verification_results+=("templates:✅") || verification_results+=("templates:❌")
    echo ""
    
    # Generate final report
    generate_report
    
    # Final status
    echo "=================================================="
    echo -e "${BLUE}VERIFICATION COMPLETE${NC}"
    echo "=================================================="
    
    failed_checks=0
    for result in "${verification_results[@]}"; do
        component=$(echo "$result" | cut -d: -f1)
        status=$(echo "$result" | cut -d: -f2)
        echo "$component: $status"
        if [ "$status" = "❌" ]; then
            ((failed_checks++))
        fi
    done
    
    if [ $failed_checks -eq 0 ]; then
        echo ""
        echo -e "${GREEN}🎉 All verifications passed! Issues setup is complete.${NC}"
        exit 0
    else
        echo ""
        echo -e "${YELLOW}⚠️ $failed_checks verification(s) failed. Please review and fix.${NC}"
        exit 1
    fi
}

# Run main function
main "$@"