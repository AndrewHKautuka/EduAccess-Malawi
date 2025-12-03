import { sql } from "drizzle-orm";
import { bigint, check, geometry, index, integer, pgTable, pgView, serial, text, varchar } from "drizzle-orm/pg-core";



export const spatialRefSys = pgTable("spatial_ref_sys", {
	srid: integer().primaryKey().notNull(),
	authName: varchar("auth_name", { length: 256 }),
	authSrid: integer("auth_srid"),
	srtext: varchar({ length: 2048 }),
	proj4Text: varchar({ length: 2048 }),
}, (table) => [
	check("spatial_ref_sys_srid_check", sql`(srid > 0) AND (srid <= 998999)`),
]);

export const populatedPlaces = pgTable("populated_places", {
	id: integer().primaryKey().notNull(),
	geom: geometry({ type: "multipolygon", srid: 4326 }),
	type: varchar(),
}, (table) => [
	index("sidx_populated_places_geom").using("gist", table.geom.asc().nullsLast().op("gist_geometry_ops_2d")),
]);

export const districts = pgTable("districts", {
	id: varchar().primaryKey().notNull(),
	geom: geometry({ type: "multipolygon", srid: 4326 }),
	name: varchar(),
}, (table) => [
	index("sidx_districts_geom").using("gist", table.geom.asc().nullsLast().op("gist_geometry_ops_2d")),
]);

export const malawi = pgTable("malawi", {
	id: serial().primaryKey().notNull(),
	geom: geometry({ type: "multipolygon", srid: 4326 }),
}, (table) => [
	index("sidx_malawi_geom").using("gist", table.geom.asc().nullsLast().op("gist_geometry_ops_2d")),
]);

export const regions = pgTable("regions", {
	id: varchar().primaryKey().notNull(),
	geom: geometry({ type: "multipolygon", srid: 4326 }),
	name: varchar(),
}, (table) => [
	index("sidx_regions_geom").using("gist", table.geom.asc().nullsLast().op("gist_geometry_ops_2d")),
]);

export const districtSubdivisions = pgTable("district_subdivisions", {
	id: varchar().primaryKey().notNull(),
	geom: geometry({ type: "polygon", srid: 4326 }),
}, (table) => [
	index("sidx_district_subdivisions_geom").using("gist", table.geom.asc().nullsLast().op("gist_geometry_ops_2d")),
]);

export const educationFacilities = pgTable("education_facilities", {
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	id: bigint({ mode: "number" }).primaryKey().notNull(),
	geom: geometry({ type: "point", srid: 4326 }),
	type: varchar(),
}, (table) => [
	index("sidx_education_facilities_geom").using("gist", table.geom.asc().nullsLast().op("gist_geometry_ops_2d")),
]);

export const roads = pgTable("roads", {
	id: integer().primaryKey().notNull(),
	geom: geometry({ type: "linestring", srid: 4326 }),
}, (table) => [
	index("sidx_roads_geom").using("gist", table.geom.asc().nullsLast().op("gist_geometry_ops_2d")),
]);
export const geographyColumns = pgView("geography_columns", {	// TODO: failed to parse database type 'name'
	fTableCatalog: text("f_table_catalog"),
	// TODO: failed to parse database type 'name'
	fTableSchema: text("f_table_schema"),
	// TODO: failed to parse database type 'name'
	fTableName: text("f_table_name"),
	// TODO: failed to parse database type 'name'
	fGeographyColumn: text("f_geography_column"),
	coordDimension: integer("coord_dimension"),
	srid: integer(),
	type: text(),
}).as(sql`SELECT current_database() AS f_table_catalog, n.nspname AS f_table_schema, c.relname AS f_table_name, a.attname AS f_geography_column, postgis_typmod_dims(a.atttypmod) AS coord_dimension, postgis_typmod_srid(a.atttypmod) AS srid, postgis_typmod_type(a.atttypmod) AS type FROM pg_class c, pg_attribute a, pg_type t, pg_namespace n WHERE t.typname = 'geography'::name AND a.attisdropped = false AND a.atttypid = t.oid AND a.attrelid = c.oid AND c.relnamespace = n.oid AND (c.relkind = ANY (ARRAY['r'::"char", 'v'::"char", 'm'::"char", 'f'::"char", 'p'::"char"])) AND NOT pg_is_other_temp_schema(c.relnamespace) AND has_table_privilege(c.oid, 'SELECT'::text)`);

export const geometryColumns = pgView("geometry_columns", {	fTableCatalog: varchar("f_table_catalog", { length: 256 }),
	// TODO: failed to parse database type 'name'
	fTableSchema: text("f_table_schema"),
	// TODO: failed to parse database type 'name'
	fTableName: text("f_table_name"),
	// TODO: failed to parse database type 'name'
	fGeometryColumn: text("f_geometry_column"),
	coordDimension: integer("coord_dimension"),
	srid: integer(),
	type: varchar({ length: 30 }),
}).as(sql`SELECT current_database()::character varying(256) AS f_table_catalog, n.nspname AS f_table_schema, c.relname AS f_table_name, a.attname AS f_geometry_column, COALESCE(postgis_typmod_dims(a.atttypmod), sn.ndims, 2) AS coord_dimension, COALESCE(NULLIF(postgis_typmod_srid(a.atttypmod), 0), sr.srid, 0) AS srid, replace(replace(COALESCE(NULLIF(upper(postgis_typmod_type(a.atttypmod)), 'GEOMETRY'::text), st.type, 'GEOMETRY'::text), 'ZM'::text, ''::text), 'Z'::text, ''::text)::character varying(30) AS type FROM pg_class c JOIN pg_attribute a ON a.attrelid = c.oid AND NOT a.attisdropped JOIN pg_namespace n ON c.relnamespace = n.oid JOIN pg_type t ON a.atttypid = t.oid LEFT JOIN ( SELECT s.connamespace, s.conrelid, s.conkey, (regexp_match(s.consrc, 'geometrytype(w+)s*=s*(w+)'::text, 'i'::text))[1] AS type FROM ( SELECT pg_constraint.connamespace, pg_constraint.conrelid, pg_constraint.conkey, pg_get_constraintdef(pg_constraint.oid) AS consrc FROM pg_constraint) s WHERE s.consrc ~* 'geometrytype(w+)s*=s*w+'::text) st ON st.connamespace = n.oid AND st.conrelid = c.oid AND (a.attnum = ANY (st.conkey)) LEFT JOIN ( SELECT s.connamespace, s.conrelid, s.conkey, (regexp_match(s.consrc, 'ndims(w+)s*=s*(d+)'::text, 'i'::text))[1]::integer AS ndims FROM ( SELECT pg_constraint.connamespace, pg_constraint.conrelid, pg_constraint.conkey, pg_get_constraintdef(pg_constraint.oid) AS consrc FROM pg_constraint) s WHERE s.consrc ~* 'ndims(w+)s*=s*d+'::text) sn ON sn.connamespace = n.oid AND sn.conrelid = c.oid AND (a.attnum = ANY (sn.conkey)) LEFT JOIN ( SELECT s.connamespace, s.conrelid, s.conkey, (regexp_match(s.consrc, 'srid(w+)s*=s*(d+)'::text, 'i'::text))[1]::integer AS srid FROM ( SELECT pg_constraint.connamespace, pg_constraint.conrelid, pg_constraint.conkey, pg_get_constraintdef(pg_constraint.oid) AS consrc FROM pg_constraint) s WHERE s.consrc ~* 'srid(w+)s*=s*d+'::text) sr ON sr.connamespace = n.oid AND sr.conrelid = c.oid AND (a.attnum = ANY (sr.conkey)) WHERE (c.relkind = ANY (ARRAY['r'::"char", 'v'::"char", 'm'::"char", 'f'::"char", 'p'::"char"])) AND NOT c.relname = 'raster_columns'::name AND t.typname = 'geometry'::name AND NOT pg_is_other_temp_schema(c.relnamespace) AND has_table_privilege(c.oid, 'SELECT'::text)`);
