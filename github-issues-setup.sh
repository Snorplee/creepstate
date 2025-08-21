#!/bin/bash

# Trump-Epstein Timeline - GitHub Issues Setup Script
# Comprehensive issues tracking system creation
# Run this script from the repository root directory after authenticating with gh CLI

set -e

echo "🔧 Setting up GitHub Issues for Trump-Epstein Timeline Project"
echo "Repository: https://github.com/Snorplee/creepstate"
echo ""

# Check if gh CLI is available and authenticated
if ! command -v gh &> /dev/null; then
    echo "❌ GitHub CLI (gh) is not installed. Please install it first:"
    echo "   https://cli.github.com/"
    exit 1
fi

# Check authentication
if ! gh auth status &> /dev/null; then
    echo "❌ GitHub CLI is not authenticated. Please run: gh auth login"
    exit 1
fi

echo "✅ GitHub CLI is installed and authenticated"
echo ""

# Function to create label if it doesn't exist
create_label() {
    local name="$1"
    local description="$2"
    local color="$3"
    
    if ! gh label list | grep -q "^$name"; then
        echo "Creating label: $name"
        gh label create "$name" --description "$description" --color "$color"
    else
        echo "Label exists: $name"
    fi
}

# Function to create milestone if it doesn't exist
create_milestone() {
    local title="$1"
    local description="$2"
    local due_date="$3"
    
    if ! gh api repos/:owner/:repo/milestones | jq -r '.[].title' | grep -q "^$title$"; then
        echo "Creating milestone: $title"
        if [ -n "$due_date" ]; then
            gh api repos/:owner/:repo/milestones -f title="$title" -f description="$description" -f due_on="$due_date"
        else
            gh api repos/:owner/:repo/milestones -f title="$title" -f description="$description"
        fi
    else
        echo "Milestone exists: $title"
    fi
}

echo "📋 Creating GitHub Labels..."

# Bug labels
create_label "bug" "Critical functionality issues" "d73a4a"
create_label "security" "Security vulnerabilities and data integrity issues" "ff0000"
create_label "critical" "Must fix immediately - breaking functionality" "b60205"

# Enhancement labels
create_label "enhancement" "New features and improvements" "a2eeef"
create_label "feature" "New feature requests" "0075ca"
create_label "documentation" "Documentation improvements" "0052cc"

# Component labels
create_label "frontend" "UI/UX, HTML, CSS, JavaScript frontend issues" "1d76db"
create_label "backend" "API, server, data processing backend issues" "5319e7"
create_label "database" "PostgreSQL, data management, schema issues" "fbca04"
create_label "visualization" "Charts, graphs, network diagrams, timeline displays" "bfd4f2"
create_label "timeline" "Timeline functionality and data" "c2e0c6"
create_label "flight-logs" "Flight log data and analysis" "fef2c0"
create_label "network-analysis" "Associate network and relationship mapping" "ff9f1c"

# Priority labels
create_label "priority-critical" "Must fix immediately" "b60205"
create_label "priority-high" "Important for next release" "d93f0b"
create_label "priority-medium" "Nice to have improvements" "fbca04"
create_label "priority-low" "Future consideration" "0e8a16"

# Status labels
create_label "in-progress" "Currently being worked on" "ffa500"
create_label "needs-investigation" "Requires further research" "cc317c"
create_label "blocked" "Blocked by external dependency" "b60205"
create_label "needs-testing" "Ready for testing" "9932cc"

# Type labels
create_label "investigation" "Research and investigation tasks" "006b75"
create_label "infrastructure" "CI/CD, deployment, server setup" "0052cc"
create_label "performance" "Performance optimization issues" "1d76db"

echo ""
echo "🎯 Creating GitHub Milestones..."

# Create milestones with due dates
create_milestone "v2.1.5 - Emergency Fixes" "Image corruption fixes, navigation improvements, critical bug fixes" "2025-08-25T23:59:59Z"
create_milestone "v2.2.0 - Database Integration" "PostgreSQL integration, flight logs database, API improvements" "2025-09-15T23:59:59Z"
create_milestone "v2.3.0 - Enhanced Features" "Photo gallery, wiki system, advanced visualizations" "2025-10-15T23:59:59Z"
create_milestone "v3.0.0 - Complete Platform" "Full journalist database platform, investigation tools" "2025-12-15T23:59:59Z"

echo ""
echo "🐛 Creating Critical Bug Issues..."

# CRITICAL ISSUE #1: JavaScript documentElement error (RESOLVED)
gh issue create \
    --title "RESOLVED: JavaScript documentElement error causing timeline crashes" \
    --body "$(cat <<'EOF'
## Issue Description
The main timeline page was failing to load with the error:
```
TypeError: Cannot read properties of null (reading 'documentElement')
```

## Root Cause
- SIMILE Timeline API accessing `document.documentElement` before DOM ready
- Google Translate Script race conditions
- Missing error handling for external script failures

## Resolution Implemented ✅
- Added comprehensive DOM safety checks
- Implemented bulletproof error handling
- Created fallback timeline options
- Added graceful degradation for external scripts

## Files Modified
- `index.html` - Main timeline with bulletproof loading
- `translate-widget.js` - Safe translation widget
- `test-fixes.html` - Test suite for verification

## Verification
- [x] documentElement access errors resolved
- [x] Comprehensive error handling added
- [x] Graceful fallbacks implemented
- [x] User-friendly error messages
- [x] Alternative content when timeline fails

## Version
Fixed in v2.1.4 (Emergency deployment)
EOF
)" \
    --label "bug,critical,frontend,timeline" \
    --label "priority-critical" \
    --milestone "v2.1.5 - Emergency Fixes" \
    --assignee "@me"

# Wait to avoid rate limiting
sleep 2

# CRITICAL ISSUE #2: Image directory corruption
gh issue create \
    --title "CRITICAL: Image directory corruption - files appear to be code instead of images" \
    --body "$(cat <<'EOF'
## Problem Description
Investigation reveals that files in the `images/` directory appear to contain code/text content instead of actual image data, suggesting possible file corruption or incorrect file types.

## Impact
- Image gallery functionality broken
- Timeline visualizations missing images
- Portrait displays in network analysis non-functional
- User experience severely degraded

## Investigation Required
- [ ] Verify file types and content of all files in `/images/` directory
- [ ] Check if files were corrupted during download/transfer
- [ ] Identify which files are actually images vs. text/code files
- [ ] Determine source of corruption

## Files to Investigate
- `images/*.jpg` files may contain text instead of image data
- Check `photo-manifest.json` for accuracy
- Verify image download scripts functionality

## Priority
This is a **CRITICAL** issue affecting core functionality and user experience.

## Related Components
- Image gallery system
- Timeline visualizations  
- Network analysis portraits
- Photo download scripts
EOF
)" \
    --label "bug,critical,security,frontend" \
    --label "priority-critical" \
    --milestone "v2.1.5 - Emergency Fixes" \
    --assignee "@me"

sleep 2

# BUG ISSUE #3: Timeline data loading failures
gh issue create \
    --title "Timeline data loading failures in network visualizations" \
    --body "$(cat <<'EOF'
## Issue Description
Network visualization page shows loading errors and fails to display the complete associate network of 89+ connections.

## Symptoms
- Limited nodes displayed instead of full network
- Missing connections between associates
- Data loading timeouts
- Incomplete visualization rendering

## Expected Behavior
Should display complete network including:
- Politicians (Trump, Clinton, etc.)
- Royalty (Prince Andrew, etc.)
- Business leaders
- Academics (Stephen Hawking, etc.)
- Victim groups
- All documented connections

## Files Involved
- `enhanced-visualizations.html`
- `enhanced-network-data.js`
- Network data loading scripts

## Debugging Steps
- [ ] Check network data completeness
- [ ] Verify data loading timeouts
- [ ] Test with smaller data subsets
- [ ] Review JavaScript console errors
EOF
)" \
    --label "bug,frontend,visualization,network-analysis" \
    --label "priority-high" \
    --milestone "v2.2.0 - Database Integration" \
    --assignee "@me"

sleep 2

# BUG ISSUE #4: Missing navigation elements
gh issue create \
    --title "Missing navigation elements - footer and top navigation issues" \
    --body "$(cat <<'EOF'
## Issue Description
Several pages are missing essential navigation elements, making it difficult for users to navigate between different sections of the timeline.

## Missing Elements
- [ ] Footer navigation links
- [ ] Top navigation menu consistency
- [ ] Breadcrumb navigation
- [ ] "Statistics" page missing from navigation (user reported it was "amazing")

## Affected Pages
- Main timeline (`index.html`)
- Network visualizations (`enhanced-visualizations.html`)
- Various secondary pages

## User Impact
- Poor user experience
- Difficulty finding key features
- Broken user flow between sections

## Requirements
- Consistent navigation across all pages
- Quick access to key features
- Mobile-responsive navigation
- Clear visual hierarchy
EOF
)" \
    --label "bug,frontend,enhancement" \
    --label "priority-medium" \
    --milestone "v2.1.5 - Emergency Fixes" \
    --assignee "@me"

sleep 2

echo "✨ Creating Feature Request Issues..."

# FEATURE #1: PostgreSQL flight logs database
gh issue create \
    --title "PostgreSQL flight logs database integration" \
    --body "$(cat <<'EOF'
## Feature Description
Implement comprehensive PostgreSQL database system for flight logs analysis and investigation tools.

## Database Schema
✅ **COMPLETED**: Comprehensive schema designed with:
- Flight data tables (flights, aircraft, passengers, locations)
- Investigation tables (connections, timeline events, cases)
- Security audit tables (access logs, data changes)
- Advanced indexing for performance
- Audit triggers for data integrity

## Implementation Tasks
- [x] Database schema design (`database/schema.sql`)
- [ ] Database initialization scripts
- [ ] Data import from CSV files
- [ ] API integration (`api/flight_api.py`)
- [ ] Frontend database connectivity
- [ ] Query optimization
- [ ] Backup and recovery procedures

## Files Involved
- `database/schema.sql` - Complete PostgreSQL schema
- `database/import_flights.sql` - Data import procedures
- `api/flight_api.py` - API endpoints
- `scripts/import_csv_data.py` - Data processing scripts

## Benefits
- Professional-grade data management
- Advanced search and filtering
- Investigation case management
- Audit trail for transparency
- Scalable architecture for large datasets
EOF
)" \
    --label "feature,database,backend" \
    --label "priority-high" \
    --milestone "v2.2.0 - Database Integration" \
    --assignee "@me"

sleep 2

# FEATURE #2: Photo gallery system
gh issue create \
    --title "Enhanced photo gallery system for timeline events" \
    --body "$(cat <<'EOF'
## Feature Description
Create a comprehensive photo gallery system to display images related to timeline events, locations, and key figures.

## Requirements
- [ ] Grid-based photo gallery layout
- [ ] Image categorization by:
  - People (politicians, business leaders, victims)
  - Events (parties, meetings, legal proceedings)
  - Locations (properties, aircraft, venues)
- [ ] Full-screen lightbox viewing
- [ ] Image metadata and source attribution
- [ ] Search and filtering capabilities
- [ ] Mobile-responsive design

## Technical Implementation
- [ ] Fix corrupted image files in `images/` directory
- [ ] Implement responsive CSS grid layout
- [ ] Add JavaScript lightbox functionality
- [ ] Create image manifest system
- [ ] Integrate with timeline events

## Dependencies
- Requires fixing image corruption issue (#2)
- Verify photo download scripts
- Update `photo-manifest.json`

## Files to Create/Modify
- `photo-gallery.html` - Main gallery page
- `css/gallery.css` - Gallery styling
- `js/gallery.js` - Gallery functionality
- Enhanced `photo-manifest.json`
EOF
)" \
    --label "feature,frontend,enhancement" \
    --label "priority-medium" \
    --milestone "v2.3.0 - Enhanced Features" \
    --assignee "@me"

sleep 2

# FEATURE #3: Wiki system
gh issue create \
    --title "Wiki system for documentation and investigation notes" \
    --body "$(cat <<'EOF'
## Feature Description
Implement a wiki-style documentation system for organizing investigation findings, evidence, and analytical notes.

## Core Features
- [ ] Markdown-based article system
- [ ] Cross-referencing between articles
- [ ] Search functionality
- [ ] Version history tracking
- [ ] Category organization
- [ ] Rich media embedding (images, videos, documents)

## Wiki Sections
- **People**: Detailed profiles of key figures
- **Events**: In-depth analysis of significant events
- **Locations**: Property and venue information
- **Legal Cases**: Court proceedings and legal documents
- **Evidence**: Document and testimony analysis
- **Timeline Analysis**: Research methodologies

## Technical Implementation
- [ ] Static site generator integration
- [ ] Markdown parser and renderer
- [ ] Full-text search indexing
- [ ] Navigation and categorization system
- [ ] Mobile-responsive design

## Benefits
- Centralized knowledge base
- Easy content management
- Collaborative research platform
- Professional documentation standards
EOF
)" \
    --label "feature,documentation,enhancement" \
    --label "priority-medium" \
    --milestone "v2.3.0 - Enhanced Features" \
    --assignee "@me"

sleep 2

# FEATURE #4: Enhanced visualizations
gh issue create \
    --title "Enhanced visualizations breaking - fix data loading failures" \
    --body "$(cat <<'EOF'
## Issue Description
The enhanced visualizations page is experiencing data loading failures, preventing proper display of network analysis, timeline charts, and interactive features.

## Current Problems
- [ ] Network visualization showing limited nodes (should show 89+ associates)
- [ ] Slideshow functionality broken ("Start Slideshow" button non-responsive)
- [ ] Connections Matrix empty
- [ ] Geographic View not implemented
- [ ] Portrait images not displaying in network nodes

## Required Enhancements
- [ ] Fix data loading timeouts
- [ ] Implement complete network graph with all associates
- [ ] Add interactive timeline charts
- [ ] Create geographic visualization of events
- [ ] Implement relationship strength indicators
- [ ] Add filtering and search capabilities

## Technical Issues
- JavaScript errors in network rendering
- Data source connectivity problems
- Reveal.js slideshow initialization failures
- Missing geographic data integration

## Files Involved
- `enhanced-visualizations.html`
- `enhanced-network-data.js`
- `enhanced-network-visualization.js`
- Network data sources
EOF
)" \
    --label "bug,feature,visualization,frontend" \
    --label "priority-high" \
    --milestone "v2.2.0 - Database Integration" \
    --assignee "@me"

sleep 2

echo "🔧 Creating Technical Debt Issues..."

# TECH DEBT #1: Version tracking system (COMPLETED)
gh issue create \
    --title "COMPLETED: Version tracking system implementation" \
    --body "$(cat <<'EOF'
## Implementation Status: ✅ COMPLETED

A comprehensive version tracking system has been successfully implemented for the Trump-Epstein Timeline project.

## Features Implemented
- [x] Centralized version management (`version.js`)
- [x] Synchronized version numbers across all pages
- [x] Build timestamp tracking
- [x] Page-specific version information
- [x] Console logging for debugging
- [x] Footer version displays
- [x] Copy-to-clipboard functionality
- [x] Version update notifications
- [x] Performance tracking
- [x] Browser feature detection

## Current Version
**v2.1.4** - Emergency fix deployment
- Build timestamp tracking
- Emergency production environment
- Git commit references
- Comprehensive error handling

## Files Implemented
- `version.js` - Complete version management system
- Integrated across all HTML pages
- Meta tag updates for SEO
- Console debugging tools

## Benefits Achieved
- Professional version tracking
- Easy debugging and support
- User feedback with version info
- Build environment tracking
- Performance monitoring
EOF
)" \
    --label "enhancement,infrastructure" \
    --label "priority-high" \
    --milestone "v2.1.5 - Emergency Fixes" \
    --assignee "@me"

sleep 2

# SECURITY #1: Remove hardcoded credentials
gh issue create \
    --title "SECURITY: Remove hardcoded credentials from database schema" \
    --body "$(cat <<'EOF'
## Security Issue Description
The database schema file contains hardcoded passwords and credentials that pose a security risk.

## Security Risks
- Database passwords in plain text
- User account credentials exposed
- Potential unauthorized access
- Version control exposure of secrets

## Files Affected
- `database/schema.sql` - Contains hardcoded database passwords
- Any configuration files with embedded credentials

## Required Actions
- [ ] Remove all hardcoded passwords from schema
- [ ] Implement environment variable configuration
- [ ] Create secure credential management system
- [ ] Add .env file support
- [ ] Update documentation for secure setup
- [ ] Audit all files for embedded secrets

## Implementation Strategy
- Use environment variables for sensitive data
- Create template configuration files
- Implement secure credential injection
- Add security scanning to CI/CD pipeline

## Priority
**CRITICAL** - Must be resolved before any production deployment
EOF
)" \
    --label "security,critical,infrastructure" \
    --label "priority-critical" \
    --milestone "v2.1.5 - Emergency Fixes" \
    --assignee "@me"

sleep 2

# INVESTIGATION #1: Image verification
gh issue create \
    --title "INVESTIGATION: Verify image file integrity and content" \
    --body "$(cat <<'EOF'
## Investigation Required
Conduct thorough verification of all image files to ensure they contain actual image data and not corrupted text/code content.

## Investigation Steps
- [ ] **File Type Analysis**: Check MIME types of all files in `images/` directory
- [ ] **Content Verification**: Verify that .jpg files actually contain JPEG image data
- [ ] **Corruption Detection**: Identify files that may have been corrupted during download
- [ ] **Source Verification**: Cross-check with original image sources
- [ ] **Download Script Audit**: Review image download scripts for errors

## Files to Investigate
```
images/*.jpg - Verify all JPEG files contain valid image data
images/people/* - Check people directory structure
photo-manifest.json - Verify manifest accuracy
download-*.py scripts - Audit download processes
```

## Expected Findings
- Identify corrupted or misnamed files
- Document missing images
- Catalog files that need re-downloading
- Verify download script functionality

## Remediation Plan
- Re-download corrupted images from verified sources
- Fix file naming and organization
- Update download scripts with error handling
- Implement file integrity checking

## Security Considerations
- Verify image sources are legitimate
- Check for any malicious content
- Ensure downloaded files are safe
EOF
)" \
    --label "investigation,security,bug" \
    --label "priority-high" \
    --milestone "v2.1.5 - Emergency Fixes" \
    --assignee "@me"

sleep 2

echo "📊 Creating Enhancement Issues..."

# ENHANCEMENT #1: Statistics page restoration
gh issue create \
    --title "Restore and enhance Statistics page (user reported as 'amazing')" \
    --body "$(cat <<'EOF'
## Issue Description
User feedback indicates that the Statistics page was previously available and described as "amazing", but is now missing from the navigation and appears to be inaccessible.

## Requirements
- [ ] Locate existing statistics implementation
- [ ] Restore page to navigation menu
- [ ] Enhance statistical analysis features
- [ ] Add new metrics and visualizations

## Proposed Statistics Features
- **Timeline Metrics**:
  - Total events tracked
  - Event distribution by year
  - Event categories breakdown
  - Geographic distribution

- **Network Analysis**:
  - Total associates mapped
  - Connection strength analysis
  - Relationship type distribution
  - Network centrality metrics

- **Flight Log Analysis**:
  - Total flights tracked
  - Route frequency analysis
  - Passenger travel patterns
  - Aircraft utilization

- **Investigation Metrics**:
  - Evidence collection stats
  - Source verification rates
  - Data quality metrics

## Technical Implementation
- [ ] Interactive charts and graphs
- [ ] Real-time data updates
- [ ] Export capabilities
- [ ] Mobile-responsive design
- [ ] Performance optimized queries

## Files Involved
- `stats.html` (may exist or need creation)
- Statistical analysis JavaScript
- Data aggregation scripts
- Chart.js or D3.js integration
EOF
)" \
    --label "enhancement,frontend,visualization" \
    --label "priority-high" \
    --milestone "v2.2.0 - Database Integration" \
    --assignee "@me"

sleep 2

# ENHANCEMENT #2: Mind map implementation
gh issue create \
    --title "Fully implement interactive Mind Map features" \
    --body "$(cat <<'EOF'
## Feature Description
Enhance the existing mind map visualization with full interactive capabilities for exploring relationships and connections in the Trump-Epstein network.

## Current State
Basic mind map structure exists but lacks full interactivity and comprehensive features.

## Required Enhancements
- [ ] **Draggable Nodes**: Enable drag-and-drop repositioning
- [ ] **Live Connections**: Real-time connection drawing and editing
- [ ] **Intelligence Indicators**: Visual indicators for intelligence connections
- [ ] **Relationship Types**: Different connection types (business, personal, family, etc.)
- [ ] **Zoom and Pan**: Smooth navigation for large networks
- [ ] **Search Integration**: Find and highlight specific people/connections
- [ ] **Information Panels**: Detailed info on hover/click
- [ ] **Export Options**: Save as image or data formats

## Interactive Features
- Node clustering by relationship type
- Timeline filtering (show connections by time period)
- Strength-based connection visualization
- Multi-level relationship exploration
- Real-time collaboration capabilities

## Technical Implementation
- D3.js or Cytoscape.js for advanced graph visualization
- WebGL for performance with large datasets
- Touch-friendly mobile interface
- Keyboard shortcuts for power users
- Undo/redo functionality

## Data Integration
- Connect with PostgreSQL database
- Real-time data updates
- Version control for mind map changes
- Audit trail for modifications
EOF
)" \
    --label "enhancement,frontend,visualization,network-analysis" \
    --label "priority-high" \
    --milestone "v2.3.0 - Enhanced Features" \
    --assignee "@me"

sleep 2

echo "🏗️ Creating Infrastructure Issues..."

# INFRASTRUCTURE #1: Docker optimization
gh issue create \
    --title "COMPLETED: Docker container optimization and cleanup" \
    --body "$(cat <<'EOF'
## Status: ✅ COMPLETED

Docker container optimization has been successfully implemented to improve build performance and reduce image size.

## Optimizations Completed
- [x] Removed unnecessary files from build context
- [x] Multi-stage build implementation
- [x] Optimized layer caching
- [x] Security improvements
- [x] Build time reduction

## Files Involved
- `Dockerfile` - Optimized build process
- `docker-compose.yml` - Service configuration
- `.dockerignore` - Build context optimization

## Performance Improvements
- Reduced image size
- Faster build times
- Better layer caching
- Improved security posture

## Verification
Container builds successfully with optimized configuration and reduced resource usage.
EOF
)" \
    --label "enhancement,infrastructure" \
    --label "priority-medium" \
    --milestone "v2.1.5 - Emergency Fixes" \
    --assignee "@me"

sleep 2

# INFRASTRUCTURE #2: GitHub Actions CI/CD
gh issue create \
    --title "Implement GitHub Actions CI/CD pipeline" \
    --body "$(cat <<'EOF'
## Feature Description
Set up automated CI/CD pipeline using GitHub Actions for testing, building, and deployment of the Trump-Epstein Timeline project.

## Pipeline Requirements
- [ ] **Automated Testing**:
  - HTML validation
  - JavaScript linting (ESLint)
  - CSS validation
  - Link checking
  - Image integrity verification

- [ ] **Build Process**:
  - Docker image building
  - Asset optimization
  - Documentation generation
  - Version tagging

- [ ] **Security Scanning**:
  - Secret detection
  - Dependency vulnerability scanning
  - Static code analysis
  - Security policy enforcement

- [ ] **Deployment**:
  - Staging environment deployment
  - Production deployment (manual approval)
  - Rollback capabilities
  - Health checks

## Workflow Configuration
- Trigger on push to main branch
- Pull request validation
- Release automation
- Scheduled security scans

## Benefits
- Automated quality assurance
- Consistent deployments
- Early issue detection
- Professional development workflow
EOF
)" \
    --label "feature,infrastructure,enhancement" \
    --label "priority-medium" \
    --milestone "v2.3.0 - Enhanced Features" \
    --assignee "@me"

sleep 2

echo ""
echo "✅ GitHub Issues Setup Complete!"
echo ""
echo "📊 Summary of Issues Created:"
echo "   • Critical Bugs: 2 issues"
echo "   • High Priority Bugs: 2 issues"
echo "   • Security Issues: 1 critical issue"
echo "   • Feature Requests: 4 issues"
echo "   • Enhancements: 3 issues"
echo "   • Infrastructure: 2 issues"
echo "   • Investigation Tasks: 1 issue"
echo ""
echo "🏷️  Labels Created: 20 labels for comprehensive categorization"
echo "🎯 Milestones Created: 4 milestones with target dates"
echo ""
echo "🔗 View all issues: https://github.com/Snorplee/creepstate/issues"
echo "📋 Project board: Consider creating a project board for visual tracking"
echo ""
echo "Next Steps:"
echo "1. Review and prioritize issues"
echo "2. Set up project board for visual tracking"
echo "3. Begin work on critical security issues"
echo "4. Address image corruption issue"
echo "5. Plan v2.1.5 emergency release"