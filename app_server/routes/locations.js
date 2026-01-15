// app_server/routes/locations.js
const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

const { requireLogin } = require('../middleware/auth');

// Import locations controller
const ctrlLocations = require('../controllers/locations');
const Location = mongoose.model('Location'); // Ensure model is loaded

/* ===========================
   PROTECTED: GET /locations
=========================== */
router.get('/', requireLogin, ctrlLocations.homelist);

/* ===========================
   PROTECTED: GET /locations/:locationId
=========================== */
router.get('/:locationId', requireLogin, async (req, res, next) => {
  try {
    const location = await Location.findById(req.params.locationId);
    if (!location) {
      return res.status(404).render('404', { message: 'Location not found' });
    }
    res.render('locationDetail', { location, user: req.session.user });
  } catch (err) {
    next(err);
  }
});

/* ===========================
   PROTECTED: POST /locations/submit_review
=========================== */
router.post('/submit_review', requireLogin, async (req, res, next) => {
  try {
    const { locationId, reviewText, rating } = req.body;
    const location = await Location.findById(locationId);

    if (!location) {
      return res.status(404).render('404', { message: 'Location not found' });
    }

    location.reviews.push({
      author: req.session.user.username, // use logged-in user's username
      reviewText,
      rating
    });

    await location.save();
    res.redirect(`/locations/${locationId}`);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
