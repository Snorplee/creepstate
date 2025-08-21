#!/usr/bin/env python3
"""
CSV Flight Data Import Script for Creepstate Investigation Platform Database
Reads the flight_flights_table.csv file and imports all data into PostgreSQL
"""

import csv
import os
import re
import psycopg2
from psycopg2.extras import RealDictCursor
from datetime import datetime, date
import logging
import sys
from typing import List, Dict, Optional, Tuple

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('flight_import.log'),
        logging.StreamHandler(sys.stdout)
    ]
)
logger = logging.getLogger(__name__)

class FlightDataImporter:
    def __init__(self, db_config: Dict[str, str]):
        self.db_config = db_config
        self.connection = None
        self.cursor = None
        
        # Statistics
        self.stats = {
            'flights_imported': 0,
            'passengers_created': 0,
            'locations_created': 0,
            'connections_created': 0,
            'errors': 0
        }
        
        # Cache for lookups
        self.passenger_cache = {}
        self.location_cache = {}
        self.aircraft_cache = {}
        
    def connect_database(self):
        """Establish database connection"""
        try:
            self.connection = psycopg2.connect(**self.db_config)
            self.cursor = self.connection.cursor(cursor_factory=RealDictCursor)
            logger.info("Connected to database successfully")
            
            # Load caches
            self._load_caches()
            
        except Exception as e:
            logger.error(f"Failed to connect to database: {e}")
            raise
            
    def _load_caches(self):
        """Load existing data into caches for faster lookups"""
        # Load passengers
        self.cursor.execute("SELECT id, full_name FROM flight_data.passengers")
        for row in self.cursor.fetchall():
            self.passenger_cache[row['full_name'].lower()] = row['id']
            
        # Load passenger aliases
        self.cursor.execute("""
            SELECT p.id, a.alias 
            FROM flight_data.passengers p 
            JOIN flight_data.passenger_aliases a ON p.id = a.passenger_id
        """)
        for row in self.cursor.fetchall():
            self.passenger_cache[row['alias'].lower()] = row['id']
            
        # Load locations
        self.cursor.execute("SELECT id, airport_code FROM flight_data.locations")
        for row in self.cursor.fetchall():
            self.location_cache[row['airport_code'].upper()] = row['id']
            
        # Load aircraft
        self.cursor.execute("SELECT id, tail_number FROM flight_data.aircraft")
        for row in self.cursor.fetchall():
            self.aircraft_cache[row['tail_number']] = row['id']
            
        logger.info(f"Loaded caches: {len(self.passenger_cache)} passengers, "
                   f"{len(self.location_cache)} locations, {len(self.aircraft_cache)} aircraft")
    
    def parse_date(self, date_str: str) -> Optional[date]:
        """Parse various date formats"""
        if not date_str or date_str.strip() == '':
            return None
            
        date_str = date_str.strip()
        
        # Try different date formats
        formats = [
            '%m/%d/%Y',  # 11/17/1995
            '%m/%d/%y',  # 11/17/95  
            '%Y-%m-%d',  # 1995-11-17
            '%d/%m/%Y',  # 17/11/1995
            '%d-%m-%Y',  # 17-11-1995
        ]
        
        for fmt in formats:
            try:
                parsed_date = datetime.strptime(date_str, fmt).date()
                # Handle 2-digit years
                if parsed_date.year < 1950:
                    parsed_date = parsed_date.replace(year=parsed_date.year + 100)
                return parsed_date
            except ValueError:
                continue
                
        logger.warning(f"Could not parse date: {date_str}")
        return None
    
    def clean_passenger_name(self, name: str) -> str:
        """Clean and standardize passenger names"""
        if not name:
            return ""
            
        # Remove quotes and extra whitespace
        name = re.sub(r'["\']', '', name.strip())
        
        # Common name standardizations
        name_mappings = {
            'jeff epstein': 'Jeffrey Epstein',
            'jeffrey epstein': 'Jeffrey Epstein',
            'je': 'Jeffrey Epstein',
            'g maxwell': 'Ghislaine Maxwell',
            'g. maxwell': 'Ghislaine Maxwell',
            'ghislaine maxwell': 'Ghislaine Maxwell',
            'gm': 'Ghislaine Maxwell',
            'bill clinton': 'Bill Clinton',
            'william clinton': 'Bill Clinton',
            'president clinton': 'Bill Clinton',
            'wjc': 'Bill Clinton',
            'donald trump': 'Donald Trump',
            'd trump': 'Donald Trump',
            'dt': 'Donald Trump',
            'trump': 'Donald Trump',
            'prince andrew': 'Prince Andrew',
            'andrew windsor': 'Prince Andrew',
            'duke of york': 'Prince Andrew',
            'andrew': 'Prince Andrew',
            's kellen': 'Sarah Kellen',
            'sarah kellen': 'Sarah Kellen',
            'kellen': 'Sarah Kellen',
            'n marcinkova': 'Nadia Marcinkova',
            'nada marcinkova': 'Nadia Marcinkova',
            'nadia marcinkova': 'Nadia Marcinkova',
            'alan dershowitz': 'Alan Dershowitz',
            'dershowitz': 'Alan Dershowitz',
            'kevin spacey': 'Kevin Spacey',
            'spacey': 'Kevin Spacey',
            'chris tucker': 'Chris Tucker',
            'tucker': 'Chris Tucker',
            'glenn dubin': 'Glenn Dubin',
            'eva dubin': 'Eva Dubin',
            'celina dubin': 'Celina Dubin',
            'sophie biddle': 'Sophie Biddle',
            'a s': 'A S',
            'as': 'A S'
        }
        
        name_lower = name.lower()
        return name_mappings.get(name_lower, name)
    
    def find_or_create_passenger(self, name: str) -> str:
        """Find existing passenger or create new one"""
        if not name or name.strip() == '':
            return None
            
        cleaned_name = self.clean_passenger_name(name)
        cache_key = cleaned_name.lower()
        
        # Check cache first
        if cache_key in self.passenger_cache:
            return self.passenger_cache[cache_key]
        
        # Determine passenger metadata
        passenger_type, risk_level, verified = self._get_passenger_metadata(cleaned_name)
        
        # Split name into parts
        name_parts = cleaned_name.split()
        first_name = name_parts[0] if name_parts else cleaned_name
        last_name = name_parts[-1] if len(name_parts) > 1 else None
        
        # Insert new passenger
        try:
            self.cursor.execute("""
                INSERT INTO flight_data.passengers 
                (full_name, first_name, last_name, passenger_type, verified_identity, risk_level)
                VALUES (%s, %s, %s, %s, %s, %s)
                RETURNING id
            """, (cleaned_name, first_name, last_name, passenger_type, verified, risk_level))
            
            passenger_id = self.cursor.fetchone()['id']
            self.passenger_cache[cache_key] = passenger_id
            self.stats['passengers_created'] += 1
            
            logger.debug(f"Created passenger: {cleaned_name} ({passenger_id})")
            return passenger_id
            
        except Exception as e:
            logger.error(f"Failed to create passenger {cleaned_name}: {e}")
            self.stats['errors'] += 1
            return None
    
    def _get_passenger_metadata(self, name: str) -> Tuple[str, str, bool]:
        """Get passenger type, risk level, and verification status"""
        name_lower = name.lower()
        
        # High-profile suspects
        if name_lower in ['jeffrey epstein', 'ghislaine maxwell']:
            return 'suspect', 'critical', True
            
        # VIP passengers
        vip_names = ['donald trump', 'bill clinton', 'prince andrew', 'alan dershowitz']
        if any(vip in name_lower for vip in vip_names):
            return 'vip', 'high', True
            
        # Staff/associates
        staff_names = ['sarah kellen', 'nadia marcinkova']
        if any(staff in name_lower for staff in staff_names):
            return 'staff', 'medium', True
            
        # Celebrities
        celebrity_names = ['kevin spacey', 'chris tucker', 'naomi campbell']
        if any(celeb in name_lower for celeb in celebrity_names):
            return 'guest', 'low', True
            
        # Regular/unknown passengers
        return 'regular', 'unknown', False
    
    def find_or_create_location(self, airport_code: str) -> str:
        """Find existing location or create new one"""
        if not airport_code or airport_code.strip() == '':
            return None
            
        code = airport_code.upper().strip()
        
        # Check cache first
        if code in self.location_cache:
            return self.location_cache[code]
        
        # Create new location with minimal data
        try:
            self.cursor.execute("""
                INSERT INTO flight_data.locations 
                (airport_code, airport_name, city, country, facility_type)
                VALUES (%s, %s, %s, %s, %s)
                RETURNING id
            """, (code, f'Unknown Airport - {code}', 'Unknown', 'US', 'unknown'))
            
            location_id = self.cursor.fetchone()['id']
            self.location_cache[code] = location_id
            self.stats['locations_created'] += 1
            
            logger.debug(f"Created location: {code} ({location_id})")
            return location_id
            
        except Exception as e:
            logger.error(f"Failed to create location {code}: {e}")
            self.stats['errors'] += 1
            return None
    
    def parse_passengers(self, passengers_str: str) -> List[str]:
        """Parse passenger string into list of names"""
        if not passengers_str or passengers_str.strip() == '':
            return []
        
        # Split by comma and clean each name
        passengers = []
        for name in passengers_str.split(','):
            cleaned = self.clean_passenger_name(name)
            if cleaned and cleaned.strip() != '':
                passengers.append(cleaned)
        
        return passengers
    
    def import_flight(self, flight_data: Dict) -> bool:
        """Import a single flight record"""
        try:
            # Parse date
            flight_date = self.parse_date(flight_data.get('Date', ''))
            if not flight_date:
                logger.warning(f"Skipping flight with invalid date: {flight_data}")
                return False
            
            # Get locations
            departure_id = self.find_or_create_location(flight_data.get('Departure_Code', ''))
            arrival_id = self.find_or_create_location(flight_data.get('Arrival_Code', ''))
            
            if not departure_id or not arrival_id:
                logger.warning(f"Skipping flight with invalid locations: {flight_data}")
                return False
            
            # Get default aircraft (N908JE - Lolita Express)
            aircraft_id = self.aircraft_cache.get('N908JE')
            
            # Parse passengers
            passengers = self.parse_passengers(flight_data.get('Passengers', ''))
            
            # Insert flight
            self.cursor.execute("""
                INSERT INTO flight_data.flights 
                (flight_number, aircraft_id, departure_location_id, arrival_location_id, 
                 flight_date, passenger_count, manifest_id, source_document, data_quality)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
                RETURNING id
            """, (
                flight_data.get('Flight_No', ''),
                aircraft_id,
                departure_id,
                arrival_id,
                flight_date,
                len(passengers),
                f"CSV_IMPORT_{flight_data.get('Flight_No', '')}_{flight_date}",
                'flight_flights_table.csv',
                'standard'
            ))
            
            flight_id = self.cursor.fetchone()['id']
            
            # Insert passengers
            for passenger_name in passengers:
                passenger_id = self.find_or_create_passenger(passenger_name)
                if passenger_id:
                    self.cursor.execute("""
                        INSERT INTO flight_data.flight_passengers 
                        (flight_id, passenger_id, passenger_role, name_in_manifest)
                        VALUES (%s, %s, %s, %s)
                    """, (flight_id, passenger_id, 'passenger', passenger_name))
            
            self.stats['flights_imported'] += 1
            
            if self.stats['flights_imported'] % 100 == 0:
                logger.info(f"Imported {self.stats['flights_imported']} flights...")
            
            return True
            
        except Exception as e:
            logger.error(f"Failed to import flight {flight_data}: {e}")
            self.stats['errors'] += 1
            return False
    
    def import_csv_file(self, csv_file_path: str):
        """Import all flights from CSV file"""
        if not os.path.exists(csv_file_path):
            raise FileNotFoundError(f"CSV file not found: {csv_file_path}")
        
        logger.info(f"Starting import from {csv_file_path}")
        
        with open(csv_file_path, 'r', encoding='utf-8') as csvfile:
            # Try to detect delimiter
            sample = csvfile.read(1024)
            csvfile.seek(0)
            
            sniffer = csv.Sniffer()
            delimiter = sniffer.sniff(sample).delimiter
            
            reader = csv.DictReader(csvfile, delimiter=delimiter)
            
            for row in reader:
                self.import_flight(row)
                
                # Commit periodically
                if self.stats['flights_imported'] % 50 == 0:
                    self.connection.commit()
        
        # Final commit
        self.connection.commit()
        logger.info("All flights imported and committed to database")
    
    def analyze_and_create_connections(self):
        """Analyze flight data and create passenger connections"""
        logger.info("Analyzing passenger connections...")
        
        try:
            # Create connections based on shared flights
            self.cursor.execute("""
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
                    LEAST(10, shared_flights * 2),
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
                        AND fp1.passenger_id < fp2.passenger_id
                    JOIN flight_data.flights f ON fp1.flight_id = f.id
                    GROUP BY fp1.passenger_id, fp2.passenger_id
                    HAVING COUNT(*) > 1
                ) shared_flight_data
                JOIN flight_data.passengers p1 ON shared_flight_data.passenger1_id = p1.id
                JOIN flight_data.passengers p2 ON shared_flight_data.passenger2_id = p2.id
                ON CONFLICT (passenger1_id, passenger2_id) DO UPDATE SET
                    shared_flights_count = EXCLUDED.shared_flights_count,
                    connection_strength = EXCLUDED.connection_strength,
                    last_documented_interaction = EXCLUDED.last_documented_interaction;
            """)
            
            self.stats['connections_created'] = self.cursor.rowcount
            self.connection.commit()
            
            logger.info(f"Created {self.stats['connections_created']} passenger connections")
            
        except Exception as e:
            logger.error(f"Failed to create connections: {e}")
            self.stats['errors'] += 1
    
    def create_flight_patterns(self):
        """Analyze and create flight pattern records"""
        logger.info("Analyzing flight patterns...")
        
        try:
            self.cursor.execute("""
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
            """)
            
            patterns_created = self.cursor.rowcount
            self.connection.commit()
            
            logger.info(f"Created {patterns_created} flight patterns")
            
        except Exception as e:
            logger.error(f"Failed to create flight patterns: {e}")
            self.stats['errors'] += 1
    
    def print_import_summary(self):
        """Print import statistics"""
        logger.info("="*50)
        logger.info("FLIGHT DATA IMPORT SUMMARY")
        logger.info("="*50)
        logger.info(f"Flights Imported: {self.stats['flights_imported']}")
        logger.info(f"Passengers Created: {self.stats['passengers_created']}")
        logger.info(f"Locations Created: {self.stats['locations_created']}")
        logger.info(f"Connections Created: {self.stats['connections_created']}")
        logger.info(f"Errors Encountered: {self.stats['errors']}")
        logger.info("="*50)
    
    def close_connection(self):
        """Close database connection"""
        if self.cursor:
            self.cursor.close()
        if self.connection:
            self.connection.close()
        logger.info("Database connection closed")

def main():
    """Main import function"""
    # Database configuration
    db_config = {
        'host': os.getenv('DATABASE_HOST', 'localhost'),
        'port': os.getenv('DATABASE_PORT', 5432),
        'database': os.getenv('DATABASE_NAME', 'creepstate_flights_db'),
        'user': os.getenv('DATABASE_USER', 'flight_admin'),
        'password': os.getenv('DATABASE_PASSWORD', 'secure_admin_pass_2024!')
    }
    
    # CSV file path
    csv_file = os.path.join(
        os.path.dirname(os.path.dirname(__file__)), 
        'flight_flights_table.csv'
    )
    
    # Create importer and run import
    importer = FlightDataImporter(db_config)
    
    try:
        importer.connect_database()
        importer.import_csv_file(csv_file)
        importer.analyze_and_create_connections()
        importer.create_flight_patterns()
        importer.print_import_summary()
        
    except Exception as e:
        logger.error(f"Import failed: {e}")
        raise
    finally:
        importer.close_connection()

if __name__ == "__main__":
    main()