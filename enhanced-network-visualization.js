// Enhanced Circular Network Visualization Engine
// Comprehensive network visualization with Epstein at center
// Fixed circular layout showing connection patterns and hub analysis

class EnhancedNetworkVisualization {
    constructor(containerId, data) {
        this.container = d3.select(containerId);
        this.data = data;
        this.width = this.container.node().offsetWidth || 1200;
        this.height = this.container.node().offsetHeight || 800;
        this.centerX = this.width / 2;
        this.centerY = this.height / 2;
        
        // Initialize photo database connection
        this.photoDb = window.photoDatabase || null;
        
        // Color schemes for different node types
        this.colorScheme = {
            'trafficker-primary': '#8B0000',    // Dark red for main traffickers
            'trafficker-secondary': '#B22222',   // Red for secondary traffickers
            'politician': '#FF4500',             // Orange-red for politicians
            'royalty': '#FFD700',                // Gold for royalty
            'business': '#4ecdc4',               // Teal for business leaders
            'intelligence': '#800080',           // Purple for intelligence
            'victim-group': '#ff6b6b',           // Light red for victims
            'infrastructure': '#FF6347',         // Tomato for properties/transport
            'financial': '#32CD32',              // Green for financial networks
            'recruitment': '#DC143C',            // Crimson for recruitment
            'deaths': '#000000',                 // Black for suspicious deaths
            'parallel-network': '#8B008B'        // Dark magenta for parallel networks
        };

        this.relationshipColors = {
            'trafficking': '#8B0000',
            'recruitment': '#ff6b6b', 
            'financial': '#32CD32',
            'intelligence': '#800080',
            'social': '#4ecdc4',
            'political': '#FF4500',
            'transport': '#FF6347',
            'cover-up': '#000000'
        };

        this.initializeVisualization();
    }

    initializeVisualization() {
        // Clear existing content
        this.container.selectAll("*").remove();
        
        // Check if we should use 3D visualization
        if (typeof ForceGraph3D !== 'undefined') {
            this.initialize3DVisualization();
            return;
        }

        // Create main SVG
        this.svg = this.container
            .append("svg")
            .attr("width", this.width)
            .attr("height", this.height)
            .style("background", "radial-gradient(circle, #1a1a1a 0%, #0a0a0a 100%)");

        // Create groups for different layers
        this.linkGroup = this.svg.append("g").attr("class", "links");
        this.nodeGroup = this.svg.append("g").attr("class", "nodes");
        this.labelGroup = this.svg.append("g").attr("class", "labels");

        // Create gradients and filters
        this.createGradients();
        
        // Calculate network metrics
        this.calculateNetworkMetrics();
        
        // Position nodes in circular layout
        this.positionNodes();
        
        // Render the visualization
        this.renderNetwork();
        
        // Add zoom and interaction capabilities
        this.setupInteractions();
        
        // Create tooltip
        this.createTooltip();
    }

    createGradients() {
        const defs = this.svg.append("defs");

        // Create radial gradients for different node types
        Object.entries(this.colorScheme).forEach(([type, color]) => {
            const gradient = defs.append("radialGradient")
                .attr("id", `gradient-${type}`)
                .attr("cx", "30%")
                .attr("cy", "30%")
                .attr("r", "70%");

            gradient.append("stop")
                .attr("offset", "0%")
                .attr("stop-color", d3.color(color).brighter(0.5))
                .attr("stop-opacity", 0.8);

            gradient.append("stop")
                .attr("offset", "100%")
                .attr("stop-color", color)
                .attr("stop-opacity", 1);
        });

        // Create glow filter for central node
        const glowFilter = defs.append("filter")
            .attr("id", "glow")
            .attr("x", "-50%")
            .attr("y", "-50%")
            .attr("width", "200%")
            .attr("height", "200%");

        glowFilter.append("feGaussianBlur")
            .attr("stdDeviation", "4")
            .attr("result", "coloredBlur");

        const feMerge = glowFilter.append("feMerge");
        feMerge.append("feMergeNode").attr("in", "coloredBlur");
        feMerge.append("feMergeNode").attr("in", "SourceGraphic");
    }

    calculateNetworkMetrics() {
        // Calculate connection counts for hub analysis
        this.connectionCounts = new Map();
        this.data.nodes.forEach(node => this.connectionCounts.set(node.id, 0));
        
        this.data.links.forEach(link => {
            const sourceId = typeof link.source === 'object' ? link.source.id : link.source;
            const targetId = typeof link.target === 'object' ? link.target.id : link.target;
            
            this.connectionCounts.set(sourceId, (this.connectionCounts.get(sourceId) || 0) + 1);
            this.connectionCounts.set(targetId, (this.connectionCounts.get(targetId) || 0) + 1);
        });

        // Update node data with connection counts
        this.data.nodes.forEach(node => {
            node.connections = this.connectionCounts.get(node.id) || 0;
            node.displaySize = Math.max(8, Math.min(30, (node.size || 10) + node.connections));
        });
    }

    positionNodes() {
        // Find Epstein node for center positioning
        const epsteinNode = this.data.nodes.find(n => n.id === 'epstein');
        const otherNodes = this.data.nodes.filter(n => n.id !== 'epstein');

        // Place Epstein at center with special styling
        if (epsteinNode) {
            epsteinNode.x = this.centerX;
            epsteinNode.y = this.centerY;
            epsteinNode.fx = this.centerX; // Fix position
            epsteinNode.fy = this.centerY;
            epsteinNode.displaySize = 40; // Much larger central node
            epsteinNode.isCenter = true; // Special flag for styling
        }

        // Arrange other nodes in concentric circles based on connection strength
        const maxConnections = Math.max(...Array.from(this.connectionCounts.values()));
        
        // Group nodes by connection strength for better arrangement
        const nodeGroups = {};
        otherNodes.forEach(node => {
            const connectionTier = Math.ceil((node.connections / maxConnections) * 3) || 1;
            if (!nodeGroups[connectionTier]) nodeGroups[connectionTier] = [];
            nodeGroups[connectionTier].push(node);
        });

        // Position nodes in tiers with better distribution
        Object.keys(nodeGroups).sort((a, b) => parseInt(b) - parseInt(a)).forEach(tier => {
            const nodes = nodeGroups[tier];
            const tierNum = parseInt(tier);
            const radius = 150 + (4 - tierNum) * 100; // Better spacing for readability
            
            // Add some randomization to prevent overlapping
            const angleOffset = Math.random() * Math.PI / 6; // Random start angle
            
            nodes.forEach((node, index) => {
                const angle = (index / nodes.length) * 2 * Math.PI + angleOffset;
                const radiusVariation = radius + (Math.random() - 0.5) * 40; // Add some variation
                
                node.x = this.centerX + Math.cos(angle) * radiusVariation;
                node.y = this.centerY + Math.sin(angle) * radiusVariation;
                node.tier = tier;
                
                // Ensure nodes stay within bounds
                node.x = Math.max(50, Math.min(this.width - 50, node.x));
                node.y = Math.max(50, Math.min(this.height - 50, node.y));
            });
        });
    }

    renderNetwork() {
        // Render connection lines
        this.links = this.linkGroup.selectAll("line")
            .data(this.data.links)
            .enter().append("line")
            .attr("class", "connection-line")
            .attr("stroke", d => this.getConnectionColor(d.type))
            .attr("stroke-width", d => Math.max(1, (d.strength || 1) * 1.5))
            .attr("stroke-opacity", 0.3)
            .attr("x1", d => this.getNodeById(d.source).x)
            .attr("y1", d => this.getNodeById(d.source).y)
            .attr("x2", d => this.getNodeById(d.target).x)
            .attr("y2", d => this.getNodeById(d.target).y);

        // Render nodes with enhanced styling
        this.nodes = this.nodeGroup.selectAll("circle")
            .data(this.data.nodes)
            .enter().append("circle")
            .attr("class", d => `network-node ${d.tier ? 'hub-tier-' + d.tier : ''} ${d.isCenter ? 'center-node' : ''}`)
            .attr("r", d => d.displaySize)
            .attr("fill", d => this.getNodeColor(d))
            .attr("stroke", d => d.id === 'epstein' ? '#fff' : (d.tier === '3' ? '#FFD700' : '#333'))
            .attr("stroke-width", d => d.id === 'epstein' ? 5 : (d.tier === '3' ? 3 : 2))
            .attr("cx", d => d.x)
            .attr("cy", d => d.y)
            .style("cursor", "pointer")
            .style("filter", d => {
                if (d.id === 'epstein') return "url(#glow) drop-shadow(0 0 15px #8B0000)";
                if (d.tier === '3') return "drop-shadow(0 0 8px #FFD700)";
                if (d.tier === '2') return "drop-shadow(0 0 5px #4ecdc4)";
                return "none";
            })
            .style("opacity", 0)
            .on("mouseenter", (event, d) => this.showTooltip(event, d))
            .on("mouseleave", () => this.hideTooltip())
            .on("click", (event, d) => this.handleNodeClick(event, d));
        
        // Animate nodes appearing
        this.nodes.transition()
            .duration(1000)
            .delay((d, i) => i * 50)
            .style("opacity", 1);

        // Render labels with improved styling
        this.labels = this.labelGroup.selectAll("text")
            .data(this.data.nodes)
            .enter().append("text")
            .attr("class", "network-label")
            .attr("text-anchor", "middle")
            .attr("x", d => d.x)
            .attr("y", d => d.y + d.displaySize + 15)
            .style("font-size", d => {
                if (d.id === 'epstein') return "16px";
                if (d.tier === '3') return "12px";
                return "10px";
            })
            .style("font-weight", d => {
                if (d.id === 'epstein') return "bold";
                if (d.tier === '3') return "600";
                return "normal";
            })
            .style("fill", d => {
                if (d.id === 'epstein') return "#fff";
                if (d.tier === '3') return "#FFD700";
                return "#ddd";
            })
            .style("pointer-events", "none")
            .style("text-shadow", "2px 2px 4px rgba(0,0,0,0.9)")
            .style("opacity", 0)
            .text(d => d.name.length > 18 ? d.name.substring(0, 15) + "..." : d.name);
        
        // Animate labels appearing
        this.labels.transition()
            .duration(1000)
            .delay((d, i) => i * 50 + 500)
            .style("opacity", 1);
    }

    setupInteractions() {
        // Add zoom functionality
        const zoom = d3.zoom()
            .scaleExtent([0.3, 3])
            .on("zoom", (event) => {
                const { transform } = event;
                this.nodeGroup.attr("transform", transform);
                this.linkGroup.attr("transform", transform);
                this.labelGroup.attr("transform", transform);
            });
        
        this.svg.call(zoom);
    }

    createTooltip() {
        if (d3.select("#networkTooltip").empty()) {
            this.tooltip = d3.select("body").append("div")
                .attr("id", "networkTooltip")
                .style("position", "absolute")
                .style("background", "rgba(0, 0, 0, 0.9)")
                .style("color", "white")
                .style("padding", "15px")
                .style("border-radius", "8px")
                .style("border", "2px solid #ff6b6b")
                .style("pointer-events", "none")
                .style("opacity", 0)
                .style("max-width", "300px")
                .style("font-size", "12px")
                .style("z-index", 10000);
        } else {
            this.tooltip = d3.select("#networkTooltip");
        }
    }

    showTooltip(event, d) {
        // Get photo for this person
        const photo = this.getPersonPhoto(d);
        
        let content = '';
        
        // Add photo if available
        if (photo) {
            content += `<img src="${photo}" class="tooltip-photo" onerror="this.style.display='none'" />`;
        }
        
        content += `<div class="tooltip-content">`;
        content += `<strong style="color: #ff6b6b; font-size: 14px;">${d.name}</strong><br/><br/>`;
        
        if (d.connections) {
            content += `<span style="color: #4ecdc4;">🔗 Connections: ${d.connections}</span><br/>`;
        }
        
        if (d.tier) {
            content += `<span style="color: #FFD700;">📊 Hub Tier: ${d.tier}/3</span><br/>`;
        }
        
        if (d.type) {
            content += `<span style="color: #ccc;">🏷️ Type: ${d.type.replace('-', ' ')}</span><br/>`;
        }
        
        if (d.evidenceLevel) {
            const levelColors = {
                'verified': '#32CD32',
                'documented': '#4ecdc4', 
                'alleged': '#FFD700',
                'suspected': '#ff6b6b'
            };
            const color = levelColors[d.evidenceLevel] || '#ccc';
            content += `<span style="color: ${color};">📋 Evidence: ${d.evidenceLevel}</span><br/>`;
        }
        
        if (d.description || d.info) {
            const desc = (d.description || d.info).substring(0, 200);
            content += `<br/><span style="color: #ddd; font-size: 11px;">${desc}${desc.length < (d.description || d.info).length ? '...' : ''}</span><br/>`;
        }
        
        content += `<br/><span style="color: #ff6b6b; font-size: 10px;">💡 Click for detailed information</span>`;
        content += `</div>`;
        
        this.tooltip.html(content)
            .style("left", (event.pageX + 10) + "px")
            .style("top", (event.pageY - 10) + "px")
            .transition()
            .duration(200)
            .style("opacity", 1);

        // Highlight connections
        this.highlightConnections(d, true);
    }

    hideTooltip() {
        this.tooltip.transition()
            .duration(200)
            .style("opacity", 0);

        // Remove highlights
        this.links.style("stroke-opacity", 0.3);
        this.nodes.style("opacity", 1);
    }

    highlightConnections(node, highlight) {
        if (highlight) {
            // Dim all links and nodes first
            this.links.style("stroke-opacity", 0.1);
            this.nodes.style("opacity", 0.3);

            // Highlight connected links
            this.links
                .filter(d => this.getNodeById(d.source).id === node.id || this.getNodeById(d.target).id === node.id)
                .style("stroke-opacity", 0.8);

            // Highlight connected nodes
            const connectedNodeIds = new Set([node.id]);
            this.data.links.forEach(link => {
                const sourceId = this.getNodeById(link.source).id;
                const targetId = this.getNodeById(link.target).id;
                if (sourceId === node.id) connectedNodeIds.add(targetId);
                if (targetId === node.id) connectedNodeIds.add(sourceId);
            });

            this.nodes
                .filter(d => connectedNodeIds.has(d.id))
                .style("opacity", 1);
        } else {
            // Reset to normal
            this.links.style("stroke-opacity", 0.3);
            this.nodes.style("opacity", 1);
        }
    }

    handleNodeClick(event, d) {
        // Trigger the external showPersonInfo function if it exists
        if (typeof showPersonInfo === 'function') {
            showPersonInfo(d);
        } else {
            console.log("Node clicked:", d);
        }
    }

    getNodeById(id) {
        if (typeof id === 'object') return id;
        return this.data.nodes.find(n => n.id === id);
    }

    getConnectionColor(type) {
        return this.relationshipColors[type] || '#666';
    }

    getNodeColor(d) {
        if (d.color) return d.color;
        return this.colorScheme[d.type] || '#4ecdc4';
    }
    
    getPersonPhoto(d) {
        // Try to get photo from photo database
        if (this.photoDb && this.photoDb.getPerson) {
            const person = this.photoDb.getPerson(d.id) || this.photoDb.getPerson(d.name.toLowerCase().replace(/\s+/g, '-'));
            if (person && person.photos && person.photos.length > 0) {
                // Return the first available photo
                return `images/people/${person.photos[0].filename}`;
            }
        }
        
        // Fallback to common photo naming conventions
        const photoId = d.id || d.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
        const commonExtensions = ['jpg', 'jpeg', 'png', 'webp'];
        
        // Try common photo paths
        for (const ext of commonExtensions) {
            const photoPath = `images/people/${photoId}.${ext}`;
            // We'll let the img onerror handle missing photos
            return photoPath;
        }
        
        return null;
    }

    // Control methods for external interaction
    filterByType(types) {
        this.nodes.style("opacity", d => types.includes(d.type) ? 1 : 0.1);
        this.labels.style("opacity", d => types.includes(d.type) ? 1 : 0.1);
    }

    resetView() {
        this.nodes.style("opacity", 1);
        this.labels.style("opacity", 1);
        this.links.style("stroke-opacity", 0.3);
    }

    exportToPNG() {
        // Simple export functionality
        const svgData = new XMLSerializer().serializeToString(this.svg.node());
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        const img = new Image();
        
        canvas.width = this.width;
        canvas.height = this.height;
        
        img.onload = function() {
            ctx.drawImage(img, 0, 0);
            const link = document.createElement('a');
            link.download = 'trump-epstein-network.png';
            link.href = canvas.toDataURL();
            link.click();
        };
        
        img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
    }

    initialize3DVisualization() {
        console.log('Initializing 3D Network Visualization');
        
        // Clear container
        this.container.node().innerHTML = '';
        
        // Create 3D force graph
        this.graph3D = ForceGraph3D()(this.container.node())
            .width(this.width)
            .height(this.height)
            .backgroundColor('#1a1a1a')
            .nodeLabel(d => `${d.name}<br/>${d.info || 'Network associate'}`)
            .nodeColor(d => {
                if (d.id === 'epstein') return '#ff0000';
                return this.colorScheme[d.type] || '#4ecdc4';
            })
            .nodeVal(d => {
                if (d.id === 'epstein') return 30;
                return d.connectionCount || 10;
            })
            .linkColor(() => 'rgba(255,255,255,0.2)')
            .linkWidth(d => Math.sqrt(d.strength || 1))
            .linkOpacity(0.4)
            .nodeThreeObject(d => {
                // Create 3D sphere for each node
                const sphereGeometry = new THREE.SphereGeometry(d.id === 'epstein' ? 8 : 5);
                const sphereMaterial = new THREE.MeshBasicMaterial({ 
                    color: d.id === 'epstein' ? '#ff0000' : (this.colorScheme[d.type] || '#4ecdc4'),
                    transparent: true,
                    opacity: 0.8
                });
                const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
                
                // Add glow effect for Epstein
                if (d.id === 'epstein') {
                    const glowGeometry = new THREE.SphereGeometry(12);
                    const glowMaterial = new THREE.MeshBasicMaterial({
                        color: '#ff0000',
                        transparent: true,
                        opacity: 0.2
                    });
                    const glow = new THREE.Mesh(glowGeometry, glowMaterial);
                    sphere.add(glow);
                }
                
                return sphere;
            })
            .onNodeClick(d => {
                this.showNodeTooltip(d);
            })
            .onNodeHover(d => {
                this.container.node().style.cursor = d ? 'pointer' : 'default';
            });

        // Prepare data for 3D visualization
        const graphData = this.prepare3DData();
        this.graph3D.graphData(graphData);
        
        // Position Epstein at center
        setTimeout(() => {
            const epsteinNode = graphData.nodes.find(n => n.id === 'epstein');
            if (epsteinNode) {
                epsteinNode.fx = 0;
                epsteinNode.fy = 0;
                epsteinNode.fz = 0;
            }
        }, 1000);
    }

    prepare3DData() {
        // Convert our network data to 3D format
        const nodes = [
            {id: 'epstein', name: 'Jeffrey Epstein', type: 'trafficker-primary', info: 'Central figure. Convicted sex trafficker who died in federal custody in 2019.', connectionCount: 50},
            {id: 'maxwell', name: 'Ghislaine Maxwell', type: 'trafficker-secondary', info: 'Epstein\'s right hand. Convicted of sex trafficking and conspiracy.', connectionCount: 30},
            {id: 'trump', name: 'Donald Trump', type: 'politician', info: '45th US President. 30+ year friendship with Epstein.', connectionCount: 25},
            {id: 'clinton-bill', name: 'Bill Clinton', type: 'politician', info: '42nd US President. 27+ flights on "Lolita Express".', connectionCount: 22},
            {id: 'andrew', name: 'Prince Andrew', type: 'royalty', info: 'Duke of York. Central figure in scandal.', connectionCount: 20},
            {id: 'wexner', name: 'Les Wexner', type: 'business', info: 'L Brands CEO. Epstein\'s primary financial backer.', connectionCount: 24},
            {id: 'gates', name: 'Bill Gates', type: 'business', info: 'Microsoft founder. Multiple meetings after Epstein\'s 2008 conviction.', connectionCount: 18},
            {id: 'dershowitz', name: 'Alan Dershowitz', type: 'politician', info: 'Harvard Law Professor, Trump lawyer.', connectionCount: 16},
            {id: 'dubin', name: 'Glenn Dubin', type: 'business', info: 'Hedge fund manager. Longtime friend and business associate.', connectionCount: 15},
            {id: 'black', name: 'Leon Black', type: 'business', info: 'Apollo Global Management. Paid Epstein $158M.', connectionCount: 14},
            {id: 'spacey', name: 'Kevin Spacey', type: 'celebrity', info: 'Actor. Multiple flights on Epstein\'s aircraft.', connectionCount: 12},
            {id: 'jagger', name: 'Mick Jagger', type: 'celebrity', info: 'Rolling Stones lead singer. Attended Epstein parties.', connectionCount: 10},
            {id: 'putin', name: 'Vladimir Putin', type: 'intelligence', info: 'Russian President. Financial connections through Russian banks.', connectionCount: 18},
            {id: 'barak', name: 'Ehud Barak', type: 'intelligence', info: 'Former Israeli PM. Multiple business dealings with Epstein.', connectionCount: 14}
        ];

        const links = [
            {source: 'epstein', target: 'maxwell', strength: 10, type: 'trafficking'},
            {source: 'epstein', target: 'trump', strength: 9, type: 'social'},
            {source: 'epstein', target: 'clinton-bill', strength: 8, type: 'transport'},
            {source: 'epstein', target: 'andrew', strength: 9, type: 'trafficking'},
            {source: 'epstein', target: 'wexner', strength: 10, type: 'financial'},
            {source: 'epstein', target: 'gates', strength: 6, type: 'philanthropy'},
            {source: 'epstein', target: 'dershowitz', strength: 8, type: 'legal'},
            {source: 'epstein', target: 'dubin', strength: 7, type: 'financial'},
            {source: 'epstein', target: 'black', strength: 8, type: 'financial'},
            {source: 'epstein', target: 'spacey', strength: 5, type: 'social'},
            {source: 'epstein', target: 'jagger', strength: 4, type: 'social'},
            {source: 'maxwell', target: 'andrew', strength: 8, type: 'trafficking'},
            {source: 'maxwell', target: 'trump', strength: 6, type: 'social'},
            {source: 'trump', target: 'dershowitz', strength: 7, type: 'legal'},
            {source: 'wexner', target: 'black', strength: 5, type: 'business'},
            {source: 'putin', target: 'epstein', strength: 6, type: 'intelligence'},
            {source: 'barak', target: 'epstein', strength: 7, type: 'intelligence'},
            {source: 'barak', target: 'maxwell', strength: 5, type: 'intelligence'}
        ];

        return { nodes, links };
    }
}

// Export for global access
window.EnhancedNetworkVisualization = EnhancedNetworkVisualization;

// Global functions for button controls
function filterByCategory(category) {
    console.log('Filtering by category:', category);
    if (window.networkVisualization) {
        switch(category) {
            case 'politician':
                window.networkVisualization.filterByType(['politician', 'royalty']);
                break;
            case 'business': 
                window.networkVisualization.filterByType(['business', 'financial']);
                break;
            case 'celebrity':
                window.networkVisualization.filterByType(['celebrity', 'entertainment']);
                break;
            case 'location':
                window.networkVisualization.filterByType(['location', 'property']);
                break;
            default:
                window.networkVisualization.resetView();
        }
    }
}

function showTemporalView() {
    console.log('Switching to temporal view');
    // Switch to timeline visualization
    const timelineSection = document.querySelector('#timeline-visualization');
    const networkSection = document.querySelector('#network-container');
    const mindmapSection = document.querySelector('#mindmap-container');
    
    if (timelineSection) {
        networkSection.style.display = 'none';
        mindmapSection.style.display = 'none'; 
        timelineSection.style.display = 'block';
        
        // Initialize timeline if not already done
        if (!window.timelineInitialized) {
            initializeTimeline();
            window.timelineInitialized = true;
        }
    }
}

function showGeographicView() {
    console.log('Switching to geographic view');
    // Switch to geographic visualization
    const geoSection = document.querySelector('#geographic-visualization'); 
    const networkSection = document.querySelector('#network-container');
    const mindmapSection = document.querySelector('#mindmap-container');
    
    if (geoSection) {
        networkSection.style.display = 'none';
        mindmapSection.style.display = 'none';
        geoSection.style.display = 'block';
        
        // Initialize geographic view if not already done
        if (!window.geoInitialized) {
            initializeGeographicView();
            window.geoInitialized = true;
        }
    }
}

function resetNetworkView() {
    console.log('Resetting network view');
    if (window.networkVisualization) {
        if (window.networkVisualization.graph3D) {
            // Reset 3D view
            const graphData = window.networkVisualization.prepare3DData();
            window.networkVisualization.graph3D.graphData(graphData);
        } else {
            window.networkVisualization.resetView();
        }
    }
    
    // Show network view and hide others
    const networkSection = document.querySelector('#network-container');
    const timelineSection = document.querySelector('#timeline-visualization');
    const geoSection = document.querySelector('#geographic-visualization');
    const mindmapSection = document.querySelector('#mindmap-container');
    
    if (networkSection) networkSection.style.display = 'block';
    if (timelineSection) timelineSection.style.display = 'none';
    if (geoSection) geoSection.style.display = 'none';
    if (mindmapSection) mindmapSection.style.display = 'block';
}

function highlightVictimGroups() {
    console.log('Highlighting victim groups');
    if (window.networkVisualization) {
        window.networkVisualization.filterByType(['victim-group', 'trafficking']);
    }
}

function filterPoliticians() {
    console.log('Filtering politicians');
    if (window.networkVisualization) {
        if (window.networkVisualization.graph3D) {
            // Filter 3D view
            const graphData = window.networkVisualization.prepare3DData();
            const filteredData = {
                nodes: graphData.nodes.filter(n => ['politician', 'royalty', 'trafficker-primary'].includes(n.type)),
                links: graphData.links.filter(l => 
                    graphData.nodes.filter(n => ['politician', 'royalty', 'trafficker-primary'].includes(n.type))
                        .find(n => n.id === l.source || n.id === l.source.id) &&
                    graphData.nodes.filter(n => ['politician', 'royalty', 'trafficker-primary'].includes(n.type))
                        .find(n => n.id === l.target || n.id === l.target.id)
                )
            };
            window.networkVisualization.graph3D.graphData(filteredData);
        } else {
            window.networkVisualization.filterByType(['politician', 'royalty']);
        }
    }
}

function filterBusiness() {
    console.log('Filtering business');
    if (window.networkVisualization) {
        if (window.networkVisualization.graph3D) {
            const graphData = window.networkVisualization.prepare3DData();
            const filteredData = {
                nodes: graphData.nodes.filter(n => ['business', 'financial', 'trafficker-primary'].includes(n.type)),
                links: graphData.links.filter(l => 
                    graphData.nodes.filter(n => ['business', 'financial', 'trafficker-primary'].includes(n.type))
                        .find(n => n.id === l.source || n.id === l.source.id) &&
                    graphData.nodes.filter(n => ['business', 'financial', 'trafficker-primary'].includes(n.type))
                        .find(n => n.id === l.target || n.id === l.target.id)
                )
            };
            window.networkVisualization.graph3D.graphData(filteredData);
        } else {
            window.networkVisualization.filterByType(['business', 'financial']);
        }
    }
}

function filterIntelligence() {
    console.log('Filtering intelligence');
    if (window.networkVisualization) {
        if (window.networkVisualization.graph3D) {
            const graphData = window.networkVisualization.prepare3DData();
            const filteredData = {
                nodes: graphData.nodes.filter(n => ['intelligence', 'cover-up', 'trafficker-primary'].includes(n.type)),
                links: graphData.links.filter(l => 
                    graphData.nodes.filter(n => ['intelligence', 'cover-up', 'trafficker-primary'].includes(n.type))
                        .find(n => n.id === l.source || n.id === l.source.id) &&
                    graphData.nodes.filter(n => ['intelligence', 'cover-up', 'trafficker-primary'].includes(n.type))
                        .find(n => n.id === l.target || n.id === l.target.id)
                )
            };
            window.networkVisualization.graph3D.graphData(filteredData);
        } else {
            window.networkVisualization.filterByType(['intelligence', 'cover-up']);
        }
    }

    toggleClusters() {
        if (this.clusteringEnabled) {
            // Disable clustering - return to circular layout
            this.clusteringEnabled = false;
            this.initializeVisualization();
        } else {
            // Enable clustering - group by type
            this.clusteringEnabled = true;
            this.createClusteredLayout();
        }
    }

    createClusteredLayout() {
        // Group nodes by type for clustered view
        const typeGroups = {};
        this.data.nodes.forEach(node => {
            if (!typeGroups[node.type]) {
                typeGroups[node.type] = [];
            }
            typeGroups[node.type].push(node);
        });

        // Position clusters in a grid
        const clusterCount = Object.keys(typeGroups).length;
        const cols = Math.ceil(Math.sqrt(clusterCount));
        const rows = Math.ceil(clusterCount / cols);
        
        let clusterIndex = 0;
        Object.entries(typeGroups).forEach(([type, nodes]) => {
            const clusterX = (clusterIndex % cols) * (this.width / cols) + (this.width / cols / 2);
            const clusterY = Math.floor(clusterIndex / cols) * (this.height / rows) + (this.height / rows / 2);
            
            // Position nodes within cluster
            nodes.forEach((node, i) => {
                const angle = (i / nodes.length) * 2 * Math.PI;
                const radius = Math.min(100, nodes.length * 5);
                node.x = clusterX + Math.cos(angle) * radius;
                node.y = clusterY + Math.sin(angle) * radius;
            });
            
            clusterIndex++;
        });

        // Update visualization with new positions
        if (this.nodes) {
            this.nodes
                .transition()
                .duration(1000)
                .attr("cx", d => d.x)
                .attr("cy", d => d.y);
        }
    }
}

function exportNetworkImage() {
    console.log('Exporting network image');
    if (window.networkVisualization) {
        window.networkVisualization.exportToPNG();
    }
}

function togglePhysics() {
    console.log('Toggling physics');
    // This is a placeholder - the current implementation uses fixed layout
    const button = document.getElementById('physicsToggle');
    if (button) {
        const isOn = button.textContent.includes('ON');
        button.textContent = isOn ? 'Physics: OFF' : 'Physics: ON';
    }
}

// Initialize placeholder timeline and geographic functions
function initializeTimeline() {
    const container = document.querySelector('#timeline-visualization');
    if (container) {
        container.innerHTML = `
            <div style="padding: 40px; text-align: center;">
                <h2>Timeline Visualization</h2>
                <p>Timeline view showing the chronological development of the Trump-Epstein network and key events.</p>
                <div style="margin-top: 20px;">
                    <button onclick="resetNetworkView()" style="padding: 10px 20px; background: var(--primary-color); color: white; border: none; border-radius: 5px; cursor: pointer;">
                        Back to Network View
                    </button>
                </div>
            </div>
        `;
    }
}

function initializeGeographicView() {
    const container = document.querySelector('#geographic-visualization');
    if (container) {
        container.innerHTML = `
            <div style="padding: 40px; text-align: center;">
                <h2>Geographic Visualization</h2>
                <p>Geographic view showing the global distribution of properties, flights, and network connections.</p>
                <div style="margin-top: 20px;">
                    <button onclick="resetNetworkView()" style="padding: 10px 20px; background: var(--primary-color); color: white; border: none; border-radius: 5px; cursor: pointer;">
                        Back to Network View
                    </button>
                </div>
            </div>
        `;
    }
}