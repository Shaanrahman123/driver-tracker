import Database from 'better-sqlite3';
import path from 'path';

// Use a distinct file for the database
const dbPath = path.resolve(process.cwd(), 'tracker.db');
const db = new Database(dbPath);

// Initialize tables
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    email TEXT UNIQUE,
    password TEXT,
    phone TEXT UNIQUE,
    gender TEXT,
    role TEXT DEFAULT 'driver',
    otp TEXT,
    otp_expiry INTEGER
  );

  CREATE TABLE IF NOT EXISTS attendance (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    date TEXT,
    timestamp INTEGER,
    latitude REAL,
    longitude REAL,
    address TEXT,
    image TEXT,
    status TEXT DEFAULT 'pending',
    type TEXT DEFAULT 'clock_in',
    FOREIGN KEY(user_id) REFERENCES users(id)
  );
`);

export default db;
