import { SQL, Subquery } from "drizzle-orm"
import { PgTable } from "drizzle-orm/pg-core"
import { PgViewBase } from "drizzle-orm/pg-core/view-base"

export type DatabaseQueryable = PgTable | Subquery | PgViewBase | SQL
