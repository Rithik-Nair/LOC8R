const mongoose = require('mongoose');

// Schema for User
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
});

// You can create a model for the user schema
mongoose.model('User', userSchema);
