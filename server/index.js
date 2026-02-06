require('dotenv').config();
const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const session = require('express-session');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const db = require('./db');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());

// Session configuration
app.use(session({
  secret: process.env.SESSION_SECRET || 'keyboard cat',
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

// Passport Google Strategy
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  passport.use(new GoogleStrategy({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.CALLBACK_URL || "http://localhost:5000/api/auth/google/callback"
    },
    (accessToken, refreshToken, profile, done) => {
      let user = db.prepare('SELECT * FROM users WHERE email = ?').get(profile.emails[0].value);

      if (!user) {
        db.prepare('INSERT INTO users (email, password, name, google_id) VALUES (?, ?, ?, ?)')
          .run(profile.emails[0].value, 'google-auth-no-password', profile.displayName, profile.id);
        user = db.prepare('SELECT * FROM users WHERE google_id = ?').get(profile.id);
      }

      return done(null, user);
    }
  ));
}

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  const user = db.prepare('SELECT * FROM users WHERE id = ?').get(id);
  done(null, user);
});

app.use('/downloads', express.static(path.join(__dirname, 'downloads')));

// Auth Middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.sendStatus(401);

  jwt.verify(token, process.env.JWT_SECRET || 'secret', (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// --- AUTH ROUTES ---

// Google Auth Routes
app.get('/api/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] }));

app.get('/api/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => {
    const token = jwt.sign(
      { id: req.user.id, email: req.user.email, name: req.user.name },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '24h' }
    );
    res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}/login?token=${token}`);
  });

app.post('/api/signup', async (req, res) => {
  const { email, password, name } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const info = db.prepare('INSERT INTO users (email, password, name) VALUES (?, ?, ?)').run(email, hashedPassword, name);
    const token = jwt.sign({ id: info.lastInsertRowid, email, name }, process.env.JWT_SECRET || 'secret');
    res.json({ token, user: { id: info.lastInsertRowid, email, name } });
  } catch (err) {
    res.status(400).json({ message: 'Email already exists' });
  }
});

app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const token = jwt.sign({ id: user.id, email: user.email, name: user.name }, process.env.JWT_SECRET || 'secret');
  res.json({ token, user: { id: user.id, email: user.email, name: user.name } });
});

// --- PRODUCT ROUTES ---

app.get('/api/products', (req, res) => {
  const products = db.prepare('SELECT id, name, description, price, image_url FROM products').all();
  res.json(products);
});

app.get('/api/products/:id', (req, res) => {
  const product = db.prepare('SELECT * FROM products WHERE id = ?').get(req.params.id);
  if (!product) return res.status(404).json({ message: 'Product not found' });
  res.json(product);
});

// --- ORDER ROUTES ---

app.post('/api/orders', authenticateToken, (req, res) => {
  const { items, total } = req.body;

  const transaction = db.transaction(() => {
    const info = db.prepare('INSERT INTO orders (user_id, total_amount) VALUES (?, ?)').run(req.user.id, total);
    const orderId = info.lastInsertRowid;

    const insertItem = db.prepare('INSERT INTO order_items (order_id, product_id, price) VALUES (?, ?, ?)');
    for (const item of items) {
      insertItem.run(orderId, item.id, item.price);
    }
    return orderId;
  });

  try {
    const orderId = transaction();
    res.json({ orderId, message: 'Order placed successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to place order' });
  }
});

app.get('/api/my-orders', authenticateToken, (req, res) => {
  const orders = db.prepare(`
    SELECT o.id, o.total_amount, o.created_at, p.id as product_id, p.name as product_name, p.file_path
    FROM orders o
    JOIN order_items oi ON o.id = oi.order_id
    JOIN products p ON oi.product_id = p.id
    WHERE o.user_id = ?
  `).all(req.user.id);

  const groupedOrders = orders.reduce((acc, curr) => {
    if (!acc[curr.id]) {
      acc[curr.id] = {
        id: curr.id,
        total_amount: curr.total_amount,
        created_at: curr.created_at,
        items: []
      };
    }
    acc[curr.id].items.push({ id: curr.product_id, name: curr.product_name, file_path: curr.file_path });
    return acc;
  }, {});

  res.json(Object.values(groupedOrders));
});

// --- DOWNLOAD ROUTE ---

app.get('/api/download/:productId', authenticateToken, (req, res) => {
  const { productId } = req.params;

  const purchase = db.prepare(`
    SELECT p.file_path, p.name
    FROM order_items oi
    JOIN orders o ON oi.order_id = o.id
    JOIN products p ON oi.product_id = p.id
    WHERE o.user_id = ? AND p.id = ?
  `).get(req.user.id, productId);

  if (!purchase) {
    return res.status(403).json({ message: 'Access denied. Product not purchased.' });
  }

  res.json({
    message: 'Download authorized',
    fileName: purchase.file_path,
    downloadUrl: `data:application/pdf;base64,JVBERi0xLjQKJ... (mock data for ${purchase.name})`
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
