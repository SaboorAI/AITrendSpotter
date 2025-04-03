import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { products } from '@shared/schema';
import { initializeSampleProducts } from './db';

// Create a Postgres.js client
const client = postgres(process.env.DATABASE_URL!);

// Create a Drizzle ORM instance using the Postgres.js client
const db = drizzle(client);

async function resetDatabase() {
  try {
    console.log('Resetting database products...');
    
    // Delete all existing products
    await db.delete(products).execute();
    console.log('Existing products removed');
    
    // Add new sample products
    await initializeSampleProducts();
    console.log('New sample products added');
    
    console.log('Database reset complete');
  } catch (error) {
    console.error('Error resetting database:', error);
  } finally {
    // Close the Postgres client
    await client.end();
  }
}

// Run the reset function
resetDatabase();