/**
 * KML Flight Data Parser for Trump-Epstein Timeline
 * Comprehensive parser for KML flight log data with Google Maps integration
 */

class KMLFlightParser {
    constructor() {
        this.flightData = [];
        this.routeData = [];
        this.passengerIndex = new Map();
        this.airportIndex = new Map();
    }

    /**
     * Parse KML text and extract flight information
     * @param {string} kmlText - Raw KML content
     * @returns {Object} Parsed flight data with statistics
     */
    parseKML(kmlText) {
        try {
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(kmlText, 'text/xml');
            
            // Check for parsing errors
            const parserError = xmlDoc.querySelector('parsererror');
            if (parserError) {
                throw new Error('KML parsing failed: ' + parserError.textContent);
            }
            
            const placemarks = xmlDoc.getElementsByTagName('Placemark');
            console.log(`Found ${placemarks.length} placemarks in KML`);
            
            for (let placemark of placemarks) {
                const flight = this.parsePlacemark(placemark);
                if (flight) {
                    this.flightData.push(flight);
                    this.indexFlight(flight);
                }
            }
            
            return {
                flights: this.flightData,
                routes: this.routeData,
                statistics: this.generateStatistics(),
                passengerIndex: Object.fromEntries(this.passengerIndex),
                airportIndex: Object.fromEntries(this.airportIndex)
            };
            
        } catch (error) {
            console.error('KML parsing error:', error);
            throw error;
        }
    }

    /**
     * Parse individual placemark element
     * @param {Element} placemark - KML Placemark element
     * @returns {Object|null} Flight data object
     */
    parsePlacemark(placemark) {
        const name = placemark.getElementsByTagName('name')[0]?.textContent?.trim();
        const description = placemark.getElementsByTagName('description')[0]?.textContent?.trim();
        const coordinatesElement = placemark.getElementsByTagName('coordinates')[0];
        
        if (!name || !description || !coordinatesElement) {
            console.warn('Incomplete placemark data:', { name, description, hasCoordinates: !!coordinatesElement });
            return null;
        }
        
        const coordinates = coordinatesElement.textContent.trim();
        
        try {
            const flightInfo = this.parseFlightDetails(name, description);
            const routeInfo = this.parseCoordinates(coordinates);
            
            if (!flightInfo || !routeInfo) {
                return null;
            }
            
            const flight = {
                ...flightInfo,
                ...routeInfo,
                rawName: name,
                rawDescription: description,
                rawCoordinates: coordinates
            };
            
            // Calculate additional metadata
            flight.distance = this.calculateDistance(
                routeInfo.originCoords.lat, routeInfo.originCoords.lng,
                routeInfo.destCoords.lat, routeInfo.destCoords.lng
            );
            
            flight.routeType = this.classifyRoute(flight);
            flight.passengerTypes = this.classifyPassengers(flight.passengers);
            
            return flight;
            
        } catch (error) {
            console.warn('Error parsing placemark:', error, { name, description });
            return null;
        }
    }

    /**
     * Parse flight details from name and description
     * @param {string} name - Placemark name
     * @param {string} description - Placemark description
     * @returns {Object|null} Flight details
     */
    parseFlightDetails(name, description) {
        // Extract flight number and date from name
        // Format: "Flight 44 20010106" or "Flight 1557 20010113"
        const nameMatch = name.match(/Flight\s+(\w+)\s+(\d{8})/i);
        if (!nameMatch) {
            console.warn('Could not parse flight name:', name);
            return null;
        }
        
        const flightNumber = nameMatch[1];
        const dateString = nameMatch[2];
        
        // Parse date (YYYYMMDD format)
        const year = dateString.substring(0, 4);
        const month = dateString.substring(4, 6);
        const day = dateString.substring(6, 8);
        const date = `${year}-${month}-${day}`;
        
        // Extract passenger list and route from description
        const passengerMatch = description.match(/Passengers:\s*([^\n\r]+)/i);
        const routeMatch = description.match(/Origin:\s*(\w+)\s*->\s*Destination:\s*(\w+)/i);
        
        if (!passengerMatch || !routeMatch) {
            console.warn('Could not parse description:', description);
            return null;
        }
        
        const passengers = passengerMatch[1]
            .split(',')
            .map(p => p.trim())
            .filter(p => p.length > 0);
            
        const origin = routeMatch[1].trim();
        const destination = routeMatch[2].trim();
        
        return {
            flightNumber,
            date,
            passengers,
            passengerCount: passengers.length,
            origin,
            destination
        };
    }

    /**
     * Parse coordinate string and extract route information
     * @param {string} coordinateString - KML coordinates
     * @returns {Object|null} Route coordinates
     */
    parseCoordinates(coordinateString) {
        try {
            const coordPairs = coordinateString.trim().split(/\s+/).filter(c => c.length > 0);
            
            if (coordPairs.length < 2) {
                console.warn('Insufficient coordinate pairs:', coordPairs.length);
                return null;
            }
            
            const parseCoordPair = (coordStr) => {
                const parts = coordStr.split(',');
                if (parts.length < 2) return null;
                
                return {
                    lng: parseFloat(parts[0]),
                    lat: parseFloat(parts[1]),
                    alt: parts[2] ? parseFloat(parts[2]) : 0
                };
            };
            
            const originCoords = parseCoordPair(coordPairs[0]);
            const destCoords = parseCoordPair(coordPairs[coordPairs.length - 1]);
            
            if (!originCoords || !destCoords) {
                console.warn('Could not parse coordinates:', coordinateString);
                return null;
            }
            
            // Parse all intermediate coordinates for full route
            const fullRoute = coordPairs.map(parseCoordPair).filter(c => c !== null);
            
            return {
                originCoords,
                destCoords,
                fullRoute,
                routePoints: coordPairs.length
            };
            
        } catch (error) {
            console.error('Coordinate parsing error:', error);
            return null;
        }
    }

    /**
     * Calculate distance between two coordinates (in miles)
     */
    calculateDistance(lat1, lng1, lat2, lng2) {
        const R = 3959; // Earth's radius in miles
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLng = (lng2 - lng1) * Math.PI / 180;
        const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                  Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
                  Math.sin(dLng/2) * Math.sin(dLng/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        return Math.round(R * c);
    }

    /**
     * Classify route type (domestic, international, island)
     */
    classifyRoute(flight) {
        const usPorts = ['EWR', 'PBI', 'LGA', 'TEB', 'BDR', 'JFK', 'HPN', 'VNY', 'LAX'];
        const islandPorts = ['TIST', 'MBPV', 'TNCM', 'MBGT'];
        
        const originUS = usPorts.includes(flight.origin);
        const destUS = usPorts.includes(flight.destination);
        const originIsland = islandPorts.includes(flight.origin);
        const destIsland = islandPorts.includes(flight.destination);
        
        if (originIsland || destIsland) return 'island';
        if (originUS && destUS) return 'domestic';
        return 'international';
    }

    /**
     * Classify passengers into categories
     */
    classifyPassengers(passengers) {
        const classifications = {
            political: [],
            celebrity: [],
            staff: [],
            unknown: []
        };
        
        const politicalKeywords = ['Trump', 'Clinton', 'Prince', 'Richardson', 'Mitchell', 'Glenn'];
        const celebrityKeywords = ['Spacey', 'Tucker'];
        const staffKeywords = ['Epstein', 'Maxwell', 'Kellen', 'Marcinkova'];
        
        passengers.forEach(passenger => {
            const name = passenger.toLowerCase();
            
            if (politicalKeywords.some(k => name.includes(k.toLowerCase()))) {
                classifications.political.push(passenger);
            } else if (celebrityKeywords.some(k => name.includes(k.toLowerCase()))) {
                classifications.celebrity.push(passenger);
            } else if (staffKeywords.some(k => name.includes(k.toLowerCase()))) {
                classifications.staff.push(passenger);
            } else {
                classifications.unknown.push(passenger);
            }
        });
        
        return classifications;
    }

    /**
     * Index flight data for quick lookups
     */
    indexFlight(flight) {
        // Index passengers
        flight.passengers.forEach(passenger => {
            if (!this.passengerIndex.has(passenger)) {
                this.passengerIndex.set(passenger, []);
            }
            this.passengerIndex.get(passenger).push(flight.flightNumber);
        });
        
        // Index airports
        [flight.origin, flight.destination].forEach(airport => {
            if (!this.airportIndex.has(airport)) {
                this.airportIndex.set(airport, { departures: [], arrivals: [] });
            }
            
            const airportData = this.airportIndex.get(airport);
            if (airport === flight.origin) {
                airportData.departures.push(flight.flightNumber);
            } else {
                airportData.arrivals.push(flight.flightNumber);
            }
        });
        
        // Add to route data
        const routeKey = `${flight.origin}-${flight.destination}`;
        const existingRoute = this.routeData.find(r => r.key === routeKey);
        
        if (existingRoute) {
            existingRoute.flights.push(flight.flightNumber);
            existingRoute.frequency++;
        } else {
            this.routeData.push({
                key: routeKey,
                origin: flight.origin,
                destination: flight.destination,
                originCoords: flight.originCoords,
                destCoords: flight.destCoords,
                flights: [flight.flightNumber],
                frequency: 1,
                distance: flight.distance
            });
        }
    }

    /**
     * Generate comprehensive statistics
     */
    generateStatistics() {
        const stats = {
            totalFlights: this.flightData.length,
            uniquePassengers: this.passengerIndex.size,
            uniqueRoutes: this.routeData.length,
            totalDistance: this.flightData.reduce((sum, f) => sum + f.distance, 0),
            dateRange: this.getDateRange(),
            routeTypes: this.getRouteTypeStats(),
            topPassengers: this.getTopPassengers(10),
            topRoutes: this.getTopRoutes(10),
            passengerTypes: this.getPassengerTypeStats()
        };
        
        return stats;
    }

    getDateRange() {
        if (this.flightData.length === 0) return null;
        
        const dates = this.flightData.map(f => new Date(f.date)).sort();
        return {
            earliest: dates[0].toISOString().split('T')[0],
            latest: dates[dates.length - 1].toISOString().split('T')[0]
        };
    }

    getRouteTypeStats() {
        const stats = { domestic: 0, international: 0, island: 0 };
        this.flightData.forEach(flight => {
            stats[flight.routeType]++;
        });
        return stats;
    }

    getTopPassengers(limit = 10) {
        return Array.from(this.passengerIndex.entries())
            .map(([name, flights]) => ({ name, count: flights.length }))
            .sort((a, b) => b.count - a.count)
            .slice(0, limit);
    }

    getTopRoutes(limit = 10) {
        return this.routeData
            .map(route => ({
                route: `${route.origin} → ${route.destination}`,
                frequency: route.frequency,
                distance: route.distance
            }))
            .sort((a, b) => b.frequency - a.frequency)
            .slice(0, limit);
    }

    getPassengerTypeStats() {
        const typeStats = { political: 0, celebrity: 0, staff: 0, unknown: 0 };
        
        this.flightData.forEach(flight => {
            Object.keys(flight.passengerTypes).forEach(type => {
                typeStats[type] += flight.passengerTypes[type].length;
            });
        });
        
        return typeStats;
    }

    /**
     * Export data in various formats
     */
    exportToCSV() {
        const headers = [
            'Flight Number', 'Date', 'Origin', 'Destination', 'Distance (miles)',
            'Passenger Count', 'Passengers', 'Route Type'
        ];
        
        const rows = this.flightData.map(flight => [
            flight.flightNumber,
            flight.date,
            flight.origin,
            flight.destination,
            flight.distance,
            flight.passengerCount,
            flight.passengers.join('; '),
            flight.routeType
        ]);
        
        return [headers, ...rows]
            .map(row => row.map(cell => `"${cell}"`).join(','))
            .join('\n');
    }

    exportToJSON() {
        return JSON.stringify({
            metadata: {
                generatedAt: new Date().toISOString(),
                totalFlights: this.flightData.length,
                parser: 'KMLFlightParser v1.0'
            },
            flights: this.flightData,
            routes: this.routeData,
            statistics: this.generateStatistics()
        }, null, 2);
    }
}

// Make available globally
if (typeof window !== 'undefined') {
    window.KMLFlightParser = KMLFlightParser;
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = KMLFlightParser;
}