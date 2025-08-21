#!/bin/bash

# Database Initialization Script for Trumpstein Timeline
# Waits for PostgreSQL to be ready and imports flight data

set -e

echo "🔄 Initializing Trumpstein Flight Logs Database..."

# Database connection parameters
DB_HOST=${DATABASE_HOST:-postgres}
DB_PORT=${DATABASE_PORT:-5432}
DB_NAME=${DATABASE_NAME:-trumpstein_flights_db}
DB_USER=${DATABASE_USER:-flight_admin}
DB_PASSWORD=${DATABASE_PASSWORD:-secure_admin_pass_2024!}

# Maximum wait time (5 minutes)
MAX_WAIT=300
WAIT_TIME=0

echo "⏳ Waiting for PostgreSQL to be ready..."

# Function to check if PostgreSQL is ready
check_postgres() {
    PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d postgres -c "SELECT 1;" > /dev/null 2>&1
}

# Wait for PostgreSQL to be available
while ! check_postgres && [ $WAIT_TIME -lt $MAX_WAIT ]; do
    echo "   PostgreSQL not ready yet. Waiting... ($WAIT_TIME/$MAX_WAIT seconds)"
    sleep 5
    WAIT_TIME=$((WAIT_TIME + 5))
done

if [ $WAIT_TIME -ge $MAX_WAIT ]; then
    echo "❌ Timeout waiting for PostgreSQL to be ready"
    exit 1
fi

echo "✅ PostgreSQL is ready!"

# Check if database exists and has data
echo "🔍 Checking database state..."

DB_EXISTS=$(PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d postgres -tAc "SELECT 1 FROM pg_database WHERE datname='$DB_NAME';" || echo "")

if [ -z "$DB_EXISTS" ]; then
    echo "❌ Database $DB_NAME does not exist!"
    exit 1
fi

echo "✅ Database $DB_NAME exists"

# Check if tables exist
TABLES_EXIST=$(PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -tAc "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema='flight_data';" 2>/dev/null || echo "0")

if [ "$TABLES_EXIST" -eq "0" ]; then
    echo "❌ Database tables do not exist!"
    exit 1
fi

echo "✅ Database schema exists ($TABLES_EXIST tables in flight_data schema)"

# Check if data exists
FLIGHT_COUNT=$(PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -tAc "SELECT COUNT(*) FROM flight_data.flights;" 2>/dev/null || echo "0")

echo "📊 Current flight count: $FLIGHT_COUNT"

if [ "$FLIGHT_COUNT" -eq "0" ]; then
    echo "📥 No flight data found. Starting CSV import..."
    
    # Change to script directory
    cd "$(dirname "$0")"
    
    # Check if CSV file exists
    CSV_FILE="../flight_flights_table.csv"
    if [ ! -f "$CSV_FILE" ]; then
        echo "❌ CSV file not found: $CSV_FILE"
        exit 1
    fi
    
    echo "📊 Found CSV file: $CSV_FILE"
    
    # Import data using Python script
    export DATABASE_HOST=$DB_HOST
    export DATABASE_PORT=$DB_PORT
    export DATABASE_NAME=$DB_NAME
    export DATABASE_USER=$DB_USER
    export DATABASE_PASSWORD=$DB_PASSWORD
    
    echo "🚀 Starting flight data import..."
    
    if python3 import_csv_data.py; then
        echo "✅ Flight data import completed successfully!"
        
        # Get final count
        FINAL_COUNT=$(PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -tAc "SELECT COUNT(*) FROM flight_data.flights;" 2>/dev/null || echo "0")
        PASSENGER_COUNT=$(PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -tAc "SELECT COUNT(*) FROM flight_data.passengers;" 2>/dev/null || echo "0")
        CONNECTION_COUNT=$(PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -tAc "SELECT COUNT(*) FROM investigation.passenger_connections;" 2>/dev/null || echo "0")
        
        echo "════════════════════════════════════"
        echo "📈 IMPORT SUMMARY"
        echo "════════════════════════════════════"
        echo "✈️  Flights imported: $FINAL_COUNT"
        echo "👥 Passengers: $PASSENGER_COUNT"
        echo "🔗 Connections: $CONNECTION_COUNT"
        echo "════════════════════════════════════"
    else
        echo "❌ Flight data import failed!"
        exit 1
    fi
else
    echo "✅ Flight data already exists ($FLIGHT_COUNT flights)"
fi

# Create database health check
echo "🏥 Performing database health check..."

HEALTH_QUERY="
SELECT 
    'Flights' as table_name, COUNT(*) as record_count 
FROM flight_data.flights
UNION ALL
SELECT 
    'Passengers', COUNT(*) 
FROM flight_data.passengers
UNION ALL
SELECT 
    'Flight-Passengers', COUNT(*) 
FROM flight_data.flight_passengers
UNION ALL
SELECT 
    'Connections', COUNT(*) 
FROM investigation.passenger_connections
UNION ALL
SELECT 
    'Timeline Events', COUNT(*) 
FROM investigation.timeline_events;
"

echo "📊 Database Health Report:"
PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -c "$HEALTH_QUERY" || {
    echo "❌ Health check failed!"
    exit 1
}

# Test key database functions
echo "🧪 Testing database functions..."

# Test passenger search function
SEARCH_TEST=$(PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -tAc "SELECT COUNT(*) FROM investigation.analyze_travel_pattern('Jeffrey Epstein');" 2>/dev/null || echo "0")

if [ "$SEARCH_TEST" -gt "0" ]; then
    echo "✅ Database functions are working correctly"
else
    echo "⚠️  Database functions may have issues, but continuing..."
fi

# Set up database optimization
echo "⚙️  Running database optimization..."

PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -c "
-- Update table statistics
ANALYZE flight_data.flights;
ANALYZE flight_data.passengers;
ANALYZE flight_data.flight_passengers;
ANALYZE investigation.passenger_connections;

-- Vacuum for performance
VACUUM ANALYZE;
" > /dev/null 2>&1 || echo "⚠️  Optimization commands had issues, but continuing..."

echo "🎉 Database initialization completed successfully!"
echo ""
echo "🌐 Services should now be available at:"
echo "   - Web Interface: http://localhost:8847"
echo "   - API Docs: http://localhost:8847/api/docs"
echo "   - PgAdmin: http://localhost:8080"
echo ""
echo "🔐 Default credentials:"
echo "   - PgAdmin: admin@creepstate.local / secure_pgadmin_pass_2024!"
echo "   - Database: flight_admin / secure_admin_pass_2024!"
echo ""
echo "✅ Ready for investigative analysis!"