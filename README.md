# 🕵️ Creepstate Investigation Platform Investigation Platform

**Comprehensive Investigation Suite for Justice and Truth**

A complete timeline and analysis platform documenting the Trump-Epstein network with 78+ events, flight log analysis, real-time news monitoring, interactive visualizations, and comprehensive investigative tools.

[![Version](https://img.shields.io/badge/version-2.1.4--stable-blue.svg)](./version.js)
[![Docker](https://img.shields.io/badge/docker-ready-green.svg)](./Dockerfile)
[![License](https://img.shields.io/badge/license-Public%20Domain-green.svg)](./LICENSE)
[![Issues](https://img.shields.io/github/issues/snorplee/creepstate.svg)](https://github.com/Snorplee/creepstate/issues)

---

## 🎯 Core Features

### 📅 Interactive Timeline
- **78+ documented events** from 1987-2037 with comprehensive sourcing
- **Multiple evidence levels**: Verified, probable, alleged, disputed
- **Advanced filtering** by category, date range, and significance
- **SIMILE Timeline integration** with smooth navigation
- **Real-time updates** from verified news sources

### 🛩️ Flight Log Analysis  
- **Interactive Google Maps** with KML flight data visualization
- **Comprehensive passenger analysis** with connection tracking
- **78+ documented flights** from court records
- **Route analysis tools** (domestic, international, island)
- **Investigation dashboard** with quick lookup capabilities

### 🌐 Network Visualizations
- **Interactive network graphs** showing all known connections
- **152+ associates** with evidence-based relationships
- **Force-directed visualizations** with D3.js
- **Montana's Jeffrey Epstein Timeline** data integration
- **Connection strength analysis** and relationship mapping

### 📰 Real-Time News Monitoring
- **Automated fact-checking** from multiple sources
- **Reddit monitoring** (r/politics, r/news, r/Epstein)
- **Breaking news detection** with verification pipeline
- **Source reliability scoring** and multi-source validation
- **Automated timeline updates** with verified information

### 📊 Comprehensive Analytics
- **Statistical dashboards** with deaths, victims, convictions
- **Flight pattern analysis** with frequency mapping
- **Network centrality metrics** and influence tracking
- **Timeline density analysis** and significance scoring
- **Export capabilities** for research and investigation

### 🆘 Victim Resources
- **Crisis support links** and emergency contacts
- **Legal aid resources** and advocacy organizations
- **International assistance** with multilingual support
- **Anonymous reporting systems** and protection protocols
- **Trauma-informed resource design** with safety considerations

---

## 🚀 Quick Start

### 🔒 Secure Local Deployment (Recommended)

```bash
# Clone the repository
git clone https://github.com/Snorplee/creepstate.git
cd creepstate

# Production deployment (port 8847)
./run-local.sh          # Linux/Mac
run-local.bat          # Windows

# Development server (port 8845)  
./run-dev.sh           # Linux/Mac only

# Access at:
# Production: http://localhost:8847
# Development: http://localhost:8845
```

### 🐳 Docker Container Deployment

```bash
# Build the container
docker build -t creepstate .

# Run production server
docker run -d --name creepstate -p 8847:80 creepstate

# Run with auto-updates (requires fact-checking system)
docker run -d --name creepstate \
  -p 8847:80 \
  -v $(pwd)/scripts:/scripts \
  creepstate

# Access at: http://localhost:8847
```

### 🌐 Anonymous Access Options

```bash
# IPFS deployment (decentralized)
ipfs add -r . --pin=true

# Tor onion service (privacy-focused)
./scripts/setup-tor-service.sh

# VPN-recommended access for sensitive research
```

---

## 📋 Platform Navigation

### Main Sections
- **🏠 [Home](index.html)**: Interactive timeline with all events
- **🛩️ [Flight Logs](flight-logs.html)**: Interactive flight analysis with Google Maps
- **🌐 [Networks](enhanced-visualizations.html)**: Connection graphs and relationship mapping
- **📊 [Statistics](stats.html)**: Comprehensive analytics and metrics
- **🎬 [Slideshow](slideshow-timeline.html)**: Professional presentation mode
- **🆘 [Resources](resources.html)**: Victim support and legal assistance
- **👥 [Directory](names-and-shame.html)**: Complete network participant listing

### Investigation Tools
- **🔍 Passenger Investigation**: Detailed flight analysis by individual
- **🔗 Connection Analysis**: Relationship strength and shared activities
- **📈 Pattern Recognition**: Timeline correlations and trend analysis
- **📋 Export Systems**: Research data in multiple formats
- **⚡ Quick Investigations**: Pre-configured searches for key figures

---

## 🛠️ Technical Architecture

### Frontend Technologies
- **HTML5/CSS3/JavaScript**: Modern responsive design
- **SIMILE Timeline**: Interactive timeline visualization
- **Google Maps API**: Flight path mapping and geographic analysis
- **D3.js**: Network graphs and data visualizations
- **Leaflet.js**: Fallback mapping system
- **Chart.js**: Statistical charts and analytics

### Backend Infrastructure
- **PostgreSQL**: Comprehensive database with full schema
- **Python**: Fact-checking and automation systems
- **Docker**: Containerized deployment
- **Nginx**: High-performance web server
- **REST API**: Comprehensive endpoint system

### Data Management
- **KML Flight Data**: Court-sourced flight information
- **XML Timeline**: SIMILE-compatible event data
- **JSON APIs**: Real-time data integration
- **PostgreSQL Schema**: Normalized relational database
- **Automated Backups**: Encrypted multi-location storage

### Security & Privacy
- **Source Protection**: Anonymous submission systems
- **Data Encryption**: End-to-end protection protocols
- **Access Logging**: Comprehensive audit trails
- **Tor Integration**: Privacy-focused access options
- **VPN Compatibility**: Enhanced anonymity support

---

## 📊 Data Categories & Evidence Levels

### Event Categories
- **🔴 Events**: Key factual occurrences and meetings
- **🔵 Legal**: Court proceedings, arrests, and legal actions  
- **🟢 Reports**: Media coverage and public statements
- **🟡 Deaths**: Suspicious and unexplained deaths
- **🟣 Business**: Financial transactions and partnerships

### Evidence Classification
- **✅ Verified**: Multiple reliable sources with documentation
- **🟡 Probable**: Strong evidence with minor verification gaps
- **🔶 Alleged**: Claims requiring additional verification
- **❌ Disputed**: Contradictory information or debunked claims

### Flight Data Sources
- **Court Documents**: Federal litigation exhibits
- **FAA Records**: Official flight tracking data
- **Pilot Logs**: Aircraft operation records
- **Passenger Manifests**: Official travel documentation
- **KML Files**: Geographic flight path data

---

## 🔄 Automated Systems

### Fact-Checking Pipeline
- **Multi-source verification** from RSS feeds (NPR, CNN, NBC, CBC)
- **Reddit monitoring** for breaking developments
- **Court filing detection** and legal document tracking
- **Reliability scoring** with confidence metrics
- **Automated timeline updates** with verified information

### Container Auto-Update System
- **Daily verification cycles** with backup procedures
- **Breaking news integration** with source validation
- **Version control** with semantic versioning
- **Health monitoring** and performance optimization
- **Rollback capabilities** for failed updates

### Monitoring & Alerting
- **Real-time news detection** from multiple sources
- **Performance monitoring** with uptime tracking
- **Security audit logging** with intrusion detection
- **Resource usage optimization** and scaling automation
- **Backup verification** and disaster recovery testing

---

## 🎯 Investigation Use Cases

### Researchers & Journalists
- **Comprehensive timeline analysis** with source verification
- **Network relationship mapping** with evidence levels
- **Flight pattern investigation** with passenger tracking
- **Document cross-referencing** and citation management
- **Export capabilities** for publication and analysis

### Legal Professionals
- **Evidence organization** with court document integration
- **Timeline correlation** for case preparation
- **Witness identification** and connection analysis
- **Fact verification** with multiple source validation
- **Deposition preparation** with comprehensive background data

### Advocacy Organizations
- **Victim resource coordination** with crisis support
- **Pattern documentation** for systemic analysis
- **Public awareness tools** with presentation capabilities
- **Policy research support** with statistical analysis
- **Educational resources** for training and awareness

### General Public
- **Educational access** to verified information
- **Awareness building** through interactive exploration
- **Fact-checking tools** for information validation
- **Anonymous access** for safety and privacy
- **Mobile-optimized** experience for accessibility

---

## 🛡️ Privacy & Security

### User Protection
- **No tracking or analytics** for user privacy
- **Anonymous access options** via Tor and VPN
- **Local deployment capability** for maximum security
- **Encrypted communications** and secure protocols
- **Source protection measures** for whistleblowers

### Data Integrity
- **Multi-source verification** before publication
- **Audit trails** for all data modifications
- **Version control** with change tracking
- **Backup encryption** and secure storage
- **Regular security audits** and vulnerability assessment

### Legal Compliance
- **Fair use documentation** for all content
- **Source attribution** and citation standards
- **GDPR compliance** for international users
- **First Amendment protections** for investigative journalism
- **Responsible disclosure** policies for sensitive information

---

## 📚 Documentation

### User Guides
- **[Investigation Guide](INVESTIGATION-GUIDE.md)**: Research methodologies and best practices
- **[API Documentation](API-DOCUMENTATION.md)**: Complete endpoint reference
- **[Database Schema](DATABASE-SCHEMA-DOCUMENTATION.md)**: Comprehensive data structure
- **[Deployment Guide](DEPLOYMENT-GUIDE.md)**: Installation and configuration
- **[Security Protocols](SECURITY-GUIDE.md)**: Safety and privacy measures

### Development Resources
- **[Contributing Guidelines](CONTRIBUTING.md)**: How to contribute safely
- **[Issue Templates](/.github/ISSUE_TEMPLATE/)**: Bug reports and feature requests
- **[Development Setup](DEVELOPMENT.md)**: Local development environment
- **[Testing Procedures](TESTING.md)**: Quality assurance protocols
- **[Release Process](RELEASES.md)**: Version management and deployment

---

## 🤝 Contributing

### How to Contribute Safely
1. **Anonymous contributions** via secure channels
2. **Source verification** with multiple references
3. **Evidence-based submissions** with documentation
4. **Privacy protection** for all contributors
5. **Legal review** before sensitive information publication

### Contribution Types
- **📊 Data verification** and fact-checking
- **🔍 Source investigation** and document analysis
- **💻 Technical development** and feature enhancement
- **📝 Documentation** and resource creation
- **🌐 Translation** and internationalization

### Security Guidelines
- **Use VPN/Tor** for all research activities
- **Encrypt communications** and file transfers
- **Verify sources** through multiple channels
- **Protect identities** of sources and contributors
- **Follow legal guidelines** for information handling

---

## 📈 Recent Updates

### Version 2.1.4-stable (2025-08-20)
- ✅ **Google Maps flight visualization** with KML integration
- ✅ **Real-time news monitoring** from Reddit and news sources
- ✅ **Automated fact-checking** with multi-source verification
- ✅ **Container auto-update system** with backup procedures
- ✅ **Enhanced PostgreSQL schema** with comprehensive analytics
- ✅ **GitHub issues tracking** for development management
- ✅ **Breaking news detection** for Trump grand jury developments

### Recent Investigations
- **Trump grand jury records**: Third attempt blocked by federal judges
- **Court filing monitoring**: Automated detection of new legal documents
- **Flight pattern analysis**: Enhanced passenger connection tracking
- **Network updates**: 152+ associates with verified relationships
- **Timeline expansion**: Events through 2030 with future projections

---

## 🆘 Support & Resources

### Crisis Support
- **National Human Trafficking Hotline**: 1-888-373-7888
- **RAINN Sexual Assault Hotline**: 1-800-656-4673
- **Crisis Text Line**: Text HOME to 741741
- **International Resources**: Available in multiple languages

### Legal Assistance
- **Legal Aid Society**: Free legal representation
- **ACLU**: Civil liberties protection and advocacy
- **Victim Rights Organizations**: Specialized legal support
- **International Legal Aid**: Cross-border assistance

### Research Support
- **Investigative Journalism Resources**: Professional tools and training
- **Academic Research Ethics**: Guidelines for sensitive investigations
- **Source Protection**: Best practices for whistleblower safety
- **Digital Security**: Secure research methodologies

---

## 📞 Contact & Support

### Secure Communications
- **GitHub Issues**: Public discussion and feature requests
- **Signal**: Encrypted messaging (contact for details)
- **ProtonMail**: Secure email communications
- **Tor Contact Form**: Anonymous feedback and tips

### Community Resources
- **Reddit**: r/Epstein for community discussion
- **Discord**: Secure community channels (invitation only)
- **Matrix**: Decentralized communication network
- **IRC**: Traditional secure chat channels

---

## ⚖️ Legal Notice

This platform is designed for educational, research, and public interest purposes. All information is sourced from public documents, court filings, and verified news reports. The platform operates under First Amendment protections for investigative journalism and public interest research.

**Sources include**: Federal court documents, FAA flight records, verified news reports, and public records. All content is protected under fair use provisions for educational and journalistic purposes.

**For victims and survivors**: This platform is designed to support justice and accountability. If you need immediate assistance, please contact the crisis resources listed above.

---

**⭐ Star this repository to support investigative journalism and justice efforts**

**🔒 Remember to use VPN/Tor for sensitive research activities**

**📱 Mobile-optimized for secure access on any device**

---

*Last updated: 2025-08-20 | Version: 2.1.4-stable | Build: production*# GitHub Pages Status Update
