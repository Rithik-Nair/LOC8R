const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth');

/* LOGIN PAGE */
router.get('/login', (req, res) => {
  if (req.session.user) {
    return res.redirect('/locations');
  }
  res.render('login', { title: 'Login' });
});

/* LOGIN POST */
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const mongoose = require('mongoose');
    const User = mongoose.model('User');

    // Find user in database
    const user = await User.findOne({ username });

    if (!user) {
      req.flash('error', 'Invalid credentials');
      return res.redirect('/login');
    }

    // Check password (plain-text for now)
    if (user.password !== password) {
      req.flash('error', 'Invalid credentials');
      return res.redirect('/login');
    }

    // ✅ LOGIN SUCCESS → Set session and redirect to locations
    req.session.user = {
      username: user.username,
      email: user.email,
      id: user._id
    };
    return res.redirect('/locations');
  } catch (err) {
    console.error('Login error:', err);
    req.flash('error', 'Login failed');
    res.redirect('/login');
  }
});

/* LOGOUT */
router.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/');
});

/* HOME */
router.get('/', (req, res) => {
  res.render('home', { title: 'Home' });
});

/* ABOUT */
router.get('/about', (req, res) => {
  res.render('about', { title: 'About' });
});

module.exports = router;
