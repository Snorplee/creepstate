-- Trumpstein Flight Logs Database Schema
-- Comprehensive PostgreSQL schema for investigative analysis

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create database user roles
CREATE ROLE flight_admin WITH LOGIN PASSWORD 'secure_admin_pass_2024!';
CREATE ROLE flight_reader WITH LOGIN PASSWORD 'secure_reader_pass_2024!';
CREATE ROLE flight_analyst WITH LOGIN PASSWORD 'secure_analyst_pass_2024!';

-- Create database
CREATE DATABASE trumpstein_flights_db
    OWNER flight_admin
    ENCODING 'UTF8'
    LC_COLLATE = 'en_US.utf8'
    LC_CTYPE = 'en_US.utf8';

\c trumpstein_flights_db;

-- Create schemas for organization
CREATE SCHEMA flight_data;
CREATE SCHEMA investigation;
CREATE SCHEMA security_audit;

-- Grant permissions
GRANT USAGE ON SCHEMA flight_data TO flight_reader, flight_analyst;
GRANT USAGE ON SCHEMA investigation TO flight_analyst;
GRANT USAGE ON SCHEMA security_audit TO flight_admin;

-- =============================================
-- FLIGHT DATA CORE TABLES
-- =============================================

-- Aircraft table
CREATE TABLE flight_data.aircraft (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tail_number VARCHAR(20) NOT NULL UNIQUE,
    model VARCHAR(100),
    manufacturer VARCHAR(100),
    owner_entity VARCHAR(255),
    registration_date DATE,
    aircraft_type VARCHAR(50), -- 'jet', 'helicopter', 'turboprop'
    max_passengers INTEGER,
    registration_country CHAR(2),
    status VARCHAR(20) DEFAULT 'active', -- 'active', 'decommissioned', 'sold'
    notes TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Locations/Airports table
CREATE TABLE flight_data.locations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    airport_code VARCHAR(10) NOT NULL UNIQUE,
    airport_name VARCHAR(255),
    city VARCHAR(100),
    state_province VARCHAR(100),
    country CHAR(2),
    coordinates POINT, -- PostGIS coordinates
    elevation_ft INTEGER,
    facility_type VARCHAR(50), -- 'commercial', 'private', 'military', 'helipad'
    security_level VARCHAR(20) DEFAULT 'standard', -- 'standard', 'high', 'restricted'
    timezone VARCHAR(50),
    is_international BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Passengers master table
CREATE TABLE flight_data.passengers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    full_name VARCHAR(255) NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    passenger_type VARCHAR(50) DEFAULT 'regular', -- 'vip', 'staff', 'crew', 'guest', 'victim', 'suspect'
    verified_identity BOOLEAN DEFAULT FALSE,
    risk_level VARCHAR(20) DEFAULT 'unknown', -- 'low', 'medium', 'high', 'critical'
    date_of_birth DATE,
    nationality VARCHAR(100),
    occupation VARCHAR(255),
    organization VARCHAR(255),
    investigation_status VARCHAR(50) DEFAULT 'none', -- 'none', 'person_of_interest', 'investigated', 'cleared'
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Passenger aliases table
CREATE TABLE flight_data.passenger_aliases (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    passenger_id UUID REFERENCES flight_data.passengers(id) ON DELETE CASCADE,
    alias VARCHAR(255) NOT NULL,
    alias_type VARCHAR(50), -- 'nickname', 'maiden_name', 'pseudonym', 'initials'
    confidence_level INTEGER CHECK (confidence_level >= 1 AND confidence_level <= 10),
    source VARCHAR(255),
    verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Flights main table
CREATE TABLE flight_data.flights (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    flight_number VARCHAR(20),
    aircraft_id UUID REFERENCES flight_data.aircraft(id),
    departure_location_id UUID REFERENCES flight_data.locations(id),
    arrival_location_id UUID REFERENCES flight_data.locations(id),
    flight_date DATE NOT NULL,
    departure_time TIME,
    arrival_time TIME,
    flight_duration INTERVAL,
    manifest_id VARCHAR(50), -- Reference to source manifest
    pilot_name VARCHAR(255),
    co_pilot_name VARCHAR(255),
    crew_count INTEGER DEFAULT 0,
    passenger_count INTEGER DEFAULT 0,
    flight_purpose VARCHAR(100), -- 'business', 'personal', 'transport', 'unknown'
    source_document VARCHAR(255), -- Source file/document reference
    data_quality VARCHAR(20) DEFAULT 'standard', -- 'high', 'standard', 'low', 'questionable'
    verification_status VARCHAR(50) DEFAULT 'unverified', -- 'verified', 'cross_referenced', 'disputed'
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Flight passengers junction table (many-to-many)
CREATE TABLE flight_data.flight_passengers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    flight_id UUID REFERENCES flight_data.flights(id) ON DELETE CASCADE,
    passenger_id UUID REFERENCES flight_data.passengers(id),
    boarding_location_id UUID REFERENCES flight_data.locations(id),
    disembarking_location_id UUID REFERENCES flight_data.locations(id),
    passenger_role VARCHAR(50) DEFAULT 'passenger', -- 'passenger', 'crew', 'pilot', 'guest', 'staff'
    seat_assignment VARCHAR(10),
    special_notes TEXT,
    name_in_manifest VARCHAR(255), -- Exact name as it appeared in source
    created_at TIMESTAMP DEFAULT NOW()
);

-- =============================================
-- INVESTIGATION TABLES
-- =============================================

-- Connections/Relationships between passengers
CREATE TABLE investigation.passenger_connections (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    passenger1_id UUID REFERENCES flight_data.passengers(id),
    passenger2_id UUID REFERENCES flight_data.passengers(id),
    connection_type VARCHAR(100), -- 'business_associate', 'friend', 'family', 'romantic', 'professional'
    connection_strength INTEGER CHECK (connection_strength >= 1 AND connection_strength <= 10),
    shared_flights_count INTEGER DEFAULT 0,
    first_documented_interaction DATE,
    last_documented_interaction DATE,
    relationship_status VARCHAR(50) DEFAULT 'active', -- 'active', 'ended', 'unknown'
    evidence_sources TEXT[], -- Array of evidence sources
    investigation_notes TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    CONSTRAINT no_self_connection CHECK (passenger1_id != passenger2_id)
);

-- Timeline events for cross-referencing
CREATE TABLE investigation.timeline_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_date DATE NOT NULL,
    event_title VARCHAR(500) NOT NULL,
    event_description TEXT,
    event_type VARCHAR(100), -- 'legal', 'business', 'personal', 'investigation', 'media'
    location VARCHAR(255),
    participants UUID[], -- Array of passenger IDs involved
    related_flights UUID[], -- Array of flight IDs related to this event
    significance_level INTEGER CHECK (significance_level >= 1 AND significance_level <= 10),
    source_links TEXT[],
    verification_status VARCHAR(50) DEFAULT 'unverified',
    tags VARCHAR(100)[],
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Investigation cases
CREATE TABLE investigation.cases (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    case_name VARCHAR(255) NOT NULL,
    case_description TEXT,
    case_status VARCHAR(50) DEFAULT 'open', -- 'open', 'closed', 'ongoing', 'archived'
    priority_level VARCHAR(20) DEFAULT 'medium', -- 'low', 'medium', 'high', 'critical'
    lead_investigator VARCHAR(255),
    date_opened DATE DEFAULT CURRENT_DATE,
    date_closed DATE,
    related_passengers UUID[],
    related_flights UUID[],
    case_notes TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Flight patterns analysis
CREATE TABLE investigation.flight_patterns (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    pattern_name VARCHAR(255) NOT NULL,
    pattern_type VARCHAR(100), -- 'frequent_route', 'suspicious_timing', 'group_travel', 'location_clustering'
    description TEXT,
    involved_flights UUID[],
    involved_passengers UUID[],
    frequency_count INTEGER,
    date_range_start DATE,
    date_range_end DATE,
    risk_assessment VARCHAR(20) DEFAULT 'low', -- 'low', 'medium', 'high', 'critical'
    analysis_notes TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- =============================================
-- SECURITY AND AUDIT TABLES
-- =============================================

-- Audit log for all data changes
CREATE TABLE security_audit.audit_log (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    table_name VARCHAR(100) NOT NULL,
    operation VARCHAR(20) NOT NULL, -- 'INSERT', 'UPDATE', 'DELETE'
    record_id UUID,
    old_values JSONB,
    new_values JSONB,
    user_id VARCHAR(100),
    session_id VARCHAR(255),
    ip_address INET,
    user_agent TEXT,
    timestamp TIMESTAMP DEFAULT NOW()
);

-- Access control log
CREATE TABLE security_audit.access_log (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id VARCHAR(100) NOT NULL,
    action VARCHAR(100) NOT NULL,
    resource_type VARCHAR(100),
    resource_id UUID,
    ip_address INET,
    user_agent TEXT,
    success BOOLEAN DEFAULT TRUE,
    error_message TEXT,
    timestamp TIMESTAMP DEFAULT NOW()
);

-- Data export log
CREATE TABLE security_audit.export_log (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id VARCHAR(100) NOT NULL,
    export_type VARCHAR(100), -- 'csv', 'json', 'pdf', 'excel'
    exported_tables VARCHAR(100)[],
    record_count INTEGER,
    filter_criteria JSONB,
    export_purpose TEXT,
    ip_address INET,
    timestamp TIMESTAMP DEFAULT NOW()
);

-- =============================================
-- INDEXES FOR PERFORMANCE
-- =============================================

-- Flight data indexes
CREATE INDEX idx_flights_date ON flight_data.flights(flight_date);
CREATE INDEX idx_flights_aircraft ON flight_data.flights(aircraft_id);
CREATE INDEX idx_flights_departure ON flight_data.flights(departure_location_id);
CREATE INDEX idx_flights_arrival ON flight_data.flights(arrival_location_id);
CREATE INDEX idx_flights_date_range ON flight_data.flights(flight_date, departure_location_id, arrival_location_id);

-- Passenger indexes
CREATE INDEX idx_passengers_name ON flight_data.passengers(full_name);
CREATE INDEX idx_passengers_type ON flight_data.passengers(passenger_type);
CREATE INDEX idx_passengers_risk ON flight_data.passengers(risk_level);
CREATE INDEX idx_passengers_name_search ON flight_data.passengers USING gin(to_tsvector('english', full_name));

-- Flight passengers indexes
CREATE INDEX idx_flight_passengers_flight ON flight_data.flight_passengers(flight_id);
CREATE INDEX idx_flight_passengers_passenger ON flight_data.flight_passengers(passenger_id);
CREATE INDEX idx_flight_passengers_combined ON flight_data.flight_passengers(flight_id, passenger_id);

-- Alias indexes
CREATE INDEX idx_aliases_passenger ON flight_data.passenger_aliases(passenger_id);
CREATE INDEX idx_aliases_name ON flight_data.passenger_aliases USING gin(to_tsvector('english', alias));

-- Location indexes
CREATE INDEX idx_locations_code ON flight_data.locations(airport_code);
CREATE INDEX idx_locations_country ON flight_data.locations(country);
CREATE INDEX idx_locations_type ON flight_data.locations(facility_type);

-- Investigation indexes
CREATE INDEX idx_connections_passenger1 ON investigation.passenger_connections(passenger1_id);
CREATE INDEX idx_connections_passenger2 ON investigation.passenger_connections(passenger2_id);
CREATE INDEX idx_connections_strength ON investigation.passenger_connections(connection_strength);
CREATE INDEX idx_timeline_date ON investigation.timeline_events(event_date);
CREATE INDEX idx_timeline_participants ON investigation.timeline_events USING gin(participants);

-- Audit indexes
CREATE INDEX idx_audit_table ON security_audit.audit_log(table_name);
CREATE INDEX idx_audit_timestamp ON security_audit.audit_log(timestamp);
CREATE INDEX idx_access_user ON security_audit.access_log(user_id);
CREATE INDEX idx_access_timestamp ON security_audit.access_log(timestamp);

-- =============================================
-- VIEWS FOR COMMON QUERIES
-- =============================================

-- Complete flight information view
CREATE VIEW investigation.flight_details AS
SELECT 
    f.id,
    f.flight_number,
    f.flight_date,
    f.departure_time,
    f.arrival_time,
    f.flight_duration,
    a.tail_number,
    a.model as aircraft_model,
    dl.airport_code as departure_code,
    dl.airport_name as departure_name,
    dl.city as departure_city,
    dl.country as departure_country,
    al.airport_code as arrival_code,
    al.airport_name as arrival_name,
    al.city as arrival_city,
    al.country as arrival_country,
    f.passenger_count,
    f.crew_count,
    f.flight_purpose,
    f.data_quality,
    f.verification_status
FROM flight_data.flights f
LEFT JOIN flight_data.aircraft a ON f.aircraft_id = a.id
LEFT JOIN flight_data.locations dl ON f.departure_location_id = dl.id
LEFT JOIN flight_data.locations al ON f.arrival_location_id = al.id;

-- Passenger flight history view
CREATE VIEW investigation.passenger_flight_history AS
SELECT 
    p.id as passenger_id,
    p.full_name,
    p.passenger_type,
    p.risk_level,
    fp.flight_id,
    f.flight_date,
    f.flight_number,
    dl.airport_code as departure_code,
    al.airport_code as arrival_code,
    fp.passenger_role,
    fp.name_in_manifest
FROM flight_data.passengers p
JOIN flight_data.flight_passengers fp ON p.id = fp.passenger_id
JOIN flight_data.flights f ON fp.flight_id = f.id
LEFT JOIN flight_data.locations dl ON f.departure_location_id = dl.id
LEFT JOIN flight_data.locations al ON f.arrival_location_id = al.id
ORDER BY p.full_name, f.flight_date;

-- Frequent route analysis view
CREATE VIEW investigation.route_frequency AS
SELECT 
    dl.airport_code as departure_code,
    al.airport_code as arrival_code,
    dl.city || ', ' || dl.country as departure_location,
    al.city || ', ' || al.country as arrival_location,
    COUNT(*) as flight_count,
    MIN(f.flight_date) as first_flight,
    MAX(f.flight_date) as last_flight,
    array_agg(DISTINCT a.tail_number) as aircraft_used
FROM flight_data.flights f
JOIN flight_data.locations dl ON f.departure_location_id = dl.id
JOIN flight_data.locations al ON f.arrival_location_id = al.id
LEFT JOIN flight_data.aircraft a ON f.aircraft_id = a.id
GROUP BY dl.airport_code, al.airport_code, dl.city, dl.country, al.city, al.country
ORDER BY flight_count DESC;

-- Passenger co-travel analysis view
CREATE VIEW investigation.passenger_cotravel AS
SELECT 
    p1.full_name as passenger1,
    p2.full_name as passenger2,
    COUNT(*) as shared_flights,
    MIN(f.flight_date) as first_shared_flight,
    MAX(f.flight_date) as last_shared_flight,
    array_agg(DISTINCT f.flight_number ORDER BY f.flight_date) as flight_numbers
FROM flight_data.flight_passengers fp1
JOIN flight_data.flight_passengers fp2 ON fp1.flight_id = fp2.flight_id AND fp1.passenger_id != fp2.passenger_id
JOIN flight_data.passengers p1 ON fp1.passenger_id = p1.id
JOIN flight_data.passengers p2 ON fp2.passenger_id = p2.id
JOIN flight_data.flights f ON fp1.flight_id = f.id
GROUP BY p1.id, p1.full_name, p2.id, p2.full_name
HAVING COUNT(*) > 1
ORDER BY shared_flights DESC, p1.full_name, p2.full_name;

-- =============================================
-- TRIGGERS FOR AUDIT LOGGING
-- =============================================

-- Function to log data changes
CREATE OR REPLACE FUNCTION security_audit.log_data_changes() RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'DELETE' THEN
        INSERT INTO security_audit.audit_log (table_name, operation, record_id, old_values, user_id, session_id)
        VALUES (TG_TABLE_NAME, TG_OP, OLD.id, row_to_json(OLD), current_setting('app.current_user_id', true), current_setting('app.session_id', true));
        RETURN OLD;
    ELSIF TG_OP = 'UPDATE' THEN
        INSERT INTO security_audit.audit_log (table_name, operation, record_id, old_values, new_values, user_id, session_id)
        VALUES (TG_TABLE_NAME, TG_OP, NEW.id, row_to_json(OLD), row_to_json(NEW), current_setting('app.current_user_id', true), current_setting('app.session_id', true));
        RETURN NEW;
    ELSIF TG_OP = 'INSERT' THEN
        INSERT INTO security_audit.audit_log (table_name, operation, record_id, new_values, user_id, session_id)
        VALUES (TG_TABLE_NAME, TG_OP, NEW.id, row_to_json(NEW), current_setting('app.current_user_id', true), current_setting('app.session_id', true));
        RETURN NEW;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create audit triggers for all main tables
CREATE TRIGGER audit_flights AFTER INSERT OR UPDATE OR DELETE ON flight_data.flights
    FOR EACH ROW EXECUTE FUNCTION security_audit.log_data_changes();

CREATE TRIGGER audit_passengers AFTER INSERT OR UPDATE OR DELETE ON flight_data.passengers
    FOR EACH ROW EXECUTE FUNCTION security_audit.log_data_changes();

CREATE TRIGGER audit_flight_passengers AFTER INSERT OR UPDATE OR DELETE ON flight_data.flight_passengers
    FOR EACH ROW EXECUTE FUNCTION security_audit.log_data_changes();

CREATE TRIGGER audit_connections AFTER INSERT OR UPDATE OR DELETE ON investigation.passenger_connections
    FOR EACH ROW EXECUTE FUNCTION security_audit.log_data_changes();

-- =============================================
-- FUNCTIONS FOR INVESTIGATION QUERIES
-- =============================================

-- Function to find all flights between two passengers
CREATE OR REPLACE FUNCTION investigation.find_shared_flights(
    passenger1_name VARCHAR,
    passenger2_name VARCHAR
) RETURNS TABLE (
    flight_id UUID,
    flight_number VARCHAR,
    flight_date DATE,
    departure_code VARCHAR,
    arrival_code VARCHAR,
    other_passengers TEXT[]
) AS $$
BEGIN
    RETURN QUERY
    SELECT DISTINCT
        f.id as flight_id,
        f.flight_number,
        f.flight_date,
        dl.airport_code as departure_code,
        al.airport_code as arrival_code,
        array_agg(DISTINCT p.full_name) FILTER (WHERE p.full_name NOT IN (passenger1_name, passenger2_name)) as other_passengers
    FROM flight_data.flights f
    JOIN flight_data.flight_passengers fp1 ON f.id = fp1.flight_id
    JOIN flight_data.flight_passengers fp2 ON f.id = fp2.flight_id
    JOIN flight_data.passengers p1 ON fp1.passenger_id = p1.id
    JOIN flight_data.passengers p2 ON fp2.passenger_id = p2.id
    JOIN flight_data.flight_passengers fp ON f.id = fp.flight_id
    JOIN flight_data.passengers p ON fp.passenger_id = p.id
    LEFT JOIN flight_data.locations dl ON f.departure_location_id = dl.id
    LEFT JOIN flight_data.locations al ON f.arrival_location_id = al.id
    WHERE p1.full_name ILIKE '%' || passenger1_name || '%'
      AND p2.full_name ILIKE '%' || passenger2_name || '%'
      AND fp1.passenger_id != fp2.passenger_id
    GROUP BY f.id, f.flight_number, f.flight_date, dl.airport_code, al.airport_code
    ORDER BY f.flight_date;
END;
$$ LANGUAGE plpgsql;

-- Function to analyze passenger travel patterns
CREATE OR REPLACE FUNCTION investigation.analyze_travel_pattern(
    passenger_name VARCHAR,
    date_from DATE DEFAULT NULL,
    date_to DATE DEFAULT NULL
) RETURNS TABLE (
    total_flights BIGINT,
    unique_destinations BIGINT,
    most_frequent_departure VARCHAR,
    most_frequent_arrival VARCHAR,
    travel_frequency_per_month NUMERIC,
    frequent_companions TEXT[]
) AS $$
DECLARE
    date_range_months NUMERIC;
BEGIN
    -- Calculate date range if not provided
    IF date_from IS NULL THEN
        SELECT MIN(f.flight_date) INTO date_from
        FROM flight_data.flights f
        JOIN flight_data.flight_passengers fp ON f.id = fp.flight_id
        JOIN flight_data.passengers p ON fp.passenger_id = p.id
        WHERE p.full_name ILIKE '%' || passenger_name || '%';
    END IF;
    
    IF date_to IS NULL THEN
        SELECT MAX(f.flight_date) INTO date_to
        FROM flight_data.flights f
        JOIN flight_data.flight_passengers fp ON f.id = fp.flight_id
        JOIN flight_data.passengers p ON fp.passenger_id = p.id
        WHERE p.full_name ILIKE '%' || passenger_name || '%';
    END IF;
    
    date_range_months := EXTRACT(EPOCH FROM (date_to - date_from)) / (30.44 * 24 * 3600);
    
    RETURN QUERY
    WITH passenger_flights AS (
        SELECT f.*, dl.airport_code as dep_code, al.airport_code as arr_code
        FROM flight_data.flights f
        JOIN flight_data.flight_passengers fp ON f.id = fp.flight_id
        JOIN flight_data.passengers p ON fp.passenger_id = p.id
        LEFT JOIN flight_data.locations dl ON f.departure_location_id = dl.id
        LEFT JOIN flight_data.locations al ON f.arrival_location_id = al.id
        WHERE p.full_name ILIKE '%' || passenger_name || '%'
          AND f.flight_date BETWEEN date_from AND date_to
    ),
    departure_freq AS (
        SELECT dep_code, COUNT(*) as freq
        FROM passenger_flights
        WHERE dep_code IS NOT NULL
        GROUP BY dep_code
        ORDER BY freq DESC
        LIMIT 1
    ),
    arrival_freq AS (
        SELECT arr_code, COUNT(*) as freq
        FROM passenger_flights
        WHERE arr_code IS NOT NULL
        GROUP BY arr_code
        ORDER BY freq DESC
        LIMIT 1
    ),
    companions AS (
        SELECT p2.full_name, COUNT(*) as travel_count
        FROM passenger_flights pf
        JOIN flight_data.flight_passengers fp2 ON pf.id = fp2.flight_id
        JOIN flight_data.passengers p2 ON fp2.passenger_id = p2.id
        WHERE p2.full_name NOT ILIKE '%' || passenger_name || '%'
        GROUP BY p2.full_name
        HAVING COUNT(*) > 2
        ORDER BY travel_count DESC
        LIMIT 10
    )
    SELECT 
        (SELECT COUNT(*) FROM passenger_flights) as total_flights,
        (SELECT COUNT(DISTINCT arr_code) FROM passenger_flights WHERE arr_code IS NOT NULL) as unique_destinations,
        (SELECT dep_code FROM departure_freq) as most_frequent_departure,
        (SELECT arr_code FROM arrival_freq) as most_frequent_arrival,
        CASE 
            WHEN date_range_months > 0 THEN (SELECT COUNT(*) FROM passenger_flights)::NUMERIC / date_range_months
            ELSE 0
        END as travel_frequency_per_month,
        (SELECT array_agg(full_name) FROM companions) as frequent_companions;
END;
$$ LANGUAGE plpgsql;

-- =============================================
-- SECURITY FUNCTIONS
-- =============================================

-- Function to sanitize and validate user input
CREATE OR REPLACE FUNCTION security_audit.log_user_access(
    p_user_id VARCHAR,
    p_action VARCHAR,
    p_resource_type VARCHAR DEFAULT NULL,
    p_resource_id UUID DEFAULT NULL,
    p_ip_address INET DEFAULT NULL,
    p_user_agent TEXT DEFAULT NULL
) RETURNS VOID AS $$
BEGIN
    INSERT INTO security_audit.access_log (
        user_id, action, resource_type, resource_id, ip_address, user_agent
    ) VALUES (
        p_user_id, p_action, p_resource_type, p_resource_id, p_ip_address, p_user_agent
    );
END;
$$ LANGUAGE plpgsql;

-- =============================================
-- PERMISSIONS SETUP
-- =============================================

-- Grant permissions to roles
GRANT SELECT ON ALL TABLES IN SCHEMA flight_data TO flight_reader;
GRANT SELECT ON ALL TABLES IN SCHEMA investigation TO flight_analyst;
GRANT ALL ON ALL TABLES IN SCHEMA flight_data TO flight_analyst;
GRANT ALL ON ALL TABLES IN SCHEMA investigation TO flight_analyst;
GRANT ALL ON ALL TABLES IN SCHEMA security_audit TO flight_admin;

-- Grant sequence permissions
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA flight_data TO flight_reader, flight_analyst;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA investigation TO flight_analyst;

-- Grant view permissions
GRANT SELECT ON investigation.flight_details TO flight_reader, flight_analyst;
GRANT SELECT ON investigation.passenger_flight_history TO flight_reader, flight_analyst;
GRANT SELECT ON investigation.route_frequency TO flight_reader, flight_analyst;
GRANT SELECT ON investigation.passenger_cotravel TO flight_analyst;

-- Grant function execution permissions
GRANT EXECUTE ON FUNCTION investigation.find_shared_flights(VARCHAR, VARCHAR) TO flight_analyst;
GRANT EXECUTE ON FUNCTION investigation.analyze_travel_pattern(VARCHAR, DATE, DATE) TO flight_analyst;
GRANT EXECUTE ON FUNCTION security_audit.log_user_access(VARCHAR, VARCHAR, VARCHAR, UUID, INET, TEXT) TO flight_reader, flight_analyst;

-- Enable row level security
ALTER TABLE flight_data.flights ENABLE ROW LEVEL SECURITY;
ALTER TABLE flight_data.passengers ENABLE ROW LEVEL SECURITY;
ALTER TABLE security_audit.audit_log ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY flight_data_access ON flight_data.flights
    FOR ALL TO flight_reader, flight_analyst
    USING (true);

CREATE POLICY passenger_data_access ON flight_data.passengers
    FOR ALL TO flight_reader, flight_analyst
    USING (true);

-- =============================================
-- COMMENTS AND DOCUMENTATION
-- =============================================

COMMENT ON SCHEMA flight_data IS 'Core flight log data storage schema';
COMMENT ON SCHEMA investigation IS 'Investigation analysis and case management schema';
COMMENT ON SCHEMA security_audit IS 'Security audit and access logging schema';

COMMENT ON TABLE flight_data.flights IS 'Main flights table containing all flight information';
COMMENT ON TABLE flight_data.passengers IS 'Master passenger directory with identity verification';
COMMENT ON TABLE flight_data.flight_passengers IS 'Junction table linking flights to passengers';
COMMENT ON TABLE investigation.passenger_connections IS 'Relationship mapping between passengers';
COMMENT ON TABLE investigation.timeline_events IS 'Timeline events for cross-referencing with flights';

-- Insert initial data
\echo 'Database schema created successfully. Ready for data import.'