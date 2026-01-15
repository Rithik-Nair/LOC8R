var express = require('express');
var router = express.Router();

const ctrlHome = require('../controllers/home');
const ctrlLocations = require('../controllers/locations');
const ctrlOthers = require('../controllers/others');
const ctrlMain = require('../controllers/main');
const ctrlAuth = require('../controllers/auth');

// HOME (Landing Page)
// HOME (Landing Page)
router.get('/', ctrlHome.index);

// AUTH
router.get('/login', ctrlAuth.login);
router.post('/login', ctrlAuth.loginSubmit);
router.get('/register', ctrlAuth.register);
router.post('/register', ctrlAuth.registerSubmit);

// LOCATIONS
router.get('/locations', ctrlLocations.homelist);
// router.get('/location1', ctrlLocations.locationInfo1);
// router.get('/location2', ctrlLocations.locationInfo2);

// ADD REVIEW
router.get('/location/review/new', ctrlLocations.addReview);

// OTHER PAGES
router.get('/about', ctrlOthers.about);
router.get('/signin', ctrlMain.signin);
router.get('/review', ctrlMain.review);

module.exports = router;
