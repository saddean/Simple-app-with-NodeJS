var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var expressValidator = require('express-validator');
var mongoose = require('mongoose');
var passport = require('passport');
var session = require('express-session');

var LocalStrategy = require('passport-local').Strategy;
var flash = require('connect-flash');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();
mongoose.connect('mongodb://localhost/quanli');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//midleware
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(require('connect-flash')());
app.use(expressValidator());
// Express session
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: false  
}))

//passportjs
app.use(passport.initialize());
app.use(passport.session());

// route
app.use('/', indexRouter);
app.use('/users', usersRouter);

// passport
app.use(passport.initialize());
app.use(passport.session());

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


module.exports = app;
