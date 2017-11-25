var express = require('express');
var path = require('path');
var rMyRoute = express.Router();
var fs = require('fs');
var db = require('./config/db');
var config = require('./config/config.js');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var multer = require('multer');
const SessionStore = require('express-session-sequelize')(session.Store);
var app = express(),
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