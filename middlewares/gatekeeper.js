/**
 * This file contains all the gatekeepers, gatekeepers as name represents validates the request before doing any other action
 * 
 */

 // This gatekeeper authenticates wether user has successfully logged in and the session is set
module.exports.authenticateSession = function (req, res, next) {
  // if user successfully logged in and session was set then let request to pass the gatekeeper
  if (req.session.boilerplate_userName && req.session.boilerplate_password) {
    next();
  }
  else {
  // if user did not successfully logged in and session was not set then redirect user to logout
    res.redirect('/logout');
  }
};


 // This gatekeeper authenticates wether user is already logged in and the session is set
module.exports.unAuthenticateSession = function (req, res, next) {
 // if user is already logged in and the session is set then redirect him to home page
  if (req.session.boilerplate_userName && req.session.boilerplate_password) {
    res.redirect('/');
  }
  else {
 // if user is not already logged in and the session is not set then let him pass the gatekeeper   
    next();
  }
};