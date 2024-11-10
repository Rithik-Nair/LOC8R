var express = require('express');
var router = express.Router();
var ctrlLocations = require('../controllers/locations');
var ctrlothers = require('../controllers/others');
var ctrlmain = require('../controllers/main');

// Route for home page
router.get('/', ctrlLocations.homelist);

// Routes for location info pages
router.get('/locations', ctrlLocations.locationInfo);
router.get('/location1', ctrlLocations.locationInfo1);
router.get('/location2', ctrlLocations.locationInfo2);

// Route for adding a review
router.get('/location/review/new', ctrlLocations.addReview);

// Route for about page
router.get('/about', ctrlothers.about);

// Routes for sign-in and review pages
router.get('/signin', ctrlmain.signin);
router.get('/review', ctrlmain.review);

// Route for register page
router.get('/register', function(req, res, next) {
  res.render('register', { title: 'Register' });
});

module.exports = router;
