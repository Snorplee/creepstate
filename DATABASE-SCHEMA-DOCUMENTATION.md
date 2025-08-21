# Database Schema Documentation
## Creepstate Investigation Platform

**Last Updated:** 2025-08-20  
**Version:** 2.1.4-stable  
**Database Type:** PostgreSQL 15+  

---

## Overview

The Creepstate Investigation Platform utilizes a PostgreSQL database to store and manage comprehensive investigative data including flight logs, timeline events, network relationships, and verification metadata.

## Database Architecture

### Core Principles
- **Data Integrity**: All tables use foreign key constraints and validation rules
- **Scalability**: Designed to handle large datasets with proper indexing
- **Auditability**: Full audit trails for all data modifications
- **Performance**: Optimized queries with materialized views for complex analytics
- **Security**: Role-based access control and data encryption

---

## Table Schemas

### 1. Flight Logs (`flight_logs`)

Primary table for storing aircraft flight records from court documents.

```sql
CREATE TABLE flight_logs (
    id SERIAL PRIMARY KEY,
    flight_number VARCHAR(50) NOT NULL,
    flight_date DATE NOT NULL,
    departure_code VARCHAR(10) NOT NULL,
    departure_name VARCHAR(255),
    arrival_code VARCHAR(10) NOT NULL,
    arrival_name VARCHAR(255),
    aircraft_model VARCHAR(50),
    aircraft_tail_number VARCHAR(20),
    passenger_count INTEGER DEFAULT 0,
    passengers JSONB,
    flight_duration_minutes INTEGER,
    distance_miles INTEGER,
    route_type VARCHAR(20) CHECK (route_type IN ('domestic', 'international', 'island')),
    source_document VARCHAR(255),
    court_case_reference VARCHAR(100),
    verification_status VARCHAR(20) DEFAULT 'pending',
    coordinates GEOMETRY(LINESTRING, 4326),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(100),
    notes TEXT
);

-- Indexes for performance
CREATE INDEX idx_flight_date ON flight_logs(flight_date);
CREATE INDEX idx_departure_code ON flight_logs(departure_code);
CREATE INDEX idx_arrival_code ON flight_logs(arrival_code);
CREATE INDEX idx_passengers_gin ON flight_logs USING GIN(passengers);
CREATE INDEX idx_route_type ON flight_logs(route_type);
CREATE INDEX idx_verification_status ON flight_logs(verification_status);
CREATE INDEX idx_coordinates_gist ON flight_logs USING GIST(coordinates);
```

**Key Fields:**
- `passengers`: JSONB array storing passenger names and metadata
- `coordinates`: PostGIS geometry for flight path visualization
- `verification_status`: Tracks fact-checking status (pending, verified, disputed)
- `source_document`: Links to original court documents

---

### 2. Timeline Events (`timeline_events`)

Comprehensive timeline of all investigation-related events.

```sql
CREATE TABLE timeline_events (
    id SERIAL PRIMARY KEY,
    event_date DATE NOT NULL,
    event_title VARCHAR(500) NOT NULL,
    event_description TEXT,
    event_category VARCHAR(50) NOT NULL,
    evidence_level VARCHAR(20) CHECK (evidence_level IN ('verified', 'probable', 'alleged', 'disputed')),
    source_type VARCHAR(50),
    source_url VARCHAR(1000),
    source_document VARCHAR(255),
    location VARCHAR(255),
    people_involved JSONB,
    organizations_involved JSONB,
    significance_score INTEGER CHECK (significance_score BETWEEN 1 AND 10),
    public_visibility BOOLEAN DEFAULT true,
    verification_status VARCHAR(20) DEFAULT 'pending',
    tags JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(100)
);

-- Indexes
CREATE INDEX idx_event_date ON timeline_events(event_date);
CREATE INDEX idx_event_category ON timeline_events(event_category);
CREATE INDEX idx_evidence_level ON timeline_events(evidence_level);
CREATE INDEX idx_people_gin ON timeline_events USING GIN(people_involved);
CREATE INDEX idx_organizations_gin ON timeline_events USING GIN(organizations_involved);
CREATE INDEX idx_tags_gin ON timeline_events USING GIN(tags);
CREATE INDEX idx_significance_score ON timeline_events(significance_score);
```

**Categories:**
- `legal`: Court filings, arrests, trials
- `deaths`: Unexplained or suspicious deaths
- `business`: Financial transactions, business relationships  
- `meetings`: Documented meetings and interactions
- `media`: Media coverage and revelations
- `investigations`: Law enforcement activities

---

### 3. People Registry (`people`)

Central registry of all individuals mentioned in the investigation.

```sql
CREATE TABLE people (
    id SERIAL PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    common_name VARCHAR(255),
    aliases JSONB,
    birth_date DATE,
    death_date DATE,
    nationality VARCHAR(100),
    occupation VARCHAR(255),
    political_affiliation VARCHAR(100),
    status VARCHAR(50), -- subject, witness, victim, deceased, unknown
    significance_level INTEGER CHECK (significance_level BETWEEN 1 AND 10),
    biography TEXT,
    photo_url VARCHAR(500),
    verification_status VARCHAR(20) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX idx_full_name ON people(full_name);
CREATE INDEX idx_common_name ON people(common_name);
CREATE INDEX idx_aliases_gin ON people USING GIN(aliases);
CREATE INDEX idx_status ON people(status);
CREATE INDEX idx_significance_level ON people(significance_level);

-- Full-text search
CREATE INDEX idx_people_fts ON people USING GIN(
    to_tsvector('english', full_name || ' ' || COALESCE(common_name, '') || ' ' || COALESCE(occupation, ''))
);
```

---

### 4. Organizations Registry (`organizations`)

Registry of companies, institutions, and organizations involved.

```sql
CREATE TABLE organizations (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    organization_type VARCHAR(100), -- corporation, foundation, government, etc.
    headquarters_location VARCHAR(255),
    founded_date DATE,
    dissolved_date DATE,
    industry VARCHAR(100),
    description TEXT,
    parent_organization_id INTEGER REFERENCES organizations(id),
    verification_status VARCHAR(20) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_org_name ON organizations(name);
CREATE INDEX idx_org_type ON organizations(organization_type);
CREATE INDEX idx_org_industry ON organizations(industry);
```

---

### 5. Relationships (`relationships`)

Network connections between people and organizations.

```sql
CREATE TABLE relationships (
    id SERIAL PRIMARY KEY,
    person1_id INTEGER REFERENCES people(id),
    person2_id INTEGER REFERENCES people(id),
    organization_id INTEGER REFERENCES organizations(id),
    relationship_type VARCHAR(100) NOT NULL,
    relationship_description TEXT,
    start_date DATE,
    end_date DATE,
    strength_score INTEGER CHECK (strength_score BETWEEN 1 AND 10),
    evidence_level VARCHAR(20) CHECK (evidence_level IN ('verified', 'probable', 'alleged', 'disputed')),
    source_events JSONB, -- Array of timeline event IDs
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX idx_person1 ON relationships(person1_id);
CREATE INDEX idx_person2 ON relationships(person2_id);
CREATE INDEX idx_organization ON relationships(organization_id);
CREATE INDEX idx_relationship_type ON relationships(relationship_type);
CREATE INDEX idx_strength_score ON relationships(strength_score);
```

**Relationship Types:**
- `business_partner`, `employee`, `board_member`
- `friend`, `associate`, `family`
- `client`, `attorney`, `advisor`
- `co_traveler`, `meeting_attendee`

---

### 6. Airports (`airports`)

Airport information for flight log analysis.

```sql
CREATE TABLE airports (
    id SERIAL PRIMARY KEY,
    airport_code VARCHAR(10) UNIQUE NOT NULL,
    airport_name VARCHAR(255) NOT NULL,
    city VARCHAR(100),
    state_province VARCHAR(100),
    country VARCHAR(100) NOT NULL,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    airport_type VARCHAR(50), -- commercial, private, military
    coordinates GEOMETRY(POINT, 4326),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_airport_code ON airports(airport_code);
CREATE INDEX idx_country ON airports(country);
CREATE INDEX idx_coordinates_airports ON airports USING GIST(coordinates);
```

---

### 7. Documents (`documents`)

Registry of source documents and evidence.

```sql
CREATE TABLE documents (
    id SERIAL PRIMARY KEY,
    document_title VARCHAR(500) NOT NULL,
    document_type VARCHAR(100), -- court_filing, deposition, email, photo
    file_path VARCHAR(500),
    file_url VARCHAR(1000),
    file_hash VARCHAR(128), -- SHA-512 hash for integrity
    file_size_bytes BIGINT,
    document_date DATE,
    source VARCHAR(255),
    court_case VARCHAR(100),
    classification VARCHAR(50), -- public, sealed, redacted
    verification_status VARCHAR(20) DEFAULT 'pending',
    tags JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_document_type ON documents(document_type);
CREATE INDEX idx_document_date ON documents(document_date);
CREATE INDEX idx_classification ON documents(classification);
CREATE INDEX idx_tags_documents ON documents USING GIN(tags);
```

---

### 8. Verification Logs (`verification_logs`)

Audit trail for fact-checking and verification activities.

```sql
CREATE TABLE verification_logs (
    id SERIAL PRIMARY KEY,
    table_name VARCHAR(100) NOT NULL,
    record_id INTEGER NOT NULL,
    verification_type VARCHAR(50), -- fact_check, source_verify, cross_reference
    verification_status VARCHAR(20), -- verified, disputed, pending, rejected
    verification_source VARCHAR(255),
    verification_notes TEXT,
    confidence_score DECIMAL(3,2) CHECK (confidence_score BETWEEN 0.00 AND 1.00),
    verified_by VARCHAR(100),
    verified_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_table_record ON verification_logs(table_name, record_id);
CREATE INDEX idx_verification_status ON verification_logs(verification_status);
CREATE INDEX idx_verified_at ON verification_logs(verified_at);
```

---

## Views and Analytics

### Flight Analytics View
```sql
CREATE VIEW flight_analytics AS
SELECT 
    f.flight_date,
    f.departure_code,
    f.arrival_code,
    f.passenger_count,
    f.distance_miles,
    f.route_type,
    COUNT(*) OVER (PARTITION BY f.departure_code, f.arrival_code) as route_frequency,
    json_array_length(f.passengers) as passenger_list_length,
    CASE 
        WHEN f.passengers::text ILIKE '%trump%' THEN 'trump_flight'
        WHEN f.passengers::text ILIKE '%clinton%' THEN 'clinton_flight'
        WHEN f.passengers::text ILIKE '%prince%' THEN 'royal_flight'
        ELSE 'other_flight'
    END as passenger_category
FROM flight_logs f
WHERE f.verification_status = 'verified';
```

### Timeline Density View
```sql
CREATE VIEW timeline_density AS
SELECT 
    DATE_TRUNC('month', event_date) as month,
    event_category,
    COUNT(*) as event_count,
    AVG(significance_score) as avg_significance
FROM timeline_events
WHERE verification_status = 'verified'
GROUP BY DATE_TRUNC('month', event_date), event_category
ORDER BY month;
```

### Network Analysis View
```sql
CREATE VIEW network_analysis AS
SELECT 
    p1.full_name as person1,
    p2.full_name as person2,
    r.relationship_type,
    r.strength_score,
    COUNT(te.id) as shared_events
FROM relationships r
JOIN people p1 ON r.person1_id = p1.id
JOIN people p2 ON r.person2_id = p2.id
LEFT JOIN timeline_events te ON te.people_involved::text ILIKE '%' || p1.full_name || '%'
    AND te.people_involved::text ILIKE '%' || p2.full_name || '%'
WHERE r.evidence_level IN ('verified', 'probable')
GROUP BY p1.full_name, p2.full_name, r.relationship_type, r.strength_score;
```

---

## Data Sources

### Primary Sources
1. **Court Documents**: Federal court filings, depositions, exhibits
2. **Flight Logs**: FAA records, pilot logs, passenger manifests
3. **Public Records**: Property records, business registrations
4. **News Reports**: Verified news coverage and investigations
5. **Government Documents**: FOIA releases, official statements

### Data Import Processes
1. **KML Flight Data**: Automated parsing from court-provided KML files
2. **Timeline XML**: SIMILE Timeline XML format import
3. **API Integration**: Real-time updates from news sources
4. **Manual Entry**: Verified information from document analysis

---

## Database Maintenance

### Backup Strategy
- **Full Backup**: Daily at 2 AM UTC
- **Incremental Backup**: Every 4 hours
- **Point-in-time Recovery**: 30-day retention
- **Offsite Storage**: Encrypted backups to multiple locations

### Performance Monitoring
- Query performance analysis
- Index usage statistics
- Table size monitoring
- Connection pool optimization

### Data Retention
- **Flight Logs**: Permanent retention
- **Timeline Events**: Permanent retention
- **Verification Logs**: 7-year retention
- **System Logs**: 1-year retention

---

## API Endpoints

### Flight Data API
```
GET /api/flights/search
POST /api/flights/search
GET /api/flights/{id}
GET /api/flights/statistics
```

### Timeline API
```
GET /api/timeline/events
POST /api/timeline/events
GET /api/timeline/events/{id}
GET /api/timeline/categories
```

### Investigation API
```
GET /api/investigation/passenger/{name}
POST /api/investigation/connections
GET /api/investigation/network
```

### Analytics API
```
GET /api/stats/overview
GET /api/stats/flights
GET /api/stats/network
```

---

## Security Considerations

### Access Control
- Role-based access to sensitive data
- API authentication with rate limiting
- Database connection encryption
- Audit logging for all data access

### Data Protection
- PII encryption for sensitive fields
- Secure document storage
- Regular security audits
- GDPR compliance for EU users

### Backup Security
- Encrypted backup files
- Secure transmission protocols
- Access logging for backup systems
- Regular restoration testing

---

## Future Enhancements

### Planned Features
1. **Graph Database Integration**: Neo4j for complex network analysis
2. **Document OCR**: Automated text extraction from images
3. **AI Analysis**: Pattern recognition and anomaly detection
4. **Real-time Collaboration**: Multi-user editing capabilities
5. **Mobile Synchronization**: Offline-capable mobile access

### Scalability Considerations
- Database sharding for large datasets
- Read replica implementation
- Caching layer optimization
- CDN integration for static assets

---

This documentation provides comprehensive coverage of the database architecture supporting the Creepstate Investigation Platform. Regular updates ensure accuracy as the platform evolves.