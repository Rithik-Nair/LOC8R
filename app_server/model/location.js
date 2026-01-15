const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  author: String,
  rating: Number,
  reviewText: String,
  createdOn: {
    type: Date,
    default: Date.now
  }
});

const locationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  address: String,
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  facilities: [String],
  coords: {
    type: [Number],
    index: '2dsphere'
  },
  reviews: [reviewSchema]
});

// ✅ THIS LINE REGISTERS THE MODEL
mongoose.model('Location', locationSchema);
