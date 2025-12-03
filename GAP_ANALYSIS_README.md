# Gap Analysis & Priority Ranking Feature

## Overview

This feature identifies underserved populated places in Malawi and calculates priority scores to help education officials decide where to build new schools.

## How It Works

### Priority Score Calculation

The system calculates a priority score (0-100) for each populated place based on:

1. **Distance Weight (70%)**: Distance from the nearest school
   - Places farther from schools get higher scores
   - Normalized against the maximum distance parameter

2. **Settlement Size Weight (30%)**: Area of the populated place
   - Larger settlements get higher priority
   - Indicates more potential students

### Priority Levels

- **Critical (75-100)**: Immediate attention required
- **High (50-74)**: Should be included in planning
- **Medium (25-49)**: Monitor for future consideration
- **Low (0-24)**: Currently acceptable access

### Filtering

- Only includes places **more than 5km** from the nearest school
- Adjustable maximum distance parameter (5km, 10km, 15km, 20km)
- Configurable result limit (25, 50, 100, 200)

## Technical Implementation

### API Endpoint

**GET** `/api/gap-analysis`

**Query Parameters:**

- `maxDistance` (default: 10000) - Maximum distance in meters for normalization
- `limit` (default: 100) - Maximum number of results to return

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "place_id": 123,
      "place_type": "village",
      "place_geom": {...},
      "longitude": 34.5678,
      "latitude": -13.1234,
      "distance_meters": 8500.25,
      "area_sqkm": 2.45,
      "priority_score": 78.50,
      "priority_level": "critical"
    }
  ],
  "count": 50
}
```

### Database Query

Uses PostGIS spatial functions:

- `ST_Distance()` - Calculate distance to nearest school
- `ST_Transform()` - Convert to metric projection (EPSG:3857)
- `ST_Centroid()` - Get center point of populated places
- `ST_Area()` - Calculate settlement area
- `ST_AsGeoJSON()` - Export geometry for mapping

### Page Components

Located at: `/gap-analysis`

**Features:**

- Real-time statistics dashboard
- Adjustable analysis parameters
- Ranked list with visual priority indicators
- Responsive design with scroll area
- Loading states and error handling

## Usage

1. Navigate to "Gap Analysis" in the sidebar
2. Adjust parameters:
   - Set maximum distance for score normalization
   - Choose result limit
3. Click "Run Analysis"
4. Review results:
   - View summary statistics
   - Scroll through ranked list
   - Identify critical priority areas

## Future Enhancements

- Interactive map visualization with priority markers
- Export results to CSV/Excel
- Filter by district or region
- Road network integration for travel distance
- Historical trend analysis
- Multi-criteria scoring (population density, poverty levels, etc.)

## Database Requirements

Requires PostGIS extension with the following tables:

- `populated_places` - Settlement polygons
- `education_facilities` - School point locations

Both tables must have spatial indexes on geometry columns.
