# Multi-stage build: Python API backend + Nginx frontend
FROM python:3.11-slim as api-build

# Install system dependencies for PostgreSQL
RUN apt-get update && apt-get install -y \
    libpq-dev \
    gcc \
    && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy Python requirements and install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy API files
COPY api/ ./api/
COPY scripts/ ./scripts/

# Frontend stage
FROM nginx:alpine as frontend

# Install curl for health checks
RUN apk add --no-cache curl python3 py3-pip

# Install Python dependencies for the API server in nginx container
RUN pip3 install --break-system-packages \
    fastapi==0.104.1 \
    uvicorn==0.24.0 \
    psycopg2-binary==2.9.9 \
    pydantic==2.5.2 \
    python-dateutil==2.8.2

# Copy timeline files to nginx html directory
COPY index.html /usr/share/nginx/html/
COPY timeline.html /usr/share/nginx/html/
COPY enhanced-visualizations.html /usr/share/nginx/html/
COPY slideshow-timeline.html /usr/share/nginx/html/
COPY documentation.html /usr/share/nginx/html/
COPY stats.html /usr/share/nginx/html/
COPY resources.html /usr/share/nginx/html/
COPY names-and-shame.html /usr/share/nginx/html/
COPY timeline-comprehensive.xml /usr/share/nginx/html/
COPY events-simple.xml /usr/share/nginx/html/
COPY README.md /usr/share/nginx/html/
COPY research-prompt.md /usr/share/nginx/html/
# Copy additional HTML files
COPY vertical-timeline.html /usr/share/nginx/html/
COPY flight-logs.html /usr/share/nginx/html/
COPY name-the-scandal.html /usr/share/nginx/html/
# Copy flight data
COPY flight_flights_table.csv /usr/share/nginx/html/
COPY flightlogs_flightgraph.kml /usr/share/nginx/html/
# Copy images and data
COPY images/ /usr/share/nginx/html/images/
COPY translate-widget.js /usr/share/nginx/html/
COPY enhanced-network-data.js /usr/share/nginx/html/
COPY enhanced-network-visualization.js /usr/share/nginx/html/
COPY version.js /usr/share/nginx/html/
COPY distraction-analysis.js /usr/share/nginx/html/

# Copy API files
COPY --from=api-build /app/api/ /app/api/
COPY --from=api-build /app/scripts/ /app/scripts/

# Create nginx configuration for API proxy and static serving
RUN echo 'upstream api_backend { \
    server localhost:8848; \
} \
\
server { \
    listen 80; \
    server_name localhost; \
    root /usr/share/nginx/html; \
    index index.html; \
    \
    # Enable gzip compression \
    gzip on; \
    gzip_types text/xml application/xml application/javascript text/css text/html application/json; \
    \
    # API endpoints - proxy to Python backend \
    location /api/ { \
        proxy_pass http://api_backend; \
        proxy_set_header Host $host; \
        proxy_set_header X-Real-IP $remote_addr; \
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for; \
        proxy_set_header X-Forwarded-Proto $scheme; \
        proxy_connect_timeout 30s; \
        proxy_send_timeout 30s; \
        proxy_read_timeout 30s; \
    } \
    \
    # Add headers for better caching \
    location ~* \.(xml|html|css|js|csv|kml)$ { \
        expires 1h; \
        add_header Cache-Control "public, no-transform"; \
    } \
    \
    # Handle XML files with proper MIME type \
    location ~* \.xml$ { \
        add_header Content-Type "application/xml"; \
    } \
    \
    # Handle CSV files with proper MIME type \
    location ~* \.csv$ { \
        add_header Content-Type "text/csv"; \
    } \
    \
    # Handle KML files with proper MIME type \
    location ~* \.kml$ { \
        add_header Content-Type "application/vnd.google-earth.kml+xml"; \
    } \
    \
    # Main location \
    location / { \
        try_files $uri $uri/ /index.html; \
    } \
}' > /etc/nginx/conf.d/default.conf

# Create startup script that runs both nginx and the API
RUN echo '#!/bin/sh \
echo "Starting Creepstate Investigation Platform services..." \
# Start Python API in background \
cd /app && python3 api/flight_api.py & \
API_PID=$! \
echo "API server started with PID: $API_PID" \
# Start nginx in foreground \
echo "Starting nginx..." \
nginx -g "daemon off;" & \
NGINX_PID=$! \
echo "Nginx started with PID: $NGINX_PID" \
# Wait for any process to exit \
wait -n \
# Exit with status of process that exited first \
exit $?' > /start.sh && chmod +x /start.sh

# Expose ports
EXPOSE 80 8848

# Add health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
    CMD curl -f http://localhost/api/health && curl -f http://localhost/ || exit 1

# Add labels for documentation
LABEL maintainer="Trump-Epstein Timeline" \
      description="Interactive timeline with PostgreSQL-powered flight logs analysis" \
      version="2.0"

# Start both services
CMD ["/start.sh"]