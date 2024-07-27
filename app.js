/*===============================================
//* Modules
===============================================*/
require("dotenv").config();
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const logger = require('morgan');
const mongoose = require("mongoose");

const cookieParser = require('cookie-parser');
const session = require("express-session");
const MongoStore = require("connect-mongo");

const methodOverride = require("method-override");
const expressLayout = require("express-ejs-layouts");

// For production
const compression = require("compression");
const helmet = require("helmet");

/*===============================================
//* Setting up express application
===============================================*/
var app = express();

/*===============================================
//* Connecting to the database
===============================================*/
mongoose.set("strictQuery", false);
const mongoDB = process.env.MONGO_URI;

main().catch((err) => console.log(err));
async function main() {
  const connection = await mongoose.connect(mongoDB);

  if(process.env.NODE_ENV === "development") {
    console.log(`Database connected: ${connection.connection.host}`);
  }
}

/*===============================================
//* View engine setup
===============================================*/
app.set('view engine', 'ejs');

// Default layout (note the file path, it starts
// within the views folder, not the root folder)
app.set("layout", "./layouts/main.ejs");
app.use(expressLayout);

/*===============================================
//* Middleware for updating and deleting things
//* from the database tables
===============================================*/
app.use(methodOverride("_method"));

/*===============================================
//* Middleware for handling data passed from user
===============================================*/
// For passing data via e.g. forms
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

/*===============================================
//* Middleware for logging http requests
//* during development
===============================================*/
app.use(logger('dev'));

/*===============================================
//* Middleware for cookie handling
===============================================*/
app.use(cookieParser());
app.use(
    session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI
    }),
    cookie: {
      maxAge: new Date( Date.now() + (3600000)),
      secure: false // set to true in production
    }
  })
);

/*===============================================
//* Middleware performance
===============================================*/
app.use(compression()); // Compress all routes

/*===============================================
//* Middleware for security
===============================================*/
app.use(helmet());
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      "script-src": [
        "'self'", 
        // inline scripts used for preventing stylesheet 
        // loading issues in Firefox
        "'sha256-X+zrZv/IbzjZUnhsbWlsecLbwjndTpG0ZynXOif7V+k='",
        "'sha256-TdSXywXlyTYsLg1Hgoc7K0pyCMX7D/TzgIc107Ln6V0='"
      ],
    },
  }),
);

// Set up rate limiter: maximum of twenty requests per minute
const RateLimit = require("express-rate-limit");
const limiter = RateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 20,
});
// Apply rate limiter to all requests
//app.use(limiter);

/*===============================================
//* Giving the app access to the public folder
===============================================*/
app.use(express.static(path.join(__dirname, 'public')));

/*===============================================
//* Giving the app access to the routes in
//* in routes/main.js
===============================================*/
app.use("/", require("./routes/main"));
app.use('/',require('./routes/admin'));

/*===============================================
//* Error handling
===============================================*/
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

/*===============================================
//* Export the app
===============================================*/
module.exports = app;
