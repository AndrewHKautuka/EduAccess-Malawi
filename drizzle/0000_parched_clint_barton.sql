-- Current sql file was generated after introspecting the database
-- If you want to run this migration please uncomment this code before executing migrations
/*
CREATE TABLE "spatial_ref_sys" (
	"srid" integer PRIMARY KEY NOT NULL,
	"auth_name" varchar(256),
	"auth_srid" integer,
	"srtext" varchar(2048),
	"proj4text" varchar(2048),
	CONSTRAINT "spatial_ref_sys_srid_check" CHECK ((srid > 0) AND (srid <= 998999))
);
--> statement-breakpoint
CREATE TABLE "populated_places" (
	"id" integer PRIMARY KEY NOT NULL,
	"geom" geometry(MultiPolygon,4326),
	"type" varchar
);
--> statement-breakpoint
CREATE TABLE "districts" (
	"id" varchar PRIMARY KEY NOT NULL,
	"geom" geometry(MultiPolygon,4326),
	"name" varchar
);
--> statement-breakpoint
CREATE TABLE "malawi" (
	"id" serial PRIMARY KEY NOT NULL,
	"geom" geometry(MultiPolygon,4326)
);
--> statement-breakpoint
CREATE TABLE "regions" (
	"id" varchar PRIMARY KEY NOT NULL,
	"geom" geometry(MultiPolygon,4326),
	"name" varchar
);
--> statement-breakpoint
CREATE TABLE "district_subdivisions" (
	"id" varchar PRIMARY KEY NOT NULL,
	"geom" geometry(Polygon,4326)
);
--> statement-breakpoint
CREATE TABLE "education_facilities" (
	"id" bigint PRIMARY KEY NOT NULL,
	"geom" geometry(Point,4326),
	"type" varchar
);
--> statement-breakpoint
CREATE TABLE "roads" (
	"id" integer PRIMARY KEY NOT NULL,
	"geom" geometry(LineString,4326)
);
--> statement-breakpoint
CREATE INDEX "sidx_populated_places_geom" ON "populated_places" USING gist ("geom" gist_geometry_ops_2d);--> statement-breakpoint
CREATE INDEX "sidx_districts_geom" ON "districts" USING gist ("geom" gist_geometry_ops_2d);--> statement-breakpoint
CREATE INDEX "sidx_malawi_geom" ON "malawi" USING gist ("geom" gist_geometry_ops_2d);--> statement-breakpoint
CREATE INDEX "sidx_regions_geom" ON "regions" USING gist ("geom" gist_geometry_ops_2d);--> statement-breakpoint
CREATE INDEX "sidx_district_subdivisions_geom" ON "district_subdivisions" USING gist ("geom" gist_geometry_ops_2d);--> statement-breakpoint
CREATE INDEX "sidx_education_facilities_geom" ON "education_facilities" USING gist ("geom" gist_geometry_ops_2d);--> statement-breakpoint
CREATE INDEX "sidx_roads_geom" ON "roads" USING gist ("geom" gist_geometry_ops_2d);--> statement-breakpoint
CREATE VIEW "public"."geography_columns" AS (SELECT current_database() AS f_table_catalog, n.nspname AS f_table_schema, c.relname AS f_table_name, a.attname AS f_geography_column, postgis_typmod_dims(a.atttypmod) AS coord_dimension, postgis_typmod_srid(a.atttypmod) AS srid, postgis_typmod_type(a.atttypmod) AS type FROM pg_class c, pg_attribute a, pg_type t, pg_namespace n WHERE t.typname = 'geography'::name AND a.attisdropped = false AND a.atttypid = t.oid AND a.attrelid = c.oid AND c.relnamespace = n.oid AND (c.relkind = ANY (ARRAY['r'::"char", 'v'::"char", 'm'::"char", 'f'::"char", 'p'::"char"])) AND NOT pg_is_other_temp_schema(c.relnamespace) AND has_table_privilege(c.oid, 'SELECT'::text));--> statement-breakpoint
CREATE VIEW "public"."geometry_columns" AS (SELECT current_database()::character varying(256) AS f_table_catalog, n.nspname AS f_table_schema, c.relname AS f_table_name, a.attname AS f_geometry_column, COALESCE(postgis_typmod_dims(a.atttypmod), sn.ndims, 2) AS coord_dimension, COALESCE(NULLIF(postgis_typmod_srid(a.atttypmod), 0), sr.srid, 0) AS srid, replace(replace(COALESCE(NULLIF(upper(postgis_typmod_type(a.atttypmod)), 'GEOMETRY'::text), st.type, 'GEOMETRY'::text), 'ZM'::text, ''::text), 'Z'::text, ''::text)::character varying(30) AS type FROM pg_class c JOIN pg_attribute a ON a.attrelid = c.oid AND NOT a.attisdropped JOIN pg_namespace n ON c.relnamespace = n.oid JOIN pg_type t ON a.atttypid = t.oid LEFT JOIN ( SELECT s.connamespace, s.conrelid, s.conkey, (regexp_match(s.consrc, 'geometrytype(w+)s*=s*(w+)'::text, 'i'::text))[1] AS type FROM ( SELECT pg_constraint.connamespace, pg_constraint.conrelid, pg_constraint.conkey, pg_get_constraintdef(pg_constraint.oid) AS consrc FROM pg_constraint) s WHERE s.consrc ~* 'geometrytype(w+)s*=s*w+'::text) st ON st.connamespace = n.oid AND st.conrelid = c.oid AND (a.attnum = ANY (st.conkey)) LEFT JOIN ( SELECT s.connamespace, s.conrelid, s.conkey, (regexp_match(s.consrc, 'ndims(w+)s*=s*(d+)'::text, 'i'::text))[1]::integer AS ndims FROM ( SELECT pg_constraint.connamespace, pg_constraint.conrelid, pg_constraint.conkey, pg_get_constraintdef(pg_constraint.oid) AS consrc FROM pg_constraint) s WHERE s.consrc ~* 'ndims(w+)s*=s*d+'::text) sn ON sn.connamespace = n.oid AND sn.conrelid = c.oid AND (a.attnum = ANY (sn.conkey)) LEFT JOIN ( SELECT s.connamespace, s.conrelid, s.conkey, (regexp_match(s.consrc, 'srid(w+)s*=s*(d+)'::text, 'i'::text))[1]::integer AS srid FROM ( SELECT pg_constraint.connamespace, pg_constraint.conrelid, pg_constraint.conkey, pg_get_constraintdef(pg_constraint.oid) AS consrc FROM pg_constraint) s WHERE s.consrc ~* 'srid(w+)s*=s*d+'::text) sr ON sr.connamespace = n.oid AND sr.conrelid = c.oid AND (a.attnum = ANY (sr.conkey)) WHERE (c.relkind = ANY (ARRAY['r'::"char", 'v'::"char", 'm'::"char", 'f'::"char", 'p'::"char"])) AND NOT c.relname = 'raster_columns'::name AND t.typname = 'geometry'::name AND NOT pg_is_other_temp_schema(c.relnamespace) AND has_table_privilege(c.oid, 'SELECT'::text));
*/