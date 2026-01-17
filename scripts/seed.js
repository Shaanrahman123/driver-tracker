const Database = require('better-sqlite3');
const bcrypt = require('bcryptjs');
const path = require('path');

const db = new Database(path.join(__dirname, '../tracker.db'));

// Clear existing tables if any
db.exec(`
  DROP TABLE IF EXISTS attendance;
  DROP TABLE IF EXISTS users;
`);

// Create tables with latest schema
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

console.log('Database tables recreated.');

// Seed Admin
const adminHash = bcrypt.hashSync('admin123', 10);
try {
  db.prepare("INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)").run('System Admin', 'admin@example.com', adminHash, 'admin');
  console.log('Admin user created: admin@example.com / admin123');
} catch (e) {
  console.log('Admin already exists.');
}

// Seed Sample Driver
const driverHash = bcrypt.hashSync('9801540172', 10);
try {
  db.prepare("INSERT INTO users (name, email, phone, gender, password, role) VALUES (?, ?, ?, ?, ?, ?)").run(
    'Shaan Rahman', 
    'driver@example.com', 
    '9801540172', 
    'Male', 
    driverHash, 
    'driver'
  );
  console.log('Sample driver created: 9801540172');
} catch (e) {
  console.log('Sample driver already exists.');
}
