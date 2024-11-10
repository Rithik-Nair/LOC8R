const express = require('express');
const mongoose = require('mongoose');
const Location = mongoose.model('Location');
const router = express.Router();

// Route for listing all locations
router.get('/', async (req, res, next) => {
  try {
    const locations = await Location.find();
    res.render('locations', { locations });
  } catch (err) {
    next(err);
  }
});

// Route for viewing a specific location
router.get('/:locationId', async (req, res, next) => {
  try {
    const location = await Location.findById(req.params.locationId);
    if (!location) {
      return res.status(404).render('404', { message: 'Location not found' });
    }
    res.render('locationDetail', { location });
  } catch (err) {
    next(err);
  }
});

// Define the submit review route
router.post('/submit_review', async (req, res, next) => {
  try {
    const { locationId, reviewText, rating } = req.body;
    const location = await Location.findById(locationId);
    if (!location) {
      return res.status(404).render('404', { message: 'Location not found' });
    }

    location.reviews.push({
      author: req.user ? req.user.username : 'Anonymous',  // assuming user info is available
      reviewText: reviewText,
      rating: rating
    });

    await location.save();
    res.redirect(`/locations/${locationId}`);  // Redirect back to the location detail page
  } catch (err) {
    next(err);
  }
});

module.exports = router;
