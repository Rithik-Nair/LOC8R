const axios = require('axios');
const mongoose = require('mongoose');
// Ensure the Location model is registered before retrieving it
require('../model/location');
const Location = mongoose.model('Location');

/* ===========================
   Distance Helper Functions
=========================== */
function deg2rad(deg) {
  return deg * (Math.PI / 180);
}

function getDistanceFromLatLonInMeters(lat1, lon1, lat2, lon2) {
  const R = 6371000; // Radius of the Earth in meters
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) *
      Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
}

/* ===========================
   GET /locations
=========================== */
module.exports.homelist = async function (req, res) {
  const { lat, lng } = req.query;

  // Pass user info to template
  const user = req.session.user || null;

  // If user has not shared location yet
  if (!lat || !lng) {
    return res.render('locations', {
      title: 'Nearby Restaurants',
      message: 'Enable live location to find restaurants near you.',
      locations: [],
      user
    });
  }

  // Overpass API query for restaurants
  const overpassQuery = `
    [out:json][timeout:25];
    node["amenity"="restaurant"](around:5000,${lat},${lng});
    out body;
  `;

  try {
    const response = await axios.post(
      'https://overpass-api.de/api/interpreter',
      overpassQuery,
      { headers: { 'Content-Type': 'text/plain' } }
    );

    const elements = response.data.elements || [];

    // Map and filter restaurants
    const locations = elements
      .map((el) => {
        const restaurantName = el.tags?.name;
        const restaurantLat = el.lat;
        const restaurantLng = el.lon;

        if (!restaurantName || !restaurantLat || !restaurantLng) return null;

        const distance = getDistanceFromLatLonInMeters(
          lat,
          lng,
          restaurantLat,
          restaurantLng
        );

        // Only include restaurants in 1–2 km range
        if (distance < 1000 || distance > 2000) return null;

        return {
          name: restaurantName,
          distance,
          googleLink: `https://www.google.com/maps/search/?api=1&query=${restaurantLat},${restaurantLng}`,
          cuisine: el.tags?.cuisine || null,
        };
      })
      .filter((loc) => loc && loc.googleLink); // remove null/invalid entries

    res.render('locations', {
      title: 'Nearby Restaurants',
      message:
        locations.length === 0
          ? 'No restaurants found within 1–2 km from your location.'
          : null,
      locations,
      user
    });
  } catch (err) {
    console.error('Overpass API Error:', err.message);

    res.render('locations', {
      title: 'Nearby Restaurants',
      message: 'Error fetching nearby restaurants.',
      locations: [],
      user
    });
  }
};

/* ===========================
   GET /locations/:locationId
   Show a single location
=========================== */
module.exports.locationDetail = async function (req, res, next) {
  const user = req.session.user || null;

  try {
    const location = await Location.findById(req.params.locationId);
    if (!location) {
      return res.status(404).render('404', { message: 'Location not found', user });
    }

    res.render('locationDetail', { location, user });
  } catch (err) {
    next(err);
  }
};

/* ===========================
   POST /locations/submit_review
=========================== */
module.exports.addReview = async function (req, res, next) {
  const user = req.session.user;

  if (!user) {
    return res.status(401).send('You must be logged in to submit a review.');
  }

  try {
    const { locationId, reviewText, rating } = req.body;
    const location = await Location.findById(locationId);

    if (!location) {
      return res.status(404).render('404', { message: 'Location not found', user });
    }

    location.reviews.push({
      author: user.username,
      reviewText,
      rating
    });

    await location.save();
    res.redirect(`/locations/${locationId}`);
  } catch (err) {
    next(err);
  }
};
