# Malawi School Accessibility & Education Planning Tool

## Project Overview

Web-based GIS application for Malawi education officials to visualize school locations, analyze accessibility from populated areas, and identify underserved communities for evidence-based infrastructure planning.

## Core Problem

Education officials lack spatial analysis tools to:

- Identify areas with inadequate school access
- Understand distance barriers causing dropouts
- Plan optimal locations for new schools
- Analyze road connectivity to schools

## Technical Architecture

### Stack

- **Frontend**: Next.js 16, React 19, TypeScript
- **UI**: shadcn/ui, TailwindCSS v4, Lucide React
- **State**: Zustand
- **Database**: PostgreSQL with PostGIS extension

### PostGIS Capabilities Used

- **Spatial data types**: Points (schools, settlements), LineStrings (roads), Polygons (admin boundaries)
- **Spatial functions**: ST_Distance, ST_DWithin, ST_Buffer, ST_Intersects, ST_Within, ST_Length
- **Spatial indexes**: GiST indexes for efficient spatial queries
- **Distance calculations**: Both Euclidean (straight-line) and network-based (road) distances

## Data Models

### Core Tables

1. **admin_boundaries** - Administrative subdivisions (geometry: Polygon)
2. **education_facilities** - Schools with type/capacity (geometry: Point)
3. **populated_places** - Settlements with population (geometry: Point)
4. **roads** - Road network for travel analysis (geometry: LineString)

### Computed/Derived Data

- School coverage buffers (various radii: 2km, 5km, 10km)
- Populated places outside coverage areas
- Distance matrix (places to nearest schools)
- Priority scores (distance × population)
- Road-based travel distances

## Key Features Scope

### Phase 1 (MVP)

1. **Map Visualization**: Interactive map with all layers, toggle controls, basic navigation
2. **Coverage Analysis**: Buffer zones, identify underserved areas, straight-line distance calculations
3. **Basic Statistics**: School counts, average distances, schools-to-population ratios

### Phase 2

4. **Gap Analysis**: Priority scoring, ranked list of underserved locations
5. **Road Network**: Network-based distance calculations, connectivity analysis

### Phase 3

6. **Reports**: PDF generation, CSV/Excel exports, subdivision-specific reports

## Spatial Analysis Approach

### Coverage Calculation

```sql
-- Find populated places outside 5km school coverage
SELECT p.* FROM populated_places p
WHERE NOT EXISTS (
  SELECT 1 FROM education_facilities e
  WHERE ST_DWithin(p.geom, e.geom, 5000)
)
```

### Priority Scoring

Priority = (distance_to_nearest_school / max_distance) × (population / max_population)

### Distance Types

- **Euclidean**: ST_Distance for straight-line (initial implementation)
- **Network**: ST_Length along road paths using pgRouting (Phase 2)

## Map Implementation

- **Library**: Mapbox GL JS or Leaflet with vector tiles
- **Basemap**: OpenStreetMap or Mapbox Streets
- **Layers**: GeoJSON from PostGIS queries
- **Interactions**: Click for details, layer toggles, zoom to features

## Performance Considerations

- Spatial indexes on all geometry columns
- Materialized views for complex calculations
- Pagination for large result sets
- Client-side caching of static boundaries
- Geometry simplification for display at lower zoom levels

## Data Requirements

- Malawi administrative boundaries (GeoJSON/Shapefile)
- School locations with attributes (CSV with coordinates or GeoJSON)
- Populated places with population data
- Road network data (OpenStreetMap extract)

## API Structure

- `/api/map/layers` - GeoJSON for map layers
- `/api/analysis/coverage` - Coverage analysis results
- `/api/statistics/[subdivision]` - Aggregated statistics
- `/api/priorities` - Ranked underserved locations
- `/api/export/[format]` - Data exports

## Success Criteria

- Visualize 100% of schools and populated places
- Calculate coverage within 10 seconds for any radius
- Identify top 20 priority locations for new schools
- Generate reports in under 30 seconds
- Support concurrent users (5+ simultaneously)

## Out of Scope

- Real-time data updates from field
- Mobile data collection
- Student enrollment tracking
- Budget/cost estimation tools
- User authentication (assume single organization use)
