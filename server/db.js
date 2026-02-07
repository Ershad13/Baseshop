const Database = require('better-sqlite3');
const path = require('path');
const bcrypt = require('bcryptjs');

const db = new Database(path.join(__dirname, 'database.sqlite'));

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE,
    password TEXT,
    google_id TEXT UNIQUE,
    name TEXT,
    role TEXT DEFAULT 'user',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    description TEXT,
    price REAL,
    image_url TEXT,
    file_path TEXT
  );

  CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    total_amount REAL,
    status TEXT DEFAULT 'completed',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS order_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_id INTEGER,
    product_id INTEGER,
    price REAL,
    FOREIGN KEY (order_id) REFERENCES orders(id),
    FOREIGN KEY (product_id) REFERENCES products(id)
  );
`);

// Ensure role column exists (for existing databases)
try {
  db.exec('ALTER TABLE users ADD COLUMN role TEXT DEFAULT "user"');
} catch (e) {
  // Column might already exist
}

// Seed admin user if it doesn't exist
const adminEmail = 'ershaddehrami@gmail.com';
const adminUser = db.prepare('SELECT * FROM users WHERE email = ?').get(adminEmail);
if (!adminUser) {
  const hashedPassword = bcrypt.hashSync('drowssap', 10);
  db.prepare('INSERT INTO users (email, password, name, role) VALUES (?, ?, ?, ?)')
    .run(adminEmail, hashedPassword, 'Admin', 'admin');
}

// Seed products if empty
const productsCount = db.prepare('SELECT COUNT(*) as count FROM products').get();
if (productsCount.count === 0) {
  const insert = db.prepare('INSERT INTO products (name, description, price, image_url, file_path) VALUES (?, ?, ?, ?, ?)');
  insert.run('Modern Villa Plan', 'Detailed architectural plan for a modern 4-bedroom villa.', 49.99, 'https://images.unsplash.com/photo-1600585154340-be6191da1128?auto=format&fit=crop&w=800&q=80', 'villa_plan.pdf');
  insert.run('Sustainable Eco-Home', 'Eco-friendly house design with solar integration.', 59.99, 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=800&q=80', 'eco_home.pdf');
  insert.run('Urban Apartment Layout', 'Maximize space with this clever urban apartment design.', 29.99, 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80', 'apartment_layout.pdf');
  insert.run('Luxury Resort Masterplan', 'Grand masterplan for a luxury seaside resort.', 199.99, 'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=800&q=80', 'resort_masterplan.pdf');
  insert.run('Minimalist Studio Loft', 'Clean lines and open spaces for a modern studio.', 34.99, 'https://images.unsplash.com/photo-1536376074432-8d2a3ff44f5c?auto=format&fit=crop&w=800&q=80', 'studio_loft.pdf');
}

module.exports = db;
