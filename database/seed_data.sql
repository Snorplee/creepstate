-- Seed data for Trumpstein Flight Logs Database
-- Initial reference data and key entities

\c trumpstein_flights_db;

-- Insert major aircraft from Epstein fleet
INSERT INTO flight_data.aircraft (tail_number, model, manufacturer, owner_entity, aircraft_type, max_passengers, registration_country, notes) VALUES
('N908JE', 'Boeing 727-200', 'Boeing', 'Jeffrey Epstein', 'jet', 50, 'US', 'The famous "Lolita Express" - primary long-range aircraft'),
('N212JE', 'Gulfstream II', 'Gulfstream Aerospace', 'Jeffrey Epstein', 'jet', 12, 'US', 'Secondary jet for shorter trips'),
('N909JE', 'Gulfstream IV', 'Gulfstream Aerospace', 'Jeffrey Epstein', 'jet', 14, 'US', 'High-end executive jet'),
('N120JE', 'Bell 430', 'Bell Helicopter', 'Jeffrey Epstein', 'helicopter', 8, 'US', 'Helicopter for local transport'),
('N9999JE', 'DHC-6 Twin Otter', 'De Havilland Canada', 'Jeffrey Epstein', 'turboprop', 19, 'US', 'Island hopping aircraft for Caribbean routes');

-- Insert major airports and locations
INSERT INTO flight_data.locations (airport_code, airport_name, city, state_province, country, facility_type, security_level, is_international, coordinates) VALUES
-- Major US Airports
('TEB', 'Teterboro Airport', 'Teterboro', 'New Jersey', 'US', 'private', 'high', false, POINT(-74.0596, 40.8501)),
('PBI', 'Palm Beach International Airport', 'Palm Beach', 'Florida', 'US', 'commercial', 'standard', true, POINT(-80.0956, 26.6832)),
('CMH', 'John Glenn Columbus International Airport', 'Columbus', 'Ohio', 'US', 'commercial', 'standard', true, POINT(-82.8919, 39.9980)),
('LGA', 'LaGuardia Airport', 'New York', 'New York', 'US', 'commercial', 'high', true, POINT(-73.8726, 40.7772)),
('EWR', 'Newark Liberty International Airport', 'Newark', 'New Jersey', 'US', 'commercial', 'high', true, POINT(-74.1687, 40.6925)),
('JFK', 'John F. Kennedy International Airport', 'New York', 'New York', 'US', 'commercial', 'high', true, POINT(-73.7781, 40.6413)),
('VNY', 'Van Nuys Airport', 'Los Angeles', 'California', 'US', 'private', 'standard', false, POINT(-118.4900, 34.2098)),
('SAF', 'Santa Fe Regional Airport', 'Santa Fe', 'New Mexico', 'US', 'commercial', 'standard', false, POINT(-106.0890, 35.6170)),
('BCT', 'Boca Raton Airport', 'Boca Raton', 'Florida', 'US', 'private', 'standard', false, POINT(-80.1078, 26.3784)),

-- Caribbean/Offshore Locations
('TIST', 'Cyril E. King Airport', 'St. Thomas', 'US Virgin Islands', 'VI', 'commercial', 'restricted', true, POINT(-64.9733, 18.3373)),
('TISX', 'Henry E. Rohlsen Airport', 'St. Croix', 'US Virgin Islands', 'VI', 'commercial', 'standard', true, POINT(-64.7985, 17.7019)),
('TNCM', 'Princess Juliana International Airport', 'St. Maarten', 'Sint Maarten', 'SX', 'commercial', 'standard', true, POINT(-63.1089, 18.0403)),
('MBPV', 'Providenciales Airport', 'Providenciales', 'Turks and Caicos', 'TC', 'commercial', 'standard', true, POINT(-72.2659, 21.7736)),
('MBGT', 'Great Harbour Cay Airport', 'Great Harbour Cay', 'Bahamas', 'BS', 'private', 'restricted', false, POINT(-77.8815, 25.2528)),

-- International Locations
('EIDW', 'Dublin Airport', 'Dublin', 'Dublin', 'IE', 'commercial', 'standard', true, POINT(-6.2701, 53.4213)),
('EIWF', 'Waterford Airport', 'Waterford', 'Waterford', 'IE', 'commercial', 'standard', true, POINT(-8.8187, 53.9103)),
('LFPB', 'Paris Le Bourget Airport', 'Paris', 'Île-de-France', 'FR', 'private', 'high', true, POINT(2.4414, 48.9694)),
('LSGG', 'Geneva Airport', 'Geneva', 'Geneva', 'CH', 'commercial', 'high', true, POINT(6.1090, 46.2381)),
('EINN', 'Shannon Airport', 'Shannon', 'Clare', 'IE', 'commercial', 'standard', true, POINT(-8.9248, 52.7020)),
('EGKB', 'Biggin Hill Airport', 'London', 'England', 'GB', 'private', 'high', false, POINT(0.0327, 51.3307)),
('LPFR', 'Porto Airport', 'Porto', 'Porto', 'PT', 'commercial', 'standard', true, POINT(-8.6814, 41.2481)),

-- Caribbean Private/Restricted
('MDLR', 'Las Américas International Airport', 'Santo Domingo', 'Dominican Republic', 'DO', 'commercial', 'standard', true, POINT(-69.6689, 18.4670)),
('CYOW', 'Macdonald-Cartier International Airport', 'Ottawa', 'Ontario', 'CA', 'commercial', 'standard', true, POINT(-75.6697, 45.3225)),

-- Heliports
('KJRA', 'West 30th Street Heliport', 'New York', 'New York', 'US', 'helipad', 'high', false, POINT(-74.0099, 40.7505));

-- Insert key passengers with risk assessment
INSERT INTO flight_data.passengers (full_name, first_name, last_name, passenger_type, verified_identity, risk_level, nationality, occupation, investigation_status) VALUES
-- Primary figures
('Jeffrey Epstein', 'Jeffrey', 'Epstein', 'suspect', true, 'critical', 'American', 'Financier', 'investigated'),
('Ghislaine Maxwell', 'Ghislaine', 'Maxwell', 'suspect', true, 'critical', 'British', 'Socialite', 'investigated'),
('Donald Trump', 'Donald', 'Trump', 'vip', true, 'high', 'American', 'Businessman/Politician', 'person_of_interest'),
('Bill Clinton', 'William', 'Clinton', 'vip', true, 'high', 'American', 'Former President', 'person_of_interest'),
('Prince Andrew', 'Andrew', 'Windsor', 'vip', true, 'high', 'British', 'Royal Family', 'person_of_interest'),
('Alan Dershowitz', 'Alan', 'Dershowitz', 'vip', true, 'medium', 'American', 'Lawyer', 'person_of_interest'),

-- Associates and Staff
('Sarah Kellen', 'Sarah', 'Kellen', 'staff', true, 'medium', 'American', 'Assistant', 'investigated'),
('Nadia Marcinkova', 'Nadia', 'Marcinkova', 'staff', true, 'medium', 'Slovakian', 'Pilot', 'investigated'),
('Jean-Luc Brunel', 'Jean-Luc', 'Brunel', 'guest', true, 'high', 'French', 'Model Agent', 'investigated'),
('Les Wexner', 'Leslie', 'Wexner', 'guest', true, 'medium', 'American', 'Businessman', 'person_of_interest'),

-- Celebrities and Public Figures
('Kevin Spacey', 'Kevin', 'Spacey', 'guest', true, 'medium', 'American', 'Actor', 'person_of_interest'),
('Chris Tucker', 'Chris', 'Tucker', 'guest', true, 'low', 'American', 'Actor', 'none'),
('Naomi Campbell', 'Naomi', 'Campbell', 'guest', true, 'low', 'British', 'Model', 'none'),
('Stephen Hawking', 'Stephen', 'Hawking', 'guest', true, 'low', 'British', 'Physicist', 'none'),

-- Politicians and Officials
('Bill Richardson', 'Bill', 'Richardson', 'vip', true, 'medium', 'American', 'Politician', 'person_of_interest'),
('George Mitchell', 'George', 'Mitchell', 'vip', true, 'medium', 'American', 'Senator', 'person_of_interest'),
('John Glenn', 'John', 'Glenn', 'vip', true, 'low', 'American', 'Astronaut/Senator', 'none'),
('Ehud Barak', 'Ehud', 'Barak', 'vip', true, 'medium', 'Israeli', 'Former Prime Minister', 'person_of_interest'),

-- Business Associates
('Glenn Dubin', 'Glenn', 'Dubin', 'guest', true, 'medium', 'American', 'Hedge Fund Manager', 'person_of_interest'),
('Eva Dubin', 'Eva', 'Dubin', 'guest', true, 'low', 'American', 'Philanthropist', 'none'),
('Doug Band', 'Doug', 'Band', 'guest', true, 'medium', 'American', 'Clinton Aide', 'person_of_interest'),

-- Frequent but lower-profile passengers
('A S', 'A', 'S', 'unknown', false, 'unknown', 'Unknown', 'Unknown', 'none'),
('Sophie Biddle', 'Sophie', 'Biddle', 'guest', false, 'low', 'Unknown', 'Unknown', 'none'),
('Celina Dubin', 'Celina', 'Dubin', 'guest', true, 'low', 'American', 'Student', 'none'),

-- Crew members
('David Rodgers', 'David', 'Rodgers', 'crew', true, 'low', 'American', 'Pilot', 'none'),
('Larry Visoski', 'Larry', 'Visoski', 'crew', true, 'low', 'American', 'Pilot', 'none'),
('Shannon Harrison', 'Shannon', 'Harrison', 'crew', true, 'low', 'American', 'Flight Attendant', 'none');

-- Insert passenger aliases for common variations
INSERT INTO flight_data.passenger_aliases (passenger_id, alias, alias_type, confidence_level, verified) VALUES
((SELECT id FROM flight_data.passengers WHERE full_name = 'Jeffrey Epstein'), 'Jeff Epstein', 'nickname', 10, true),
((SELECT id FROM flight_data.passengers WHERE full_name = 'Jeffrey Epstein'), 'JE', 'initials', 9, true),
((SELECT id FROM flight_data.passengers WHERE full_name = 'Ghislaine Maxwell'), 'G Maxwell', 'abbreviated', 10, true),
((SELECT id FROM flight_data.passengers WHERE full_name = 'Ghislaine Maxwell'), 'GM', 'initials', 9, true),
((SELECT id FROM flight_data.passengers WHERE full_name = 'Donald Trump'), 'D Trump', 'abbreviated', 10, true),
((SELECT id FROM flight_data.passengers WHERE full_name = 'Donald Trump'), 'DT', 'initials', 9, true),
((SELECT id FROM flight_data.passengers WHERE full_name = 'Bill Clinton'), 'William Clinton', 'full_name', 10, true),
((SELECT id FROM flight_data.passengers WHERE full_name = 'Bill Clinton'), 'President Clinton', 'title', 10, true),
((SELECT id FROM flight_data.passengers WHERE full_name = 'Bill Clinton'), 'WJC', 'initials', 9, true),
((SELECT id FROM flight_data.passengers WHERE full_name = 'Prince Andrew'), 'Andrew Windsor', 'formal_name', 10, true),
((SELECT id FROM flight_data.passengers WHERE full_name = 'Prince Andrew'), 'Duke of York', 'title', 10, true),
((SELECT id FROM flight_data.passengers WHERE full_name = 'Sarah Kellen'), 'S Kellen', 'abbreviated', 9, true),
((SELECT id FROM flight_data.passengers WHERE full_name = 'Nadia Marcinkova'), 'N Marcinkova', 'abbreviated', 9, true),
((SELECT id FROM flight_data.passengers WHERE full_name = 'Nadia Marcinkova'), 'Nada Marcinkova', 'variant', 8, false),
((SELECT id FROM flight_data.passengers WHERE full_name = 'A S'), 'AS', 'initials', 7, false),
((SELECT id FROM flight_data.passengers WHERE full_name = 'A S'), 'Anonymous Source', 'pseudonym', 5, false);

-- Insert some key timeline events for cross-referencing
INSERT INTO investigation.timeline_events (event_date, event_title, event_description, event_type, significance_level, participants, tags) VALUES
('1992-03-01', 'First Trump-Epstein Social Connection', 'Mar-a-Lago party where Trump and Epstein were photographed together', 'social', 7, 
    ARRAY[(SELECT id FROM flight_data.passengers WHERE full_name = 'Donald Trump'), 
          (SELECT id FROM flight_data.passengers WHERE full_name = 'Jeffrey Epstein')], 
    ARRAY['mar-a-lago', 'social', 'first-meeting']),

('1993-12-30', 'Trump Wedding - Epstein Guest', 'Jeffrey Epstein attended Donald Trump''s wedding to Marla Maples', 'social', 8,
    ARRAY[(SELECT id FROM flight_data.passengers WHERE full_name = 'Donald Trump'), 
          (SELECT id FROM flight_data.passengers WHERE full_name = 'Jeffrey Epstein')], 
    ARRAY['wedding', 'social', 'personal']),

('2002-01-01', 'New York Magazine Quote', 'Trump calls Epstein a "terrific guy" and mentions his preference for younger women', 'media', 9,
    ARRAY[(SELECT id FROM flight_data.passengers WHERE full_name = 'Donald Trump'), 
          (SELECT id FROM flight_data.passengers WHERE full_name = 'Jeffrey Epstein')], 
    ARRAY['media', 'quote', 'public-statement']),

('2005-03-01', 'Palm Beach Investigation Begins', 'Palm Beach Police begin investigation into Epstein', 'legal', 10,
    ARRAY[(SELECT id FROM flight_data.passengers WHERE full_name = 'Jeffrey Epstein')], 
    ARRAY['investigation', 'legal', 'palm-beach']),

('2008-06-30', 'Acosta Plea Deal', 'Federal non-prosecution agreement signed by Alex Acosta', 'legal', 10,
    ARRAY[(SELECT id FROM flight_data.passengers WHERE full_name = 'Jeffrey Epstein')], 
    ARRAY['plea-deal', 'acosta', 'federal']),

('2015-01-02', 'Giuffre Lawsuit Filed', 'Virginia Giuffre files lawsuit naming Prince Andrew and others', 'legal', 10,
    ARRAY[(SELECT id FROM flight_data.passengers WHERE full_name = 'Prince Andrew'), 
          (SELECT id FROM flight_data.passengers WHERE full_name = 'Jeffrey Epstein'),
          (SELECT id FROM flight_data.passengers WHERE full_name = 'Ghislaine Maxwell')], 
    ARRAY['lawsuit', 'giuffre', 'prince-andrew']),

('2016-07-01', 'Trump Deposition Documents', 'Depositions related to Epstein case involving Trump', 'legal', 8,
    ARRAY[(SELECT id FROM flight_data.passengers WHERE full_name = 'Donald Trump'), 
          (SELECT id FROM flight_data.passengers WHERE full_name = 'Jeffrey Epstein')], 
    ARRAY['deposition', 'legal', 'documents']),

('2019-07-06', 'Epstein Arrested at Teterboro', 'Jeffrey Epstein arrested upon landing at Teterboro Airport', 'legal', 10,
    ARRAY[(SELECT id FROM flight_data.passengers WHERE full_name = 'Jeffrey Epstein')], 
    ARRAY['arrest', 'teterboro', 'federal']),

('2019-08-10', 'Epstein Death in Custody', 'Jeffrey Epstein found dead in federal jail', 'legal', 10,
    ARRAY[(SELECT id FROM flight_data.passengers WHERE full_name = 'Jeffrey Epstein')], 
    ARRAY['death', 'custody', 'conspiracy']),

('2020-07-02', 'Maxwell Arrest', 'Ghislaine Maxwell arrested in New Hampshire', 'legal', 10,
    ARRAY[(SELECT id FROM flight_data.passengers WHERE full_name = 'Ghislaine Maxwell')], 
    ARRAY['arrest', 'maxwell', 'new-hampshire']),

('2021-12-29', 'Maxwell Conviction', 'Ghislaine Maxwell convicted on multiple charges', 'legal', 10,
    ARRAY[(SELECT id FROM flight_data.passengers WHERE full_name = 'Ghislaine Maxwell')], 
    ARRAY['conviction', 'trial', 'verdict']);

-- Insert some pre-defined passenger connections based on known relationships
INSERT INTO investigation.passenger_connections (passenger1_id, passenger2_id, connection_type, connection_strength, relationship_status, evidence_sources) VALUES
-- Core Epstein-Maxwell connection
((SELECT id FROM flight_data.passengers WHERE full_name = 'Jeffrey Epstein'),
 (SELECT id FROM flight_data.passengers WHERE full_name = 'Ghislaine Maxwell'),
 'business_associate', 10, 'ended', 
 ARRAY['flight_logs', 'court_documents', 'witness_testimony']),

-- Trump-Epstein connection
((SELECT id FROM flight_data.passengers WHERE full_name = 'Donald Trump'),
 (SELECT id FROM flight_data.passengers WHERE full_name = 'Jeffrey Epstein'),
 'social_associate', 8, 'ended', 
 ARRAY['social_photos', 'media_quotes', 'witness_accounts']),

-- Clinton-Epstein connection  
((SELECT id FROM flight_data.passengers WHERE full_name = 'Bill Clinton'),
 (SELECT id FROM flight_data.passengers WHERE full_name = 'Jeffrey Epstein'),
 'acquaintance', 7, 'ended', 
 ARRAY['flight_logs', 'foundation_events', 'media_reports']),

-- Prince Andrew connections
((SELECT id FROM flight_data.passengers WHERE full_name = 'Prince Andrew'),
 (SELECT id FROM flight_data.passengers WHERE full_name = 'Jeffrey Epstein'),
 'friend', 9, 'ended', 
 ARRAY['flight_logs', 'social_photos', 'court_documents']),

((SELECT id FROM flight_data.passengers WHERE full_name = 'Prince Andrew'),
 (SELECT id FROM flight_data.passengers WHERE full_name = 'Ghislaine Maxwell'),
 'friend', 8, 'unknown', 
 ARRAY['social_photos', 'witness_testimony', 'media_reports']),

-- Epstein staff connections
((SELECT id FROM flight_data.passengers WHERE full_name = 'Jeffrey Epstein'),
 (SELECT id FROM flight_data.passengers WHERE full_name = 'Sarah Kellen'),
 'employer', 10, 'ended', 
 ARRAY['employment_records', 'court_documents', 'witness_testimony']),

((SELECT id FROM flight_data.passengers WHERE full_name = 'Jeffrey Epstein'),
 (SELECT id FROM flight_data.passengers WHERE full_name = 'Nadia Marcinkova'),
 'employer', 9, 'ended', 
 ARRAY['pilot_records', 'court_documents', 'witness_testimony']);

-- Insert initial investigation case
INSERT INTO investigation.cases (case_name, case_description, case_status, priority_level, lead_investigator, related_passengers, case_notes) VALUES
('Epstein Flight Network Analysis', 
 'Comprehensive analysis of Jeffrey Epstein flight network to identify patterns, connections, and potential criminal activity facilitation',
 'ongoing', 
 'critical', 
 'Federal Investigation Team',
 ARRAY[(SELECT id FROM flight_data.passengers WHERE full_name = 'Jeffrey Epstein'),
       (SELECT id FROM flight_data.passengers WHERE full_name = 'Ghislaine Maxwell'),
       (SELECT id FROM flight_data.passengers WHERE full_name = 'Sarah Kellen')],
 'Primary focus on identifying trafficking routes and co-conspirator networks through flight pattern analysis');

-- Create indexes on commonly queried columns for better performance
CREATE INDEX IF NOT EXISTS idx_passengers_full_name_gin ON flight_data.passengers USING gin(to_tsvector('english', full_name));
CREATE INDEX IF NOT EXISTS idx_passenger_aliases_gin ON flight_data.passenger_aliases USING gin(to_tsvector('english', alias));
CREATE INDEX IF NOT EXISTS idx_timeline_events_title_gin ON investigation.timeline_events USING gin(to_tsvector('english', event_title));

-- Set up some statistics for query optimization
ANALYZE flight_data.passengers;
ANALYZE flight_data.locations;
ANALYZE flight_data.aircraft;
ANALYZE flight_data.passenger_aliases;

\echo 'Seed data inserted successfully. Database ready for flight data import.'