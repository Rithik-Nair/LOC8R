const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
var app = express();
require("./app_server/model/db"); // Ensures the database connection
require('./app_server/model/location'); // Ensure the model is loaded before routes
const createError = require('http-errors');
const locationsRouter = require('./app_server/routes/locations');  // Import location routes
require('dotenv').config();
const authRoutes = require('./app_server/routes/auth');

const session = require('express-session');
const flash = require('connect-flash');

app.use(session({
  secret: 'loc8r_secret_key',
  resave: false,
  saveUninitialized: false
}));

app.use(flash());

// Make user & flash available in all views
app.use((req, res, next) => {
  // expose user as both `currentUser` and `user` for templates
  res.locals.currentUser = req.session.user;
  res.locals.user = req.session.user;
  res.locals.error = req.flash('error');
  res.locals.success = req.flash('success');
  next();
});

// View engine setup
app.set('views', path.join(__dirname,'app_server', 'views'));
app.set('view engine', 'jade');

// Ensure `user` is always declared in templates to avoid ReferenceError
app.locals.user = null;

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Mount auth routes after session/flash so `res.locals` is populated
app.use('/', authRoutes);

app.use('/', require('./app_server/routes/index'));
app.use('/', require('./app_server/routes/users'));
app.use('/locations', locationsRouter); // Locations route

// Error handling
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.send(err.message || 'Something went wrong!');
});

module.exports = app;
