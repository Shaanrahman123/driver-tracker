import Database from 'better-sqlite3';
import path from 'path';

// Use a distinct file for the database
// In serverless environments like Vercel, the filesystem is read-only.
// We use /tmp as a fallback for temp storage, but for persistence, 
// a managed database (PostgreSQL/MongoDB) is required.
const isProd = process.env.NODE_ENV === 'production';
const dbPath = isProd
  ? path.join('/tmp', 'tracker.db')
  : path.resolve(process.cwd(), 'tracker.db');

if (isProd) {
  console.warn('⚠️ TrackPro: Running in production (Serverless). Using /tmp/tracker.db which is NOT persistent. For live apps, please connect a remote SQL database.');
}

const db = new Database(dbPath);
db.pragma('journal_mode = WAL'); // Improve performance and concurrency

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
