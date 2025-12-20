import { db } from './db/index.js';
import { sql } from 'drizzle-orm';
async function main() {
    try {
        console.log('Testing database connection...');
        const result = await db.execute(sql `SELECT NOW()`);
        console.log('Connection successful:', result);
        // Optional: Try to query users table if it exists
        // const allUsers = await db.select().from(users);
        // console.log('Users:', allUsers);
        process.exit(0);
    }
    catch (error) {
        console.error('Database connection failed:', error);
        process.exit(1);
    }
}
main();
