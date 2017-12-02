/**
 * This is a sample controller which only contains client side controllers. 
 * This sample code includes
 * 1. API calls
 * 2. Rendering Views
 * 3. Using Swig to pass data to view
 * 
 */

// A default user is created if doest already exist
require('../utilities/initApp')
// Including Gatekeepers i.e the validations required to authenticate user
const gatekeeper = require('../middlewares/gatekeeper')
// Including API Helpers i.e For dividing code into simple functions, I have created API helpers which are used to call API
const apiHelpers = require('../utilities/apiHelpers')

module.exports = function (app) {

  // A GET controller which Renders home page,
  // Gatekeeper used authenticates wether user successfully logged in or not
  app.get('/', gatekeeper.authenticateSession, function (req, res) {
    res.render('welcome')
  })

  // A GET controller which Renders Login page
  // Gatekeeper used authenticates wether user is already logged in or not  
  app.get('/login', gatekeeper.unAuthenticateSession, function (req, res, next) {
    res.render('users/login', {
      error: req.flash('error'),
      session: req.session
    })
  })


  // A GET controller which logs out user
  // In this controller the session is destroyed and user is redirected to login page
  app.get('/logout', function (req, res) {
    req.session.destroy(function () {
      res.redirect('/login')
    })
  })

  // A POST controller which Make call to API to check wether user is valid or not
  // If valid set the session and redirects to home page
  // If invalid redirects to login page with error message set in flash
  app.post('/login', gatekeeper.unAuthenticateSession, function (req, res) {

    // Calling Api Helper to make a POST call at uri "/api/login"
    apiHelpers.genericAPIHelperWithAuth(req, '/api/login', 'POST', '', function (apiRepo) {
      // If response status is 202 OK then set session and 
      if (apiRepo.statusCode == 202) {
        req.session.boilerplate_userName = req.body.userName
        req.session.boilerplate_password = req.body.password
        req.session.save(function () {
          res.redirect('/')
        })
      }
      else {
        req.flash('error', apiRepo.description)
        req.session.save(function () {
          res.redirect('/login')
        });
      }
    })
  })
}
