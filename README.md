# Malawi School Accessibility & Education Planning Tool

A web-based GIS application that helps Malawi education officials visualize school locations, analyze accessibility from populated areas, and identify underserved communities for evidence-based infrastructure planning.

## Overview

The tool focuses on quickly answering questions like:

- Where are communities beyond reasonable distance to a school?
- What are the average distances to the nearest school across regions?
- Which places should be prioritized for new school construction?

## Tech Stack

- **Frontend**: Next.js 16, React 19, TypeScript
- **UI**: shadcn/ui, TailwindCSS v4, Lucide React
- **State**: Zustand
- **Database**: PostgreSQL with PostGIS

## Features

- **Map visualization**: Interactive map with layers for administrative boundaries, schools, populated places, and roads
- **Coverage analysis (MVP)**: Buffer-based analysis and straight-line distances to identify underserved areas
- **Basic statistics (MVP)**: School counts, average distances, school-to-population ratios
- **Planned**: Priority scoring of underserved locations, road network (pgRouting) distances, and exportable reports (PDF/CSV)

## Data Model

- **admin_boundaries**: Administrative subdivisions (Polygon)
- **education_facilities**: Schools with attributes (Point)
- **populated_places**: Settlements with population (Point)
- **roads**: Road network for travel analysis (LineString)

Computed/derived data includes school coverage buffers (2km/5km/10km), outside-coverage places, a distance matrix, priority scores, and road-based travel distances.

## Getting Started

### Prerequisites

- Node.js and pnpm
- PostgreSQL with the PostGIS extension enabled

### 1) Install dependencies

```bash
pnpm install
```

### 2) Database setup

Create a database and enable PostGIS (example shown for local development):

```sql
CREATE DATABASE malawi_education;
\c malawi_education
CREATE EXTENSION IF NOT EXISTS postgis;
```

Create spatial tables and indexes (simplified; see PLANNING.md for full details):

```sql
-- Example table outlines
-- admin_boundaries (id, name, level, geom GEOMETRY(Polygon, 4326))
-- education_facilities (id, name, type, capacity, geom GEOMETRY(Point, 4326))
-- populated_places (id, name, population, geom GEOMETRY(Point, 4326))
-- roads (id, name, road_type, geom GEOMETRY(LineString, 4326))

-- Spatial indexes
-- CREATE INDEX ON admin_boundaries USING GIST (geom);
-- CREATE INDEX ON education_facilities USING GIST (geom);
-- CREATE INDEX ON populated_places USING GIST (geom);
-- CREATE INDEX ON roads USING GIST (geom);
```

### 3) Configure environment

Create `.env.local` with your database connection string:

```bash
DATABASE_URL="postgresql://USER:PASS@localhost:5432/malawi_education"
```

### 4) Run the development server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## API (planned)

- `GET /api/map/layers` - GeoJSON for map layers
- `GET /api/analysis/coverage?radius=5000` - Coverage analysis results
- `GET /api/statistics/[subdivision]` - Aggregated statistics
- `GET /api/priorities` - Ranked underserved locations
- `GET /api/export/[format]` - Data exports (CSV/PDF)

## Spatial Analysis Overview

Example query to find populated places outside a 5km school coverage buffer:

```sql
SELECT p.*
FROM populated_places p
WHERE NOT EXISTS (
    SELECT 1 FROM education_facilities e
    WHERE ST_DWithin(p.geom, e.geom, 5000)
);
```

Priority scoring (planned):

```text
score = (distance_to_nearest_school / max_distance) * (population / max_population)
```

## Data Requirements (Geojson)

- Malawi administrative boundaries
- School locations with attributes
- Populated places with populations
- Road network data

## Performance Considerations (design)

- Spatial indexes on geometry columns
- Materialized views for complex queries
- Pagination for large result sets
- Client-side caching and geometry simplification at lower zooms

## Contributing

- Review `PLANNING.md` and `TASKS.md` before starting work.
