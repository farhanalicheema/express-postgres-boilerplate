// Fast, unopinionated, minimalist web framework for node. ( https://www.npmjs.com/package/express )
var express = require('express');
// The path module provides utilities for working with file and directory paths. ( https://nodejs.org/api/path.html )
var path = require('path');
var rMyRoute = express.Router();
// File I/O is provided by simple wrappers around standard POSIX functions ( https://nodejs.org/api/fs.html )
var fs = require('fs');
 // Including db.js which contains the database configuration
var db = require('./config/db');
 // Getting the environmental variables
var config = require('./config/config.js');
// Parse incoming request bodies in a middleware before your handlers, available under the req.body property ( https://www.npmjs.com/package/body-parser )
var bodyParser = require('body-parser');
// Parse Cookie header and populate req.cookies with an object keyed by the cookie names ( https://www.npmjs.com/package/cookie-parser )
var cookieParser = require('cookie-parser');
// Create a session middleware with the given options ( https://www.npmjs.com/package/express-session )
var session = require('express-session');
// Multer is a node.js middleware for handling multipart/form-data, which is primarily used for uploading files ( https://www.npmjs.com/package/multer )
var multer = require('multer'); 
// module used for saving session data in database ( https://www.npmjs.com/package/express-sequelize-session )
const SessionStore = require('express-session-sequelize')(session.Store);

var app = express(),
// Including swig templating engine ( https://www.npmjs.com/package/swig)
  swig = require('swig'),
  people;

// This is where all the magic happens!
app.engine('html', swig.renderFile);

app.set('view engine', 'html');
app.set('views', __dirname + '/views');
app.use(express.static(path.join(__dirname, 'public')));

// Swig will cache templates for you, but you can disable
// that and use Express's caching instead, if you like:
app.set('view cache', false);
// To disable Swig's cache, do the following:
swig.setDefaults({ cache: false });
// NOTE: You should always cache templates in a production environment.
// Don't leave both of these to `false` in production!

const sequelizeSessionStore = new SessionStore({
  db: db,
});

app.use(cookieParser());
app.use(session({
  secret: 'keep it secret, keep it safe.',
  store: sequelizeSessionStore,
  resave: false,
  saveUninitialized: false,
}));



app.use(multer());


app.use(require('connect-flash')());

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json())


// Load all routes
fs.readdirSync(__dirname + '/controllers').forEach(function (file) {
  if (file.substr(-3) == '.js') {
    var pathToController = __dirname + '/controllers/' + file;
    router = require(pathToController)(app);
    console.log(pathToController)
    app.use(pathToController, rMyRoute);
  }
  db.sync();
});



// catch 404 and forward to error handler
// note this is after all good routes and is not an error handler
// to get a 404, it has to fall through to this route - no error involved

// app.use(function (req, res, next) {
//   var err = new Error('Not Found');
//   err.status = 404;
//   next(err);
// });

// app.use(function (err, req, res, next) {
//   err.status = err.status ? err.status : 500;
//   res.status(err.status);
//   res.render(err.status, {
//     message: err.message,
//     error: {}
//   });
// });

app.listen(config.port);
console.log('Application Started on http://localhost:'+config.port);