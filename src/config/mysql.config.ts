import dotenv from 'dotenv';
import { createPool } from 'mysql2/promise';

dotenv.config();
export const connection = async () => {
    const pool = await createPool({
        host: process.env.DB_HOST,
        database: process.env.DB_NAME,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        port: 3306 || process.env.DB_PORT,
        connectionLimit: 10 || process.env.DB_CONNECTION_LIMIT,
    });
    return pool;
}