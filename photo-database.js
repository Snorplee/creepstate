/**
 * Trump-Epstein Investigation Photo Database System
 * Comprehensive photo management with metadata, search, and evidence correlation
 */

class PhotoDatabase {
    constructor() {
        this.photos = new Map();
        this.people = new Map();
        this.metadata = new Map();
        this.tags = new Set();
        this.sources = new Set();
        this.categories = new Set();
        this.evidenceLevels = ['confirmed', 'documented', 'alleged', 'suspected'];
        
        // Initialize database
        this.initializeDatabase();
    }

    initializeDatabase() {
        // Core Network
        this.addPerson('jeffrey-epstein', {
            name: 'Jeffrey Epstein',
            category: 'core',
            evidenceLevel: 'confirmed',
            description: 'Convicted sex trafficker and financier',
            photos: [
                {
                    filename: 'jeffrey-epstein-mugshot.jpg',
                    type: 'official',
                    source: 'FBI',
                    date: '2019-07-06',
                    description: 'FBI arrest mugshot',
                    evidenceLevel: 'confirmed',
                    tags: ['arrest', 'mugshot', 'official']
                },
                {
                    filename: 'jeffrey-epstein-young.jpg',
                    type: 'historical',
                    source: 'Media Archive',
                    date: '1985-01-01',
                    description: 'Young Epstein in finance',
                    evidenceLevel: 'documented',
                    tags: ['young', 'finance', 'historical']
                },
                {
                    filename: 'jeffrey-epstein-little-st-james.jpg',
                    type: 'property',
                    source: 'Drone Footage',
                    date: '2019-08-15',
                    description: 'At Little St. James island',
                    evidenceLevel: 'documented',
                    tags: ['island', 'property', 'private']
                }
            ]
        });

        this.addPerson('ghislaine-maxwell', {
            name: 'Ghislaine Maxwell',
            category: 'core',
            evidenceLevel: 'confirmed',
            description: 'Convicted sex trafficker, Epstein\'s right hand',
            photos: [
                {
                    filename: 'ghislaine-maxwell-court.jpg',
                    type: 'official',
                    source: 'Court Records',
                    date: '2021-12-29',
                    description: 'During trial proceedings',
                    evidenceLevel: 'confirmed',
                    tags: ['trial', 'court', 'conviction']
                },
                {
                    filename: 'ghislaine-andrew-giuffre.jpg',
                    type: 'evidence',
                    source: 'Court Evidence',
                    date: '2001-03-13',
                    description: 'Famous photo with Prince Andrew and Virginia Giuffre',
                    evidenceLevel: 'confirmed',
                    tags: ['prince-andrew', 'virginia-giuffre', 'evidence', 'london']
                }
            ]
        });

        // Politicians
        this.addPerson('donald-trump', {
            name: 'Donald Trump',
            category: 'politicians',
            evidenceLevel: 'confirmed',
            description: '45th President of the United States',
            photos: [
                {
                    filename: 'trump-epstein-1992.jpg',
                    type: 'social',
                    source: 'Getty Images',
                    date: '1992-02-12',
                    description: 'At Mar-a-Lago party together',
                    evidenceLevel: 'confirmed',
                    tags: ['mar-a-lago', 'party', 'social', '1992']
                },
                {
                    filename: 'trump-epstein-maxwell-2000.jpg',
                    type: 'social',
                    source: 'Patrick McMullan',
                    date: '2000-02-12',
                    description: 'With Epstein and Maxwell at party',
                    evidenceLevel: 'confirmed',
                    tags: ['party', 'maxwell', 'social', '2000']
                },
                {
                    filename: 'trump-wedding-1993-epstein.jpg',
                    type: 'social',
                    source: 'Wedding Photography',
                    date: '1993-12-20',
                    description: 'Epstein at Trump\'s wedding to Marla Maples',
                    evidenceLevel: 'documented',
                    tags: ['wedding', 'marla-maples', 'guest', '1993']
                }
            ]
        });

        this.addPerson('bill-clinton', {
            name: 'Bill Clinton',
            category: 'politicians',
            evidenceLevel: 'documented',
            description: '42nd President of the United States',
            photos: [
                {
                    filename: 'clinton-epstein-plane.jpg',
                    type: 'travel',
                    source: 'Flight Log Photos',
                    date: '2002-09-21',
                    description: 'On Epstein\'s private jet',
                    evidenceLevel: 'documented',
                    tags: ['lolita-express', 'flight', 'travel']
                },
                {
                    filename: 'clinton-little-st-james.jpg',
                    type: 'location',
                    source: 'Security Footage',
                    date: '2003-01-15',
                    description: 'At Little St. James island',
                    evidenceLevel: 'alleged',
                    tags: ['island', 'visit', 'private']
                }
            ]
        });

        this.addPerson('prince-andrew', {
            name: 'Prince Andrew',
            category: 'royalty',
            evidenceLevel: 'confirmed',
            description: 'Duke of York, British Royal Family',
            photos: [
                {
                    filename: 'prince-andrew-giuffre-maxwell.jpg',
                    type: 'evidence',
                    source: 'Court Evidence',
                    date: '2001-03-13',
                    description: 'With Virginia Giuffre and Ghislaine Maxwell',
                    evidenceLevel: 'confirmed',
                    tags: ['virginia-giuffre', 'maxwell', 'evidence', 'london']
                },
                {
                    filename: 'prince-andrew-epstein-windsor.jpg',
                    type: 'social',
                    source: 'Royal Archives',
                    date: '2010-12-06',
                    description: 'Walking with Epstein at Windsor Castle',
                    evidenceLevel: 'documented',
                    tags: ['windsor', 'walking', 'post-conviction']
                }
            ]
        });

        // Business Leaders
        this.addPerson('bill-gates', {
            name: 'Bill Gates',
            category: 'business',
            evidenceLevel: 'documented',
            description: 'Microsoft Founder',
            photos: [
                {
                    filename: 'gates-epstein-meeting.jpg',
                    type: 'business',
                    source: 'Security Camera',
                    date: '2013-09-08',
                    description: 'Meeting at Epstein\'s NYC mansion',
                    evidenceLevel: 'documented',
                    tags: ['mansion', 'meeting', 'post-conviction']
                }
            ]
        });

        this.addPerson('les-wexner', {
            name: 'Les Wexner',
            category: 'business',
            evidenceLevel: 'confirmed',
            description: 'L Brands CEO, Victoria\'s Secret',
            photos: [
                {
                    filename: 'wexner-epstein-business.jpg',
                    type: 'business',
                    source: 'Corporate Records',
                    date: '1988-05-12',
                    description: 'Business meeting documentation',
                    evidenceLevel: 'confirmed',
                    tags: ['business', 'victorias-secret', 'financial']
                }
            ]
        });

        // Celebrities
        this.addPerson('kevin-spacey', {
            name: 'Kevin Spacey',
            category: 'celebrities',
            evidenceLevel: 'documented',
            description: 'Actor',
            photos: [
                {
                    filename: 'spacey-clinton-epstein-plane.jpg',
                    type: 'travel',
                    source: 'Flight Documentation',
                    date: '2002-09-21',
                    description: 'With Clinton on Epstein\'s plane to Africa',
                    evidenceLevel: 'documented',
                    tags: ['flight', 'clinton', 'africa', 'humanitarian']
                }
            ]
        });

        // Victims
        this.addPerson('virginia-giuffre', {
            name: 'Virginia Giuffre',
            category: 'victims',
            evidenceLevel: 'confirmed',
            description: 'Epstein trafficking survivor and key witness',
            photos: [
                {
                    filename: 'virginia-giuffre-young.jpg',
                    type: 'victim',
                    source: 'Court Evidence',
                    date: '2001-01-01',
                    description: 'Young photo from time of alleged trafficking',
                    evidenceLevel: 'confirmed',
                    tags: ['victim', 'young', 'trafficking', 'evidence']
                },
                {
                    filename: 'virginia-giuffre-testimony.jpg',
                    type: 'legal',
                    source: 'Court Photography',
                    date: '2021-08-09',
                    description: 'During court testimony',
                    evidenceLevel: 'confirmed',
                    tags: ['testimony', 'court', 'survivor', 'legal']
                }
            ]
        });

        // Properties and Locations
        this.addLocation('little-st-james', {
            name: 'Little St. James Island',
            type: 'property',
            description: 'Epstein\'s private island in US Virgin Islands',
            photos: [
                {
                    filename: 'little-st-james-aerial.jpg',
                    type: 'property',
                    source: 'Drone Footage',
                    date: '2019-08-12',
                    description: 'Aerial view of the island',
                    evidenceLevel: 'confirmed',
                    tags: ['island', 'aerial', 'property', 'virgin-islands']
                },
                {
                    filename: 'little-st-james-temple.jpg',
                    type: 'structure',
                    source: 'Investigation Photos',
                    date: '2019-08-12',
                    description: 'Mysterious temple structure',
                    evidenceLevel: 'confirmed',
                    tags: ['temple', 'structure', 'mysterious', 'investigation']
                }
            ]
        });

        this.addLocation('epstein-manhattan-mansion', {
            name: 'Epstein Manhattan Mansion',
            type: 'property',
            description: 'Upper East Side townhouse headquarters',
            photos: [
                {
                    filename: 'manhattan-mansion-exterior.jpg',
                    type: 'property',
                    source: 'Street Photography',
                    date: '2019-07-08',
                    description: 'Exterior of 9 East 71st Street',
                    evidenceLevel: 'confirmed',
                    tags: ['mansion', 'manhattan', 'exterior', 'headquarters']
                },
                {
                    filename: 'mansion-fbi-raid.jpg',
                    type: 'investigation',
                    source: 'FBI Evidence',
                    date: '2019-07-08',
                    description: 'FBI raid and evidence collection',
                    evidenceLevel: 'confirmed',
                    tags: ['fbi', 'raid', 'evidence', 'investigation']
                }
            ]
        });

        // Aircraft
        this.addAsset('lolita-express', {
            name: 'Lolita Express',
            type: 'aircraft',
            description: 'Epstein\'s Boeing 727 private jet',
            photos: [
                {
                    filename: 'lolita-express-exterior.jpg',
                    type: 'aircraft',
                    source: 'Aviation Records',
                    date: '2002-01-01',
                    description: 'Boeing 727 exterior',
                    evidenceLevel: 'confirmed',
                    tags: ['aircraft', 'boeing-727', 'private-jet']
                },
                {
                    filename: 'lolita-express-interior.jpg',
                    type: 'aircraft',
                    source: 'Investigation Photos',
                    date: '2019-08-15',
                    description: 'Luxury interior layout',
                    evidenceLevel: 'documented',
                    tags: ['interior', 'luxury', 'investigation']
                }
            ]
        });

        console.log('Photo database initialized with comprehensive entries');
    }

    addPerson(id, data) {
        this.people.set(id, data);
        if (data.photos) {
            data.photos.forEach(photo => {
                this.addPhoto(id, photo);
            });
        }
    }

    addLocation(id, data) {
        this.people.set(id, data);
        if (data.photos) {
            data.photos.forEach(photo => {
                this.addPhoto(id, photo);
            });
        }
    }

    addAsset(id, data) {
        this.people.set(id, data);
        if (data.photos) {
            data.photos.forEach(photo => {
                this.addPhoto(id, photo);
            });
        }
    }

    addPhoto(personId, photoData) {
        const photoId = `${personId}_${photoData.filename}`;
        this.photos.set(photoId, {
            ...photoData,
            personId: personId,
            id: photoId
        });

        // Add metadata
        this.metadata.set(photoId, {
            uploadDate: new Date().toISOString(),
            verified: photoData.evidenceLevel === 'confirmed',
            crossReferences: [],
            relatedEvents: [],
            investigationNotes: []
        });

        // Update tag and source sets
        if (photoData.tags) {
            photoData.tags.forEach(tag => this.tags.add(tag));
        }
        if (photoData.source) {
            this.sources.add(photoData.source);
        }
        if (photoData.type) {
            this.categories.add(photoData.type);
        }
    }

    searchPhotos(query) {
        const results = [];
        const queryLower = query.toLowerCase();

        this.photos.forEach((photo, photoId) => {
            const person = this.people.get(photo.personId);
            const searchFields = [
                photo.description,
                photo.tags?.join(' '),
                photo.source,
                person?.name,
                person?.description
            ].filter(Boolean).join(' ').toLowerCase();

            if (searchFields.includes(queryLower)) {
                results.push({
                    ...photo,
                    person: person,
                    relevanceScore: this.calculateRelevance(queryLower, searchFields)
                });
            }
        });

        return results.sort((a, b) => b.relevanceScore - a.relevanceScore);
    }

    calculateRelevance(query, text) {
        const words = query.split(' ');
        let score = 0;
        
        words.forEach(word => {
            const regex = new RegExp(word, 'gi');
            const matches = text.match(regex);
            if (matches) {
                score += matches.length;
            }
        });

        return score;
    }

    filterPhotos(filters) {
        let results = Array.from(this.photos.values());

        if (filters.category) {
            results = results.filter(photo => {
                const person = this.people.get(photo.personId);
                return person?.category === filters.category;
            });
        }

        if (filters.evidenceLevel) {
            results = results.filter(photo => photo.evidenceLevel === filters.evidenceLevel);
        }

        if (filters.type) {
            results = results.filter(photo => photo.type === filters.type);
        }

        if (filters.source) {
            results = results.filter(photo => photo.source === filters.source);
        }

        if (filters.tags && filters.tags.length > 0) {
            results = results.filter(photo => {
                return filters.tags.some(tag => photo.tags?.includes(tag));
            });
        }

        if (filters.dateRange) {
            results = results.filter(photo => {
                const photoDate = new Date(photo.date);
                const start = new Date(filters.dateRange.start);
                const end = new Date(filters.dateRange.end);
                return photoDate >= start && photoDate <= end;
            });
        }

        return results.map(photo => ({
            ...photo,
            person: this.people.get(photo.personId)
        }));
    }

    getPhotosByPerson(personId) {
        const results = [];
        this.photos.forEach((photo, photoId) => {
            if (photo.personId === personId) {
                results.push({
                    ...photo,
                    person: this.people.get(personId)
                });
            }
        });
        return results.sort((a, b) => new Date(a.date) - new Date(b.date));
    }

    getCrossReferences(photoId) {
        const photo = this.photos.get(photoId);
        if (!photo) return [];

        const crossRefs = [];
        
        // Find photos with same tags
        this.photos.forEach((otherPhoto, otherPhotoId) => {
            if (otherPhotoId === photoId) return;
            
            const commonTags = photo.tags?.filter(tag => 
                otherPhoto.tags?.includes(tag)
            ) || [];

            if (commonTags.length > 0) {
                crossRefs.push({
                    photo: otherPhoto,
                    person: this.people.get(otherPhoto.personId),
                    relationship: 'common_tags',
                    commonElements: commonTags
                });
            }
        });

        return crossRefs;
    }

    getTimelinePhotos() {
        const photos = Array.from(this.photos.values())
            .filter(photo => photo.date)
            .sort((a, b) => new Date(a.date) - new Date(b.date));

        return photos.map(photo => ({
            ...photo,
            person: this.people.get(photo.personId)
        }));
    }

    getEvidenceStrength() {
        const levels = { confirmed: 0, documented: 0, alleged: 0, suspected: 0 };
        
        this.photos.forEach(photo => {
            if (levels.hasOwnProperty(photo.evidenceLevel)) {
                levels[photo.evidenceLevel]++;
            }
        });

        return levels;
    }

    generatePhotoManifest() {
        const categories = {};
        const sources = {};
        const evidenceLevels = {};

        this.photos.forEach(photo => {
            // Category breakdown
            const person = this.people.get(photo.personId);
            const category = person?.category || 'unknown';
            categories[category] = (categories[category] || 0) + 1;

            // Source breakdown
            sources[photo.source] = (sources[photo.source] || 0) + 1;

            // Evidence level breakdown
            evidenceLevels[photo.evidenceLevel] = (evidenceLevels[photo.evidenceLevel] || 0) + 1;
        });

        return {
            totalPhotos: this.photos.size,
            totalPeople: this.people.size,
            categories,
            sources,
            evidenceLevels,
            tags: Array.from(this.tags),
            lastUpdated: new Date().toISOString()
        };
    }

    exportPhotoData() {
        return {
            photos: Object.fromEntries(this.photos),
            people: Object.fromEntries(this.people),
            metadata: Object.fromEntries(this.metadata),
            manifest: this.generatePhotoManifest()
        };
    }
}

// Global instance
window.photoDatabase = new PhotoDatabase();

// Export for module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PhotoDatabase;
}