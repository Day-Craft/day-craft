import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as databaseSchema from './schema';

if (!process.env.DATABASE_URL) throw new Error('Cannot migrate. DATABASE_URL is not set');

const databasePool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

databasePool
  .connect()
  .then(() => {
    console.log('Connected to database');
  })
  .catch((err) => {
    console.log('Error connecting to database', err);
  });

const databaseInstance = drizzle(databasePool, { schema: databaseSchema });

export default databaseInstance;
