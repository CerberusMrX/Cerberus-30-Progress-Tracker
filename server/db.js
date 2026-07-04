import fs from 'fs/promises';
import path from 'path';

const DB_PATH = path.join(process.cwd(), 'database.json');

async function initializeDB() {
    try {
        await fs.access(DB_PATH);
    } catch {
        await fs.writeFile(DB_PATH, JSON.stringify({ challenges: [], days: [] }));
    }
}
initializeDB();

export async function readDB() {
    const data = await fs.readFile(DB_PATH, 'utf8');
    return JSON.parse(data);
}

export async function writeDB(data) {
    await fs.writeFile(DB_PATH, JSON.stringify(data, null, 2));
}

export const generateId = () => Math.random().toString(36).substring(2, 15);
