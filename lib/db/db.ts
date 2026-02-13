import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";
import { privateEnv } from "@/lib/env/private-env";

const client = postgres(privateEnv.DATABASE_URL);

export const db = drizzle(client, { schema });
