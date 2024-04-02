import * as databaseSchema from './schema';
import { DATABASE_URL } from '../../constants';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';

if (!DATABASE_URL) throw new Error('Cannot migrate. DATABASE_URL is not set');

const databasePool = new Pool({
  connectionString: DATABASE_URL,
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
