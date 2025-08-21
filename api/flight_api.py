#!/usr/bin/env python3
"""
Flight Logs API Server for Trumpstein Timeline
FastAPI backend for flight data analysis and investigation
"""

import os
import logging
import json
from datetime import datetime, date
from typing import List, Dict, Optional, Any, Union
from uuid import UUID

import psycopg2
from psycopg2.extras import RealDictCursor, Json
from fastapi import FastAPI, HTTPException, Query, Depends, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel, Field
import uvicorn

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Pydantic models for request/response
class FlightSearchParams(BaseModel):
    passenger_name: Optional[str] = None
    airport_code: Optional[str] = None
    date_from: Optional[date] = None
    date_to: Optional[date] = None
    aircraft_filter: Optional[str] = None
    departure_filter: Optional[str] = None
    arrival_filter: Optional[str] = None
    year_filter: Optional[int] = None
    month_filter: Optional[int] = None
    passenger_count_filter: Optional[str] = None
    selected_passengers: Optional[List[str]] = []
    limit: Optional[int] = 100
    offset: Optional[int] = 0

class ConnectionSearchParams(BaseModel):
    passenger1: str
    passenger2: str

class FlightResponse(BaseModel):
    id: str
    flight_number: Optional[str]
    flight_date: date
    departure_code: Optional[str]
    departure_name: Optional[str]
    arrival_code: Optional[str]
    arrival_name: Optional[str]
    aircraft_model: Optional[str]
    passenger_count: int
    passengers: List[Dict[str, Any]]

class PassengerResponse(BaseModel):
    id: str
    full_name: str
    passenger_type: str
    risk_level: str
    flight_count: int

class ConnectionResponse(BaseModel):
    id: str
    passenger1_name: str
    passenger2_name: str
    connection_type: str
    connection_strength: int
    shared_flights_count: int
    first_documented_interaction: Optional[date]
    last_documented_interaction: Optional[date]

class InvestigationResponse(BaseModel):
    passenger_name: str
    total_flights: int
    unique_destinations: int
    most_frequent_departure: Optional[str]
    most_frequent_arrival: Optional[str]
    travel_frequency_per_month: float
    frequent_companions: List[str]
    shared_flights: List[Dict[str, Any]]

# Database connection manager
class DatabaseManager:
    def __init__(self):
        self.connection = None
        self.db_config = {
            'host': os.getenv('DATABASE_HOST', 'postgres'),
            'port': int(os.getenv('DATABASE_PORT', 5432)),
            'database': os.getenv('DATABASE_NAME', 'trumpstein_flights_db'),
            'user': os.getenv('DATABASE_USER', 'flight_admin'),
            'password': os.getenv('DATABASE_PASSWORD', 'secure_admin_pass_2024!')
        }
    
    def connect(self):
        """Establish database connection"""
        try:
            self.connection = psycopg2.connect(**self.db_config)
            logger.info("Connected to PostgreSQL database")
        except Exception as e:
            logger.error(f"Failed to connect to database: {e}")
            raise HTTPException(status_code=500, detail="Database connection failed")
    
    def get_cursor(self):
        """Get database cursor"""
        if not self.connection or self.connection.closed:
            self.connect()
        return self.connection.cursor(cursor_factory=RealDictCursor)
    
    def close(self):
        """Close database connection"""
        if self.connection:
            self.connection.close()

# Global database manager
db_manager = DatabaseManager()

# Custom JSON encoder for UUID and date objects
class CustomJSONEncoder:
    @staticmethod
    def default(obj):
        if isinstance(obj, UUID):
            return str(obj)
        elif isinstance(obj, (datetime, date)):
            return obj.isoformat()
        raise TypeError(f"Object of type {type(obj)} is not JSON serializable")

# FastAPI app configuration
app = FastAPI(
    title="Trumpstein Flight Logs API",
    description="Investigative analysis API for Epstein flight logs",
    version="1.0.0",
    docs_url="/api/docs",
    redoc_url="/api/redoc"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify actual origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Security audit logging
async def log_api_access(request: Request, action: str, resource_type: str = None, resource_id: str = None):
    """Log API access for security audit"""
    try:
        cursor = db_manager.get_cursor()
        cursor.execute("""
            SELECT security_audit.log_user_access(%s, %s, %s, %s, %s, %s)
        """, (
            request.client.host,  # Using IP as user_id for now
            action,
            resource_type,
            resource_id,
            request.client.host,
            request.headers.get('user-agent', 'Unknown')
        ))
        db_manager.connection.commit()
    except Exception as e:
        logger.warning(f"Failed to log API access: {e}")

@app.on_event("startup")
async def startup_event():
    """Initialize database connection on startup"""
    db_manager.connect()
    logger.info("Flight Logs API server started")

@app.on_event("shutdown")
async def shutdown_event():
    """Clean up database connection on shutdown"""
    db_manager.close()
    logger.info("Flight Logs API server stopped")

# Health check endpoint
@app.get("/api/health")
async def health_check():
    """Health check endpoint"""
    try:
        cursor = db_manager.get_cursor()
        cursor.execute("SELECT 1")
        return {"status": "healthy", "database": "connected"}
    except Exception as e:
        logger.error(f"Health check failed: {e}")
        raise HTTPException(status_code=503, detail="Service unavailable")

# Statistics endpoints
@app.get("/api/stats/overview")
async def get_overview_stats(request: Request):
    """Get overview statistics"""
    await log_api_access(request, "get_overview_stats", "statistics")
    
    try:
        cursor = db_manager.get_cursor()
        
        # Get basic counts
        cursor.execute("""
            SELECT 
                (SELECT COUNT(*) FROM flight_data.flights) as total_flights,
                (SELECT COUNT(DISTINCT passenger_id) FROM flight_data.flight_passengers) as total_passengers,
                (SELECT COUNT(DISTINCT departure_location_id || '-' || arrival_location_id) 
                 FROM flight_data.flights) as total_routes,
                (SELECT MIN(flight_date) FROM flight_data.flights) as earliest_flight,
                (SELECT MAX(flight_date) FROM flight_data.flights) as latest_flight,
                (SELECT COUNT(*) FROM investigation.passenger_connections) as total_connections
        """)
        
        stats = cursor.fetchone()
        
        return {
            "total_flights": stats['total_flights'],
            "total_passengers": stats['total_passengers'],
            "total_routes": stats['total_routes'],
            "date_range_start": stats['earliest_flight'].isoformat() if stats['earliest_flight'] else None,
            "date_range_end": stats['latest_flight'].isoformat() if stats['latest_flight'] else None,
            "total_connections": stats['total_connections']
        }
        
    except Exception as e:
        logger.error(f"Failed to get overview stats: {e}")
        raise HTTPException(status_code=500, detail="Failed to retrieve statistics")

@app.get("/api/stats/passengers/top")
async def get_top_passengers(request: Request, limit: int = 15):
    """Get top passengers by flight count"""
    await log_api_access(request, "get_top_passengers", "statistics")
    
    try:
        cursor = db_manager.get_cursor()
        cursor.execute("""
            SELECT 
                p.full_name,
                p.passenger_type,
                p.risk_level,
                COUNT(fp.flight_id) as flight_count
            FROM flight_data.passengers p
            JOIN flight_data.flight_passengers fp ON p.id = fp.passenger_id
            GROUP BY p.id, p.full_name, p.passenger_type, p.risk_level
            ORDER BY flight_count DESC
            LIMIT %s
        """, (limit,))
        
        passengers = []
        for row in cursor.fetchall():
            passengers.append({
                "name": row['full_name'],
                "type": row['passenger_type'],
                "risk_level": row['risk_level'],
                "flight_count": row['flight_count']
            })
        
        return {"passengers": passengers}
        
    except Exception as e:
        logger.error(f"Failed to get top passengers: {e}")
        raise HTTPException(status_code=500, detail="Failed to retrieve top passengers")

@app.get("/api/stats/routes/top")
async def get_top_routes(request: Request, limit: int = 10):
    """Get most frequent routes"""
    await log_api_access(request, "get_top_routes", "statistics")
    
    try:
        cursor = db_manager.get_cursor()
        cursor.execute("""
            SELECT * FROM investigation.route_frequency
            ORDER BY flight_count DESC
            LIMIT %s
        """, (limit,))
        
        routes = []
        for row in cursor.fetchall():
            routes.append({
                "route": f"{row['departure_code']} → {row['arrival_code']}",
                "departure_location": row['departure_location'],
                "arrival_location": row['arrival_location'],
                "flight_count": row['flight_count'],
                "first_flight": row['first_flight'].isoformat() if row['first_flight'] else None,
                "last_flight": row['last_flight'].isoformat() if row['last_flight'] else None,
                "aircraft_used": row['aircraft_used'] or []
            })
        
        return {"routes": routes}
        
    except Exception as e:
        logger.error(f"Failed to get top routes: {e}")
        raise HTTPException(status_code=500, detail="Failed to retrieve top routes")

# Flight search endpoint
@app.post("/api/flights/search")
async def search_flights(search_params: FlightSearchParams, request: Request):
    """Search flights with advanced filters"""
    await log_api_access(request, "search_flights", "flights")
    
    try:
        cursor = db_manager.get_cursor()
        
        # Build dynamic query
        where_conditions = []
        query_params = []
        
        # Base query
        query = """
            SELECT DISTINCT
                f.id,
                f.flight_number,
                f.flight_date,
                f.passenger_count,
                dl.airport_code as departure_code,
                dl.airport_name as departure_name,
                al.airport_code as arrival_code,
                al.airport_name as arrival_name,
                a.model as aircraft_model,
                array_agg(DISTINCT p.full_name) as passengers
            FROM investigation.flight_details f
            LEFT JOIN flight_data.aircraft a ON a.tail_number = f.tail_number
            LEFT JOIN flight_data.flight_passengers fp ON f.id = fp.flight_id
            LEFT JOIN flight_data.passengers p ON fp.passenger_id = p.id
            LEFT JOIN flight_data.locations dl ON dl.airport_code = f.departure_code
            LEFT JOIN flight_data.locations al ON al.airport_code = f.arrival_code
        """
        
        # Add filters
        if search_params.passenger_name:
            where_conditions.append("p.full_name ILIKE %s")
            query_params.append(f"%{search_params.passenger_name}%")
        
        if search_params.airport_code:
            where_conditions.append("(f.departure_code ILIKE %s OR f.arrival_code ILIKE %s)")
            query_params.extend([f"%{search_params.airport_code}%", f"%{search_params.airport_code}%"])
        
        if search_params.date_from:
            where_conditions.append("f.flight_date >= %s")
            query_params.append(search_params.date_from)
        
        if search_params.date_to:
            where_conditions.append("f.flight_date <= %s")
            query_params.append(search_params.date_to)
        
        if search_params.departure_filter and search_params.departure_filter != 'all':
            where_conditions.append("f.departure_code = %s")
            query_params.append(search_params.departure_filter)
        
        if search_params.arrival_filter and search_params.arrival_filter != 'all':
            where_conditions.append("f.arrival_code = %s")
            query_params.append(search_params.arrival_filter)
        
        if search_params.year_filter:
            where_conditions.append("EXTRACT(YEAR FROM f.flight_date) = %s")
            query_params.append(search_params.year_filter)
        
        if search_params.month_filter:
            where_conditions.append("EXTRACT(MONTH FROM f.flight_date) = %s")
            query_params.append(search_params.month_filter)
        
        if search_params.selected_passengers:
            passenger_conditions = []
            for passenger in search_params.selected_passengers:
                passenger_conditions.append("p.full_name ILIKE %s")
                query_params.append(f"%{passenger}%")
            if passenger_conditions:
                where_conditions.append(f"({' OR '.join(passenger_conditions)})")
        
        # Add WHERE clause if we have conditions
        if where_conditions:
            query += " WHERE " + " AND ".join(where_conditions)
        
        # Group by and order
        query += """
            GROUP BY f.id, f.flight_number, f.flight_date, f.passenger_count,
                     dl.airport_code, dl.airport_name, al.airport_code, al.airport_name, a.model
            ORDER BY f.flight_date DESC
        """
        
        # Add pagination
        query += " LIMIT %s OFFSET %s"
        query_params.extend([search_params.limit, search_params.offset])
        
        cursor.execute(query, query_params)
        flights = []
        
        for row in cursor.fetchall():
            flight_data = {
                "id": str(row['id']),
                "flight_number": row['flight_number'],
                "flight_date": row['flight_date'].isoformat(),
                "departure_code": row['departure_code'],
                "departure_name": row['departure_name'],
                "arrival_code": row['arrival_code'],
                "arrival_name": row['arrival_name'],
                "aircraft_model": row['aircraft_model'],
                "passenger_count": row['passenger_count'],
                "passengers": row['passengers'] or []
            }
            flights.append(flight_data)
        
        return {"flights": flights, "total_count": len(flights)}
        
    except Exception as e:
        logger.error(f"Failed to search flights: {e}")
        raise HTTPException(status_code=500, detail="Failed to search flights")

# Passenger investigation endpoint
@app.get("/api/investigation/passenger/{passenger_name}")
async def investigate_passenger(passenger_name: str, request: Request):
    """Get comprehensive investigation data for a passenger"""
    await log_api_access(request, "investigate_passenger", "investigation", passenger_name)
    
    try:
        cursor = db_manager.get_cursor()
        
        # Get travel pattern analysis
        cursor.execute("""
            SELECT * FROM investigation.analyze_travel_pattern(%s)
        """, (passenger_name,))
        
        analysis = cursor.fetchone()
        
        # Get shared flights with other passengers
        cursor.execute("""
            SELECT 
                p1.full_name as passenger1,
                p2.full_name as passenger2,
                COUNT(*) as shared_flights,
                array_agg(DISTINCT f.flight_number ORDER BY f.flight_date) as flight_numbers,
                MIN(f.flight_date) as first_flight,
                MAX(f.flight_date) as last_flight
            FROM flight_data.flight_passengers fp1
            JOIN flight_data.flight_passengers fp2 ON fp1.flight_id = fp2.flight_id
            JOIN flight_data.passengers p1 ON fp1.passenger_id = p1.id
            JOIN flight_data.passengers p2 ON fp2.passenger_id = p2.id
            JOIN flight_data.flights f ON fp1.flight_id = f.id
            WHERE p1.full_name ILIKE %s AND p1.id != p2.id
            GROUP BY p1.id, p1.full_name, p2.id, p2.full_name
            HAVING COUNT(*) > 1
            ORDER BY shared_flights DESC
            LIMIT 20
        """, (f"%{passenger_name}%",))
        
        shared_flights = []
        for row in cursor.fetchall():
            shared_flights.append({
                "companion": row['passenger2'],
                "shared_flights_count": row['shared_flights'],
                "flight_numbers": row['flight_numbers'] or [],
                "first_flight": row['first_flight'].isoformat() if row['first_flight'] else None,
                "last_flight": row['last_flight'].isoformat() if row['last_flight'] else None
            })
        
        if not analysis:
            return {"error": f"No flight data found for passenger: {passenger_name}"}
        
        return {
            "passenger_name": passenger_name,
            "total_flights": analysis['total_flights'],
            "unique_destinations": analysis['unique_destinations'],
            "most_frequent_departure": analysis['most_frequent_departure'],
            "most_frequent_arrival": analysis['most_frequent_arrival'],
            "travel_frequency_per_month": float(analysis['travel_frequency_per_month']) if analysis['travel_frequency_per_month'] else 0,
            "frequent_companions": analysis['frequent_companions'] or [],
            "shared_flights": shared_flights
        }
        
    except Exception as e:
        logger.error(f"Failed to investigate passenger {passenger_name}: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to investigate passenger: {passenger_name}")

# Connection analysis endpoint
@app.post("/api/investigation/connections")
async def find_connections(connection_params: ConnectionSearchParams, request: Request):
    """Find connections between two passengers"""
    await log_api_access(request, "find_connections", "investigation")
    
    try:
        cursor = db_manager.get_cursor()
        
        # Use the database function to find shared flights
        cursor.execute("""
            SELECT * FROM investigation.find_shared_flights(%s, %s)
        """, (connection_params.passenger1, connection_params.passenger2))
        
        shared_flights = []
        for row in cursor.fetchall():
            shared_flights.append({
                "flight_id": str(row['flight_id']),
                "flight_number": row['flight_number'],
                "flight_date": row['flight_date'].isoformat(),
                "departure_code": row['departure_code'],
                "arrival_code": row['arrival_code'],
                "other_passengers": row['other_passengers'] or []
            })
        
        # Get connection strength from database
        cursor.execute("""
            SELECT connection_strength, shared_flights_count, connection_type,
                   first_documented_interaction, last_documented_interaction
            FROM investigation.passenger_connections pc
            JOIN flight_data.passengers p1 ON pc.passenger1_id = p1.id
            JOIN flight_data.passengers p2 ON pc.passenger2_id = p2.id
            WHERE (p1.full_name ILIKE %s AND p2.full_name ILIKE %s)
               OR (p1.full_name ILIKE %s AND p2.full_name ILIKE %s)
        """, (f"%{connection_params.passenger1}%", f"%{connection_params.passenger2}%",
              f"%{connection_params.passenger2}%", f"%{connection_params.passenger1}%"))
        
        connection_data = cursor.fetchone()
        
        return {
            "passenger1": connection_params.passenger1,
            "passenger2": connection_params.passenger2,
            "shared_flights": shared_flights,
            "connection_strength": connection_data['connection_strength'] if connection_data else 0,
            "total_shared_flights": len(shared_flights),
            "connection_type": connection_data['connection_type'] if connection_data else 'unknown',
            "first_interaction": connection_data['first_documented_interaction'].isoformat() if connection_data and connection_data['first_documented_interaction'] else None,
            "last_interaction": connection_data['last_documented_interaction'].isoformat() if connection_data and connection_data['last_documented_interaction'] else None
        }
        
    except Exception as e:
        logger.error(f"Failed to find connections: {e}")
        raise HTTPException(status_code=500, detail="Failed to analyze connections")

# Export endpoint
@app.get("/api/export/flights")
async def export_flights(
    request: Request,
    format: str = Query("csv", description="Export format: csv, json"),
    passenger_filter: Optional[str] = Query(None),
    date_from: Optional[date] = Query(None),
    date_to: Optional[date] = Query(None)
):
    """Export flight data with filters"""
    await log_api_access(request, "export_flights", "export")
    
    try:
        cursor = db_manager.get_cursor()
        
        # Log export action
        cursor.execute("""
            INSERT INTO security_audit.export_log 
            (user_id, export_type, exported_tables, filter_criteria, export_purpose, ip_address)
            VALUES (%s, %s, %s, %s, %s, %s)
        """, (
            request.client.host,
            format,
            ['flights', 'passengers'],
            json.dumps({
                "passenger_filter": passenger_filter,
                "date_from": date_from.isoformat() if date_from else None,
                "date_to": date_to.isoformat() if date_to else None
            }),
            "Data export via API",
            request.client.host
        ))
        
        # Build export query with filters
        query = """
            SELECT 
                f.flight_date,
                f.flight_number,
                f.departure_code,
                f.arrival_code,
                f.departure_name,
                f.arrival_name,
                f.aircraft_model,
                string_agg(DISTINCT p.full_name, ', ' ORDER BY p.full_name) as passengers
            FROM investigation.flight_details f
            LEFT JOIN flight_data.flight_passengers fp ON f.id = fp.flight_id
            LEFT JOIN flight_data.passengers p ON fp.passenger_id = p.id
        """
        
        where_conditions = []
        query_params = []
        
        if passenger_filter:
            where_conditions.append("p.full_name ILIKE %s")
            query_params.append(f"%{passenger_filter}%")
        
        if date_from:
            where_conditions.append("f.flight_date >= %s")
            query_params.append(date_from)
        
        if date_to:
            where_conditions.append("f.flight_date <= %s")
            query_params.append(date_to)
        
        if where_conditions:
            query += " WHERE " + " AND ".join(where_conditions)
        
        query += """
            GROUP BY f.flight_date, f.flight_number, f.departure_code, f.arrival_code,
                     f.departure_name, f.arrival_name, f.aircraft_model
            ORDER BY f.flight_date DESC
        """
        
        cursor.execute(query, query_params)
        flights = cursor.fetchall()
        
        # Convert to list of dictionaries
        export_data = []
        for row in flights:
            export_data.append(dict(row))
        
        # Update export log with record count
        cursor.execute("""
            UPDATE security_audit.export_log 
            SET record_count = %s 
            WHERE user_id = %s AND timestamp = (
                SELECT MAX(timestamp) FROM security_audit.export_log WHERE user_id = %s
            )
        """, (len(export_data), request.client.host, request.client.host))
        
        db_manager.connection.commit()
        
        if format == "json":
            return {"data": export_data, "count": len(export_data)}
        else:
            # For CSV, return structured data that can be processed by frontend
            return {
                "data": export_data,
                "count": len(export_data),
                "headers": ["flight_date", "flight_number", "departure_code", "arrival_code", 
                           "departure_name", "arrival_name", "aircraft_model", "passengers"]
            }
        
    except Exception as e:
        logger.error(f"Failed to export flights: {e}")
        raise HTTPException(status_code=500, detail="Failed to export flight data")

# Timeline integration endpoint
@app.get("/api/timeline/events")
async def get_timeline_events(
    request: Request,
    date_from: Optional[date] = Query(None),
    date_to: Optional[date] = Query(None),
    passenger_filter: Optional[str] = Query(None)
):
    """Get timeline events for cross-referencing with flights"""
    await log_api_access(request, "get_timeline_events", "timeline")
    
    try:
        cursor = db_manager.get_cursor()
        
        query = """
            SELECT 
                te.id,
                te.event_date,
                te.event_title,
                te.event_description,
                te.event_type,
                te.significance_level,
                array_agg(DISTINCT p.full_name) FILTER (WHERE p.full_name IS NOT NULL) as participants
            FROM investigation.timeline_events te
            LEFT JOIN flight_data.passengers p ON p.id = ANY(te.participants)
        """
        
        where_conditions = []
        query_params = []
        
        if date_from:
            where_conditions.append("te.event_date >= %s")
            query_params.append(date_from)
        
        if date_to:
            where_conditions.append("te.event_date <= %s")
            query_params.append(date_to)
        
        if passenger_filter:
            where_conditions.append("p.full_name ILIKE %s")
            query_params.append(f"%{passenger_filter}%")
        
        if where_conditions:
            query += " WHERE " + " AND ".join(where_conditions)
        
        query += """
            GROUP BY te.id, te.event_date, te.event_title, te.event_description, te.event_type, te.significance_level
            ORDER BY te.event_date DESC
        """
        
        cursor.execute(query, query_params)
        events = []
        
        for row in cursor.fetchall():
            events.append({
                "id": str(row['id']),
                "date": row['event_date'].isoformat(),
                "title": row['event_title'],
                "description": row['event_description'],
                "type": row['event_type'],
                "significance": row['significance_level'],
                "participants": row['participants'] or []
            })
        
        return {"events": events}
        
    except Exception as e:
        logger.error(f"Failed to get timeline events: {e}")
        raise HTTPException(status_code=500, detail="Failed to retrieve timeline events")

# Development server configuration
if __name__ == "__main__":
    uvicorn.run(
        "flight_api:app",
        host="0.0.0.0",
        port=int(os.getenv("API_PORT", 8848)),
        reload=os.getenv("NODE_ENV") != "production",
        log_level="info"
    )