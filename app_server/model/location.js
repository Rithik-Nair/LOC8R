const mongoose = require('mongoose');

// Schema for Location
const locationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  address: String,
  rating: {
    type: Number,
    'default': 0,
    min: 0,
    max: 5
  },
  facilities: [String],
  coords: {
    type: [Number],
    index: '2dsphere'  // Geospatial indexing for location
  },
  openingTimes: [{
    days: String,
    opening: String,
    closing: String,
    closed: Boolean
  }],  // Subdocument array for opening times
  reviews: [{
    author: String,
    rating: {
      type: Number,
      required: true,
      min: 0,
      max: 5
    },
    reviewText: String,
    createdOn: {
      type: Date,
      'default': Date.now
    }
  }]  // Subdocument array for reviews
});

// Register the model
mongoose.model('Location', locationSchema);  // Make sure this matches the model name used in routes
