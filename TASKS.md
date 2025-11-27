# Initial Tasks - Malawi School Accessibility Tool

## Environment Setup

### 1. Project Initialization

- [x] Create Next.js 16 project with TypeScript
- [x] Install dependencies: shadcn/ui, TailwindCSS v4, Lucide React, Zustand
- [x] Configure TypeScript strict mode
- [ ] Set up project structure

### 2. Database Setup

- [x] Install PostgreSQL locally or use Docker container
- [x] Enable PostGIS extension: `CREATE EXTENSION postgis;`
- [x] Create database: `eduaccess-malawi`
- [ ] Set up connection pooling (pg library)
- [x] Create `.env.development` with DATABASE_URL

### 3. Schema Creation

- [x] Create spatial tables with geometry columns
- [x] Create spatial indexes: `CREATE INDEX ON [table] USING GIST (geom);`
- [x] Add check constraints for valid geometries

### 4. Sample Data Loading

- [ ] Source sample Malawi datasets (HDX)
- [ ] Write data import scripts
- [ ] Load test data
- [ ] Validate data: check geometry validity, coordinate system

## Core Development

### 5. Database Layer

- [x] Create connection helper file
- [ ] Write spatial query functions, e.g.:
  - `getSchools()`, `getPopulatedPlaces()`, `getBoundaries()`
  - `getSchoolsWithinRadius(lat, lng, radius)`
  - `getUnderservedAreas(radius)`
  - `calculateDistances()`
- [ ] Add TypeScript types for all spatial data

### 6. API Routes

- [ ] `/api/map/layers/[layer]` - Return GeoJSON for schools, places, boundaries
- [ ] `/api/analysis/coverage?radius=5000` - Coverage analysis
- [ ] `/api/statistics/national` - National statistics

### 7. Map Component

- [ ] Install Mapbox GL JS or Leaflet
- [ ] Create `<Map>` component with basic controls
- [ ] Add GeoJSON layers from API
- [ ] Implement layer toggle controls
- [ ] Add click handlers for feature info popups
- [ ] Style features by type (different icons/colors)

### 8. State Management

- [ ] Create Zustand store for:
  - Active layers (schools, places, boundaries, roads)
  - Selected coverage radius
  - Analysis results
  - Loading states
- [ ] Connect store to Map and UI components

### 9. UI Components

- [ ] Build layer control panel (checkboxes for toggles)
- [ ] Create coverage radius selector (dropdown: 2km, 5km, 10km)
- [ ] Design statistics dashboard (cards with key metrics)
- [ ] Add loading indicators and error states
- [ ] Implement responsive layout

## Spatial Analysis

### 10. Coverage Analysis Function

- [ ] Implement buffer-based coverage:
- [ ] Identify places outside coverage
- [ ] Calculate percentage of population with access
- [ ] Return results as GeoJSON for map visualization

### 11. Statistics Calculation

- [ ] Total schools by type
- [ ] Average distance to nearest school
- [ ] School-to-population ratio
- [ ] Coverage statistics by administrative area
- [ ] Create `/api/statistics/[subdivision]` route

### 12. Priority Scoring

- [ ] Calculate priority score: `(distance/max_distance) * (population/max_population)`
- [ ] Rank top 20 underserved locations
- [ ] Add to analysis results endpoint
- [ ] Display in sortable table component

## Testing & Validation

### 13. Spatial Query Testing

- [ ] Verify distance calculations (compare against manual checks)
- [ ] Test edge cases: boundary areas, isolated settlements
- [ ] Validate geometry operations (no invalid geometries)
- [ ] Check performance with spatial indexes

### 14. Integration Testing

- [ ] Test full workflow: layer loading → analysis → results display
- [ ] Verify GeoJSON format correctness
- [ ] Test with different coverage radii
- [ ] Check map rendering with real data

## Documentation

### 15. Technical Documentation

- [ ] Document spatial queries and their purpose
- [ ] Add comments to complex geometry operations
- [ ] Create README with setup instructions
- [ ] Document API endpoints with example requests/responses

### 16. User Guide

- [ ] Screenshot walkthrough of key features
- [ ] Explain coverage analysis methodology
- [ ] Document data sources and assumptions
- [ ] Add troubleshooting section
