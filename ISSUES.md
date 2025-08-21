# Creepstate Investigation Platform Investigation - Issue Tracker

## 🐛 Bugs (High Priority)

### Network Visualization
- [ ] **BUG-001**: Network visualization only showing limited nodes instead of full 89+ associate network
  - **Status**: In Progress
  - **Priority**: High
  - **Details**: Should display all nodes including politicians, royalty, business leaders, academics, victims groups

### Slideshow Issues  
- [x] **BUG-002**: Slideshow text overflow in Network Visualizations
  - **Status**: Fixed
  - **Priority**: High
  - **Details**: Text was flowing off bottom of screen, fixed with CSS adjustments

- [ ] **BUG-003**: Slideshow won't start when clicking "Start Slideshow" button
  - **Status**: Pending
  - **Priority**: Medium
  - **Details**: Reveal.js initialization issue in Network Visualizations tab

### Missing Components
- [ ] **BUG-004**: Connections Matrix is empty
  - **Status**: Pending
  - **Priority**: Medium
  - **Details**: Matrix should show connection strength between all associates

- [ ] **BUG-005**: Geographic View not implemented
  - **Status**: Pending
  - **Priority**: Medium
  - **Details**: Should show interactive map with event locations

- [ ] **BUG-006**: Portrait images not showing in Network Visualizations
  - **Status**: Pending
  - **Priority**: Low
  - **Details**: Downloaded images not being used in network nodes

## ✨ Feature Requests

### Timeline Enhancements
- [x] **FEAT-001**: Add person-specific filtering
  - **Status**: Completed
  - **Priority**: High
  - **Details**: Filter timeline by Trump, Epstein, Maxwell, Clinton, etc.

- [x] **FEAT-002**: Add geographic filtering
  - **Status**: Completed
  - **Priority**: High
  - **Details**: Filter by New York, Florida, Virgin Islands, London, etc.

- [ ] **FEAT-003**: Add combined filter searches
  - **Status**: Pending
  - **Priority**: Medium
  - **Details**: Allow combining person + location + time period filters

### Data Enhancements
- [x] **FEAT-004**: Add more Robert Maxwell content
  - **Status**: Completed
  - **Priority**: High
  - **Details**: Added death, funeral, intelligence connections

- [ ] **FEAT-005**: Add J.D. Vance timeline events
  - **Status**: Pending
  - **Priority**: Low
  - **Details**: User requested Vance connections

### Gantt Timeline
- [ ] **FEAT-006**: Enhance Gantt timeline with person drill-down
  - **Status**: Pending
  - **Priority**: Medium
  - **Details**: Allow viewing timeline for specific person

- [ ] **FEAT-007**: Add more items to Gantt timeline
  - **Status**: Pending
  - **Priority**: Medium
  - **Details**: Currently showing limited events

### Mind Map
- [ ] **FEAT-008**: Fully implement ALL Mind Map features
  - **Status**: Pending
  - **Priority**: High
  - **Details**: Add draggable nodes, live connections, intelligence indicators

### Statistics Page
- [ ] **FEAT-009**: Restore and enhance Statistics page
  - **Status**: Pending
  - **Priority**: High
  - **Details**: User mentioned it was "amazing" but is now missing from navigation

## 🔧 Technical Debt

### Infrastructure
- [ ] **TECH-001**: GitHub authentication for issue tracking
  - **Status**: Pending
  - **Priority**: Low
  - **Details**: Set up gh CLI with proper authentication

- [x] **TECH-002**: Docker container optimization
  - **Status**: Completed
  - **Priority**: Medium
  - **Details**: Remove unnecessary files, optimize build

### Security
- [ ] **SEC-001**: Remove any hardcoded credentials
  - **Status**: In Progress
  - **Priority**: Critical
  - **Details**: Ensure no PATs, passwords, or usernames in code

- [ ] **SEC-002**: Implement proper secret management
  - **Status**: Pending
  - **Priority**: High
  - **Details**: Use environment variables for sensitive data

## 📊 Progress Summary

**Completed**: 7 items
**In Progress**: 2 items  
**Pending**: 13 items

**Total Issues**: 22

## 🎯 Priority Matrix

### Critical (Complete ASAP)
- SEC-001: Remove hardcoded credentials

### High Priority (Complete Today)
- BUG-001: Network visualization issues
- FEAT-008: Mind Map implementation
- FEAT-009: Statistics page restoration

### Medium Priority (This Week)
- BUG-003: Slideshow start button
- BUG-004: Connections Matrix
- BUG-005: Geographic View
- FEAT-006: Gantt timeline drill-down

### Low Priority (Future)
- BUG-006: Portrait images
- FEAT-005: J.D. Vance events
- TECH-001: GitHub authentication

---

Last Updated: 2025-08-20