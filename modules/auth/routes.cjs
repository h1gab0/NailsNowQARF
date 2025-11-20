const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const { db, getInstanceData } = require('../../db.cjs');

// --- Auth ---
const SUPER_ADMIN_USERNAME = process.env.SUPER_ADMIN_USERNAME;
const SUPER_ADMIN_PASSWORD = process.env.SUPER_ADMIN_PASSWORD;
const LONG_SESSION = 24 * 60 * 60 * 1000;
const SHORT_SESSION = 5 * 60 * 1000;

// User Sign-Up
router.post('/signup', async (req, res) => {
  const { name, email, password } = req.body;

  await db.read();
  const users = db.data.users;
  const existingUser = users.find(user => user.email === email);

  if (existingUser) {
    return res.status(400).json({ message: 'User already exists' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = { id: Date.now().toString(), name, email, password: hashedPassword };

  db.data.users.push(newUser);

  const newInstanceId = name.toLowerCase().replace(/\s+/g, '-');
  db.data.instances[newInstanceId] = {
      name: `${name}'s Scheduler`,
      phoneNumber: '',
      admins: [{ username: name, password: hashedPassword }],
      coupons: [],
      appointments: [],
      availability: {}
  };

  await db.write();

  req.session.isAuthenticated = true;
  req.session.user = { id: newUser.id, name: newUser.name, email: newUser.email };
  req.session.cookie.maxAge = LONG_SESSION;

  res.status(201).json(req.session.user);
});

// User Sign-In
router.post('/signin', async (req, res) => {
  const { email, password } = req.body;
  await db.read();
  const user = db.data.users.find(u => u.email === email); // Fixed: db.get('users')... isn't valid with lowdb v6+ style usually used in this project based on other files, sticking to db.data

  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  req.session.isAuthenticated = true;
  req.session.user = { id: user.id, name: user.name, email: user.email };
  req.session.cookie.maxAge = LONG_SESSION;

  res.json(req.session.user);
});

// Super Admin Login
router.post('/admin/login', (req, res) => {
  const { username, password } = req.body;
  if (username === SUPER_ADMIN_USERNAME && password === SUPER_ADMIN_PASSWORD) {
    req.session.isAuthenticated = true;
    req.session.user = { username, isSuperAdmin: true };
    req.session.cookie.maxAge = LONG_SESSION;
    res.json({ username, isSuperAdmin: true });
  } else {
    res.status(401).json({ message: 'Invalid super admin credentials' });
  }
});

// Instance Admin Login
router.post('/:instanceId/login', async (req, res) => {
  const instanceData = await getInstanceData(req.params.instanceId);
  const { username, password } = req.body;
  const adminUser = instanceData.admins.find(admin => admin.username === username);

  if (adminUser) {
    const isPasswordValid = await bcrypt.compare(password, adminUser.password);
    if (isPasswordValid) {
      req.session.isAuthenticated = true;
      req.session.user = {
        username,
        isSuperAdmin: false,
        instanceId: req.params.instanceId
      };
      req.session.cookie.maxAge = LONG_SESSION;
      res.json({
        username,
        isSuperAdmin: false,
        instanceId: req.params.instanceId
      });
    } else {
      res.status(401).json({ message: 'Invalid credentials for this instance.' });
    }
  } else {
    res.status(401).json({ message: 'Invalid credentials for this instance.' });
  }
});

router.get('/admin/verify', (req, res) => {
  if (req.session.isAuthenticated) {
    res.json(req.session.user);
  } else {
    res.status(401).json({ message: 'Not authenticated' });
  }
});

router.post('/admin/heartbeat', (req, res) => {
  if (req.session.isAuthenticated) {
    req.session.cookie.maxAge = LONG_SESSION;
    res.json({ status: 'session extended' });
  } else {
    res.status(401).json({ message: 'Not authenticated' });
  }
});

router.post('/admin/session/expire-soon', (req, res) => {
  if (req.session.isAuthenticated) {
    req.session.cookie.maxAge = SHORT_SESSION;
    res.json({ status: 'session will expire soon' });
  } else {
    res.status(401).json({ message: 'Not authenticated' });
  }
});

router.post('/admin/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      res.status(500).json({ message: 'Error during logout' });
    } else {
      res.json({ message: 'Logged out successfully' });
    }
  });
});

module.exports = router;
