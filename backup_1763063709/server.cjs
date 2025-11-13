require('dotenv').config();
const express = require('express');
const session = require('express-session');
const cors = require('cors');
const app = express();
const { initDb } = require('./db.cjs');

const authRoutes = require('./routes/auth.routes.cjs');
const instanceRoutes = require('./routes/instance.routes.cjs');
const dataRoutes = require('./routes/data.routes.cjs');

// Middleware
app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(session({
  secret: process.env.SESSION_SECRET || 'default_secret_for_development',
  resave: false,
  saveUninitialized: false,
  rolling: true,
  cookie: { secure: false, httpOnly: true, sameSite: 'lax' },
  name: 'sessionId'
}));

// API Routes
app.use('/api', authRoutes);
app.use('/api', instanceRoutes);
app.use('/api/:username', dataRoutes);


// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ message: 'Internal server error' });
});

// Start Server
const PORT = 3000;
const startServer = async () => {
    await initDb();
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`Super Admin: ${process.env.SUPER_ADMIN_USERNAME}`);
    });
};

startServer();
