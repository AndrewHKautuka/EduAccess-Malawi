import { drizzle as drizzleOrm } from "drizzle-orm/singlestore/driver"

import env from "@/config/env"

export const drizzle = drizzleOrm(env.DATABASE_URL)
