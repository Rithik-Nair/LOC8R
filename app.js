const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
require("./app_server/model/db"); // Ensures the database connection
require('./app_server/model/location'); // Ensure the model is loaded before routes
const createError = require('http-errors');
const locationsRouter = require('./app_server/routes/locations');  // Import location routes

var app = express();

// View engine setup
app.set('views', path.join(__dirname,'app_server', 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', require('./app_server/routes/index'));
app.use('/', require('./app_server/routes/users'));
app.use('/locations', locationsRouter); // Locations route

// Error handling
app.use(function(req, res, next) {
  next(createError(404));
});

app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
