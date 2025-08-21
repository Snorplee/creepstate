-- Flight Data Import Script
-- Imports CSV flight data into PostgreSQL database

\c trumpstein_flights_db;

-- Create temporary table for CSV import
CREATE TEMP TABLE temp_flight_import (
    date_str VARCHAR(20),
    flight_no VARCHAR(20),
    departure_code VARCHAR(10),
    arrival_code VARCHAR(10),
    passengers_raw TEXT
);

-- Copy CSV data (this will be done programmatically)
-- \COPY temp_flight_import FROM '/flight_flights_table.csv' WITH CSV HEADER;

-- For now, insert a representative sample of the data
INSERT INTO temp_flight_import (date_str, flight_no, departure_code, arrival_code, passengers_raw) VALUES
('11/17/1995', '779', 'CMH', 'PBI', 'Jeff Epstein'),
('11/20/1995', '780', 'PBI', 'TEB', 'Jeff Epstein, A S'),
('11/21/1995', '781', 'TEB', 'PBI', 'Jeff Epstein, A S, Eva Dubin, Glenn Dubin, Celina Dubin'),
('11/26/1995', '782', 'PBI', 'TEB', 'Ghislaine Maxwell, Matt Grippi, A S, Alan Greenberg, Kathy Greenberg, Eva Dubin, Glenn Dubin, Celina Dubin'),
('11/29/1995', '783', 'TEB', 'CMH', 'Jeff Epstein, Sophie Biddle'),
('11/30/1995', '784', 'CMH', 'PBI', 'Jeff Epstein, Sophie Biddle'),
('12/3/1995', '785', 'PBI', 'TEB', 'Jeff Epstein, Sophie Biddle'),
('12/5/1995', '786', 'TEB', 'PBI', 'Jeff Epstein, A S'),
('1/1/1996', '787', 'PBI', 'TEB', 'Jeff Epstein, Ghislaine Maxwell, Gwendolyn Beck, Chuck Schumi, David Anton'),
('1/4/1996', '788', 'TEB', 'PBI', 'Jeff Epstein, Sophie Biddle'),
('1/9/1996', '789', 'PBI', 'TEB', 'Jeff Epstein, A S, Sophie Biddle'),
('1/12/1996', '790', 'TEB', 'PBI', 'Jeff Epstein, Ghislaine Maxwell, Deborah'),
('1/20/1996', '795', 'PBI', 'SAF', 'Jeff Epstein, Ghislaine Maxwell'),
('1/21/1996', '796', 'SAF', 'LAX', 'Jeff Epstein, Ghislaine Maxwell'),
('1/23/1996', '797', 'LAX', 'TEB', 'Jeff Epstein'),
('1/25/1996', '798', 'TEB', 'PBI', 'Jeff Epstein'),
('1/28/1996', '799', 'PBI', 'CMH', 'Jeff Epstein, Ghislaine Maxwell'),
('1/28/1996', '800', 'CMH', 'TEB', 'Jeff Epstein, Ghislaine Maxwell'),
('1/31/1996', '801', 'TEB', 'PBI', 'Jeff Epstein'),
('2/5/1996', '802', 'PBI', 'TNCM', 'Jeff Epstein, Ghislaine Maxwell'),
('2/7/1996', '803', 'TNCM', 'TEB', 'Jeff Epstein, Ghislaine Maxwell'),
('2/9/1996', '804', 'TEB', 'PBI', 'Jeff Epstein, Ghislaine Maxwell, Sharon Reynolds'),
('2/12/1996', '805', 'PBI', 'TEB', 'Jeff Epstein, Ghislaine Maxwell, Sharon Reynolds'),
('2/15/1996', '806', 'TEB', 'BCT', 'Jim Cayne, Patricia Cayne, Alison Cayne, Warren, Karv Deweidy, Sophie Biddle'),
('2/19/1996', '807', 'BCT', 'TEB', 'Jim Cayne, Patricia Cayne, Alison Cayne, Warren, Sophie Biddle'),
('2/28/1996', '808', 'TEB', 'PBI', 'Jeff Epstein, Ghislaine Maxwell, A S, Sophie Biddle'),
('3/4/1996', '809', 'PBI', 'TEB', 'Jeff Epstein, Ghislaine Maxwell, A S, Sophie Biddle, Maria'),
('3/8/1996', '810', 'TEB', 'PBI', 'Jeff Epstein, Ghislaine Maxwell, A S, Diedri Neal'),
('3/11/1996', '811', 'PBI', 'TEB', 'Jeff Epstein, Ghislaine Maxwell, A S, Christine'),
('3/15/1996', '812', 'TEB', 'PBI', 'Jeff Epstein, Ghislaine Maxwell, A S'),
('3/16/1996', '814', 'CMH', 'TEB', 'Jeff Epstein, Ghislaine Maxwell, A S'),
('3/18/1996', '813', 'PBI', 'CMH', 'Jeff Epstein, Ghislaine Maxwell, A S, Clare Hazell-Iveagh'),
('3/22/1996', '815', 'TEB', 'PBI', 'Jeff Epstein, Frances, Sophie Biddle, Eva Dubin'),
('3/24/1996', '816', 'PBI', 'TEB', 'Jeff Epstein, Eva Dubin, Celina Dubin'),
('3/26/1996', '817', 'TEB', 'VNY', 'Jeff Epstein'),
('3/29/1996', '818', 'VNY', 'PBI', 'Jeff Epstein'),
('4/8/1996', '821', 'PBI', 'TEB', 'Jeff Epstein, Ghislaine Maxwell, Eva Dubin, Glenn Dubin, Celina Dubin'),
('4/22/1996', '828', 'PBI', 'TEB', 'Jeff Epstein, Ghislaine Maxwell'),
('4/26/1996', '829', 'TEB', 'PBI', 'Jeff Epstein, Ghislaine Maxwell'),
('4/29/1996', '830', 'PBI', 'TEB', 'Jeff Epstein, Ghislaine Maxwell, Matt Grippi'),
('5/2/1996', '831', 'TEB', 'EIDW', 'Jeff Epstein, Elizabeth Johnson, Jordan Dubin, A Teal, J Teal, O Teal'),
('5/3/1996', '832', 'EIDW', 'EIWF', 'Catherine Finglas, Elizabeth Johnson, A Teal, J Teal, O Teal'),
('5/3/1996', '833', 'EIWF', 'LFPB', 'Jeff Epstein, Pamela Johanaoff'),
('5/6/1996', '834', 'LFPB', 'LSGG', 'Jeff Epstein, Pamela Johanaoff'),
('5/6/1996', '835', 'LSGG', 'EINN', 'Jeff Epstein, Pamela Johanaoff'),
('5/6/1996', '836', 'EINN', 'TEB', 'Jeff Epstein, Pamela Johanaoff'),
('5/8/1996', '837', 'TEB', 'MDLR', 'Jeff Epstein, Ghislaine Maxwell, Katherina Kotzig'),
('5/9/1996', '838', 'MDLR', 'MBGT', 'Jeff Epstein, Ghislaine Maxwell, Katherina Kotzig');

-- Function to parse date strings in various formats
CREATE OR REPLACE FUNCTION parse_flight_date(date_str VARCHAR) RETURNS DATE AS $$
BEGIN
    -- Try MM/DD/YYYY format first
    IF date_str ~ '^\d{1,2}/\d{1,2}/\d{4}$' THEN
        RETURN TO_DATE(date_str, 'MM/DD/YYYY');
    END IF;
    
    -- Try MM/DD/YY format
    IF date_str ~ '^\d{1,2}/\d{1,2}/\d{2}$' THEN
        -- Assume years < 50 are 20xx, >= 50 are 19xx
        IF RIGHT(date_str, 2)::INTEGER < 50 THEN
            RETURN TO_DATE('20' || RIGHT(date_str, 2) || '/' || LEFT(date_str, LENGTH(date_str) - 3), 'YYYY/MM/DD');
        ELSE
            RETURN TO_DATE('19' || RIGHT(date_str, 2) || '/' || LEFT(date_str, LENGTH(date_str) - 3), 'YYYY/MM/DD');
        END IF;
    END IF;
    
    -- Try YYYY-MM-DD format
    IF date_str ~ '^\d{4}-\d{1,2}-\d{1,2}$' THEN
        RETURN TO_DATE(date_str, 'YYYY-MM-DD');
    END IF;
    
    -- If no format matches, return NULL
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Function to clean and standardize passenger names
CREATE OR REPLACE FUNCTION clean_passenger_name(name_raw VARCHAR) RETURNS VARCHAR AS $$
DECLARE
    cleaned_name VARCHAR;
BEGIN
    -- Remove quotes and trim whitespace
    cleaned_name := TRIM(REPLACE(name_raw, '"', ''));
    
    -- Handle common name variations
    cleaned_name := CASE
        WHEN cleaned_name ILIKE 'jeff epstein' THEN 'Jeffrey Epstein'
        WHEN cleaned_name ILIKE 'g maxwell' THEN 'Ghislaine Maxwell'
        WHEN cleaned_name ILIKE 'g. maxwell' THEN 'Ghislaine Maxwell'
        WHEN cleaned_name ILIKE 'bill clinton' THEN 'Bill Clinton'
        WHEN cleaned_name ILIKE 'william clinton' THEN 'Bill Clinton'
        WHEN cleaned_name ILIKE 'president clinton' THEN 'Bill Clinton'
        WHEN cleaned_name ILIKE 'donald trump' THEN 'Donald Trump'
        WHEN cleaned_name ILIKE 'd trump' THEN 'Donald Trump'
        WHEN cleaned_name ILIKE 'prince andrew' THEN 'Prince Andrew'
        WHEN cleaned_name ILIKE 'andrew windsor' THEN 'Prince Andrew'
        WHEN cleaned_name ILIKE 'duke of york' THEN 'Prince Andrew'
        WHEN cleaned_name ILIKE 's kellen' THEN 'Sarah Kellen'
        WHEN cleaned_name ILIKE 'sarah kellen' THEN 'Sarah Kellen'
        WHEN cleaned_name ILIKE 'n marcinkova' THEN 'Nadia Marcinkova'
        WHEN cleaned_name ILIKE 'nada marcinkova' THEN 'Nadia Marcinkova'
        WHEN cleaned_name ILIKE 'alan dershowitz' THEN 'Alan Dershowitz'
        WHEN cleaned_name ILIKE 'kevin spacey' THEN 'Kevin Spacey'
        WHEN cleaned_name ILIKE 'chris tucker' THEN 'Chris Tucker'
        WHEN cleaned_name ILIKE 'glenn dubin' THEN 'Glenn Dubin'
        WHEN cleaned_name ILIKE 'eva dubin' THEN 'Eva Dubin'
        WHEN cleaned_name ILIKE 'celina dubin' THEN 'Celina Dubin'
        WHEN cleaned_name ILIKE 'sophie biddle' THEN 'Sophie Biddle'
        ELSE cleaned_name
    END;
    
    RETURN cleaned_name;
END;
$$ LANGUAGE plpgsql;

-- Function to find or create passenger
CREATE OR REPLACE FUNCTION find_or_create_passenger(passenger_name VARCHAR) RETURNS UUID AS $$
DECLARE
    passenger_uuid UUID;
    first_name_part VARCHAR;
    last_name_part VARCHAR;
    name_parts VARCHAR[];
BEGIN
    -- Clean the name
    passenger_name := clean_passenger_name(passenger_name);
    
    -- Try to find existing passenger by exact name match
    SELECT id INTO passenger_uuid 
    FROM flight_data.passengers 
    WHERE full_name = passenger_name;
    
    IF passenger_uuid IS NOT NULL THEN
        RETURN passenger_uuid;
    END IF;
    
    -- Try to find by alias
    SELECT p.id INTO passenger_uuid
    FROM flight_data.passengers p
    JOIN flight_data.passenger_aliases a ON p.id = a.passenger_id
    WHERE a.alias = passenger_name;
    
    IF passenger_uuid IS NOT NULL THEN
        RETURN passenger_uuid;
    END IF;
    
    -- Create new passenger if not found
    name_parts := string_to_array(passenger_name, ' ');
    
    IF array_length(name_parts, 1) >= 2 THEN
        first_name_part := name_parts[1];
        last_name_part := name_parts[array_length(name_parts, 1)];
    ELSE
        first_name_part := passenger_name;
        last_name_part := NULL;
    END IF;
    
    INSERT INTO flight_data.passengers (
        full_name, 
        first_name, 
        last_name, 
        passenger_type, 
        verified_identity,
        risk_level
    ) VALUES (
        passenger_name, 
        first_name_part, 
        last_name_part,
        CASE 
            WHEN passenger_name IN ('Jeffrey Epstein', 'Ghislaine Maxwell') THEN 'suspect'
            WHEN passenger_name IN ('Donald Trump', 'Bill Clinton', 'Prince Andrew') THEN 'vip'
            WHEN passenger_name IN ('Sarah Kellen', 'Nadia Marcinkova') THEN 'staff'
            ELSE 'regular'
        END,
        CASE 
            WHEN passenger_name IN ('Jeffrey Epstein', 'Ghislaine Maxwell', 'Donald Trump', 'Bill Clinton', 'Prince Andrew', 'Sarah Kellen', 'Nadia Marcinkova') THEN true
            ELSE false
        END,
        CASE 
            WHEN passenger_name IN ('Jeffrey Epstein', 'Ghislaine Maxwell') THEN 'critical'
            WHEN passenger_name IN ('Donald Trump', 'Bill Clinton', 'Prince Andrew') THEN 'high'
            WHEN passenger_name IN ('Sarah Kellen', 'Nadia Marcinkova') THEN 'medium'
            ELSE 'unknown'
        END
    ) RETURNING id INTO passenger_uuid;
    
    RETURN passenger_uuid;
END;
$$ LANGUAGE plpgsql;

-- Function to find or create location
CREATE OR REPLACE FUNCTION find_or_create_location(airport_code VARCHAR) RETURNS UUID AS $$
DECLARE
    location_uuid UUID;
BEGIN
    -- Try to find existing location
    SELECT id INTO location_uuid 
    FROM flight_data.locations 
    WHERE airport_code = UPPER(airport_code);
    
    IF location_uuid IS NOT NULL THEN
        RETURN location_uuid;
    END IF;
    
    -- Create new location if not found (with minimal information)
    INSERT INTO flight_data.locations (
        airport_code, 
        airport_name, 
        city, 
        country,
        facility_type
    ) VALUES (
        UPPER(airport_code), 
        'Unknown Airport - ' || UPPER(airport_code),
        'Unknown',
        'US', -- Default assumption for unknown airports
        'unknown'
    ) RETURNING id INTO location_uuid;
    
    RETURN location_uuid;
END;
$$ LANGUAGE plpgsql;

-- Import flights from temporary table
DO $$
DECLARE
    flight_record RECORD;
    flight_uuid UUID;
    departure_uuid UUID;
    arrival_uuid UUID;
    passenger_list TEXT[];
    passenger_name VARCHAR;
    passenger_uuid UUID;
    aircraft_uuid UUID;
    flight_date_parsed DATE;
BEGIN
    -- Get the primary aircraft (N908JE) for flights without specific aircraft assignment
    SELECT id INTO aircraft_uuid FROM flight_data.aircraft WHERE tail_number = 'N908JE';
    
    FOR flight_record IN SELECT * FROM temp_flight_import LOOP
        -- Parse the flight date
        flight_date_parsed := parse_flight_date(flight_record.date_str);
        
        IF flight_date_parsed IS NULL THEN
            RAISE NOTICE 'Could not parse date: %', flight_record.date_str;
            CONTINUE;
        END IF;
        
        -- Find or create locations
        departure_uuid := find_or_create_location(flight_record.departure_code);
        arrival_uuid := find_or_create_location(flight_record.arrival_code);
        
        -- Create the flight record
        INSERT INTO flight_data.flights (
            flight_number,
            aircraft_id,
            departure_location_id,
            arrival_location_id,
            flight_date,
            manifest_id,
            source_document,
            data_quality
        ) VALUES (
            flight_record.flight_no,
            aircraft_uuid,
            departure_uuid,
            arrival_uuid,
            flight_date_parsed,
            'CSV_IMPORT_' || flight_record.flight_no || '_' || flight_record.date_str,
            'flight_flights_table.csv',
            'standard'
        ) RETURNING id INTO flight_uuid;
        
        -- Parse passengers
        IF flight_record.passengers_raw IS NOT NULL AND TRIM(flight_record.passengers_raw) != '' THEN
            -- Split passenger list by comma
            passenger_list := string_to_array(flight_record.passengers_raw, ',');
            
            FOREACH passenger_name IN ARRAY passenger_list LOOP
                passenger_name := TRIM(passenger_name);
                IF passenger_name != '' THEN
                    -- Find or create passenger
                    passenger_uuid := find_or_create_passenger(passenger_name);
                    
                    -- Link passenger to flight
                    INSERT INTO flight_data.flight_passengers (
                        flight_id,
                        passenger_id,
                        passenger_role,
                        name_in_manifest
                    ) VALUES (
                        flight_uuid,
                        passenger_uuid,
                        'passenger',
                        passenger_name
                    );
                END IF;
            END LOOP;
            
            -- Update flight passenger count
            UPDATE flight_data.flights 
            SET passenger_count = array_length(passenger_list, 1)
            WHERE id = flight_uuid;
        END IF;
        
        RAISE NOTICE 'Imported flight: % on % from % to % with % passengers', 
            flight_record.flight_no, 
            flight_date_parsed, 
            flight_record.departure_code, 
            flight_record.arrival_code,
            COALESCE(array_length(passenger_list, 1), 0);
    END LOOP;
END $$;

-- Update passenger connection counts based on imported flights
INSERT INTO investigation.passenger_connections (
    passenger1_id, 
    passenger2_id, 
    connection_type, 
    connection_strength, 
    shared_flights_count,
    first_documented_interaction,
    last_documented_interaction,
    relationship_status
)
SELECT DISTINCT
    p1.id,
    p2.id,
    'co_traveler',
    LEAST(10, shared_flights * 2), -- Scale connection strength by shared flights
    shared_flights,
    min_date,
    max_date,
    'unknown'
FROM (
    SELECT 
        fp1.passenger_id as passenger1_id,
        fp2.passenger_id as passenger2_id,
        COUNT(*) as shared_flights,
        MIN(f.flight_date) as min_date,
        MAX(f.flight_date) as max_date
    FROM flight_data.flight_passengers fp1
    JOIN flight_data.flight_passengers fp2 ON fp1.flight_id = fp2.flight_id 
        AND fp1.passenger_id < fp2.passenger_id -- Avoid duplicates and self-references
    JOIN flight_data.flights f ON fp1.flight_id = f.id
    GROUP BY fp1.passenger_id, fp2.passenger_id
    HAVING COUNT(*) > 1 -- Only relationships with multiple shared flights
) shared_flight_data
JOIN flight_data.passengers p1 ON shared_flight_data.passenger1_id = p1.id
JOIN flight_data.passengers p2 ON shared_flight_data.passenger2_id = p2.id
ON CONFLICT (passenger1_id, passenger2_id) DO UPDATE SET
    shared_flights_count = EXCLUDED.shared_flights_count,
    connection_strength = EXCLUDED.connection_strength,
    last_documented_interaction = EXCLUDED.last_documented_interaction;

-- Analyze flight patterns and create pattern records
INSERT INTO investigation.flight_patterns (
    pattern_name,
    pattern_type,
    description,
    involved_flights,
    frequency_count,
    date_range_start,
    date_range_end,
    risk_assessment
)
SELECT 
    dl.airport_code || ' to ' || al.airport_code || ' Route',
    'frequent_route',
    'Route flown ' || COUNT(*) || ' times between ' || MIN(f.flight_date) || ' and ' || MAX(f.flight_date),
    array_agg(f.id),
    COUNT(*),
    MIN(f.flight_date),
    MAX(f.flight_date),
    CASE 
        WHEN COUNT(*) > 10 THEN 'high'
        WHEN COUNT(*) > 5 THEN 'medium'
        ELSE 'low'
    END
FROM flight_data.flights f
JOIN flight_data.locations dl ON f.departure_location_id = dl.id
JOIN flight_data.locations al ON f.arrival_location_id = al.id
GROUP BY dl.airport_code, al.airport_code, dl.id, al.id
HAVING COUNT(*) > 2;

-- Update statistics for query optimization
ANALYZE flight_data.flights;
ANALYZE flight_data.flight_passengers;
ANALYZE investigation.passenger_connections;
ANALYZE investigation.flight_patterns;

-- Create summary report
DO $$
DECLARE
    total_flights INTEGER;
    total_passengers INTEGER;
    total_routes INTEGER;
    date_range_start DATE;
    date_range_end DATE;
BEGIN
    SELECT COUNT(*) INTO total_flights FROM flight_data.flights;
    SELECT COUNT(DISTINCT passenger_id) INTO total_passengers FROM flight_data.flight_passengers;
    SELECT COUNT(DISTINCT departure_location_id || '-' || arrival_location_id) INTO total_routes FROM flight_data.flights;
    SELECT MIN(flight_date), MAX(flight_date) INTO date_range_start, date_range_end FROM flight_data.flights;
    
    RAISE NOTICE '==== FLIGHT DATA IMPORT SUMMARY ====';
    RAISE NOTICE 'Total Flights Imported: %', total_flights;
    RAISE NOTICE 'Total Unique Passengers: %', total_passengers;
    RAISE NOTICE 'Total Unique Routes: %', total_routes;
    RAISE NOTICE 'Date Range: % to %', date_range_start, date_range_end;
    RAISE NOTICE '====================================';
END $$;

-- Clean up temporary table
DROP TABLE temp_flight_import;

\echo 'Flight data import completed successfully.';