# Dashboard Module — Integration Notes

This module provides the frontend skeleton for the Dashboard feature (statistics, metrics, charts, subdivision selector). It is intentionally implementation-light so the backend/PostGIS integration can be implemented separately.

## Purpose

- Provide typed interfaces for dashboard data (GeoJSON-aware).
- Provide thin components (with loading/error states) that will consume real API responses.
- Provide hooks and a Zustand store for filter state shared across the application.
- Provide server-action signatures and validation schemas for the backend implementer.

## Public API (frontend)

- Exports (see `src/modules/dashboard/index.ts`): components, hooks, types, utils, validations.
- Client hooks:
  - `useDashboardData(filters)` — fetches `/api/dashboard/stats` and returns typed data.
  - `useDashboardFilters()` — uses a Zustand store to manage filters and sync with URL query params.

## Expected Backend Contracts

- Endpoints:
  - `GET /api/dashboard/stats` — query params: `subdivisionId?: string`, `radiusMeters?: number`.
    - Response: `{ status: 'success', data: DashboardStats }` or `{ status: 'error', error: string }`.
  - `GET /api/dashboard/subdivisions` — returns list of subdivision GeoJSONs and metadata.
- Server Actions:
  - Exported functions in `src/modules/dashboard/actions/dashboard-actions.ts` will validate inputs with Zod and then perform database queries.

## Spatial & PostGIS Guidelines (for backend implementer)

- Use parameterized queries only — never interpolate values into SQL strings.
- Create GiST indexes on geometry columns for fast spatial queries.
- Use `ST_DWithin(geom::geography, ST_MakePoint(lon, lat)::geography, radius)` for radial queries.
- Store geometries in EPSG:4326; explicitly transform to/from other CRSes on the server when required.
- Return GeoJSON geometry properties using PostGIS `ST_AsGeoJSON` and construct proper FeatureCollections.

## Integration Points with Other Features

- Filters are stored in a dedicated Zustand store (`useDashboardFiltersStore`) — other features can read/write the filters to affect dashboard data.
- URL query param sync: the filters hook syncs with `window.location.search` — other features that add query params should namespace theirs to avoid collision.
- Metric and subdivision types are exported from `types/dashboard-types.ts`. Reuse these exported types in other modules to ensure consistent typing across the app.

## How to Connect Server Actions

1. Validate input using `dashboard-validations.ts` Zod schemas.
2. Use a server-only database connection / query runner.
3. Return the `DashboardStatsResponse` shape defined in `types/dashboard-types.ts`.

## Notes for Frontend Engineers

- Do not hard-code API response shapes; use the exported types and the provided hooks.
- Prefer server actions for heavy spatial queries executed on the server to avoid exposing database credentials in the client.
- If doing client-side fetches, ensure you handle `undefined` responses and error shapes.

## Checklist Before Deploying with Real Data

- [ ] Server actions implemented and tested with PostGIS.
- [ ] GiST indexes created for geometry columns.
- [ ] API returns full GeoJSON FeatureCollections.
- [ ] Unit tests for utils and transformations.

---

If you'd like, I can scaffold example server action implementations (server-only files) that demonstrate parameterized PostGIS queries and the use of `ST_DWithin()` — ask when you're ready to implement backend integration.
