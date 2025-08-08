import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import * as schema from './schema';

// Database connection
const connectionString = process.env.DATABASE_URL || 'postgresql://localhost:5432/coursegenie';

// Create postgres client
const client = postgres(connectionString, {
  max: 1,
  idle_timeout: 20,
  connect_timeout: 10,
});

// Create drizzle instance
export const db = drizzle(client, { schema });

// Run migrations in development
if (process.env.NODE_ENV === 'development') {
  migrate(db, { migrationsFolder: './drizzle' }).catch(console.error);
}

export default db; 