const mongoose = require('mongoose');

// Connect to MongoDB without deprecated options
mongoose.connect('mongodb://127.0.0.1:27017/loc8r')
  .then(() => {
    console.log('Mongoose connected to localhost/loc8r');
  })
  .catch(err => {
    console.error('Mongoose connection error: ' + err);
  });

// Set up connection event listeners
mongoose.connection.on('disconnected', () => {
  console.log('Mongoose disconnected');
});

// Handle app termination (SIGINT)
process.on('SIGINT', () => {
  mongoose.connection.close(() => {
    console.log('Mongoose disconnected through app termination');
    process.exit(0);
  });
});
