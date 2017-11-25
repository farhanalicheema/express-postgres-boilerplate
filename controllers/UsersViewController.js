const crypto = require('crypto');
const random = require('../utilities/random');
const utils = require('../utilities/utils');
const http = require('http');
require('../utilities/initApp');
const gatekeeper = require('../middlewares/gatekeeper');
const apiHelpers = require('../utilities/apiHelpers');

module.exports = function (app) {

  app.get('/', gatekeeper.authenticateSession, function (req, res) {
    res.render('welcome');
  });

  app.get('/login', gatekeeper.unauthenticateSession, function (req, res, next) {
    res.render('users/login', {
      error: req.flash('error'),
      session: req.session
    });
  });


  app.get('/logout', function (req, res) {
    req.session.destroy(function () {
      res.redirect('/login')
    });
  });


  app.post('/login', gatekeeper.unauthenticateSession, function (req, res) {

    var body = JSON.stringify(req.body);
    apiHelpers.genericAPIHelperWithAuth(req, '/api/login', 'POST', '', function (apiRepo) {
      if (apiRepo.statusCode == 202) {
        req.session.transbott_userName = req.body.userName;
        req.session.transbott_password = req.body.password;
        req.session.save(function () {
          res.redirect('/')
        });
      }
      else {
        req.flash('error', apiRepo.description);
        req.session.save(function () {
          res.redirect('/login')
        });
      }
    });

  });

}
