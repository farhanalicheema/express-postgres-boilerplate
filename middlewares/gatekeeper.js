var Users = require('../models/users');
var crypto = require('crypto');

module.exports.authenticateUser = function (req, res, next) {
  if (req.headers['authorization']) {
    var splitedAuth = req.headers['authorization'].split(':');
    var userName = splitedAuth[0];
    var password = splitedAuth[1];

    try {

      Users.findOne({
        where: {
          userName: userName
        }
      })
        .then(function (userFromRepo) {
          if (userFromRepo) {
            var salt = userFromRepo.passwordSalt;
            password = crypto.createHmac('sha256', salt)
              .update(password)
              .digest('hex');

            if (password == userFromRepo.password) {
              Companies.findOne({
                where: {
                  companyId: userFromRepo.companyId,
                  active: 'YES'
                }
              })
                .then(function (companyFromRepo) {
                  if (companyFromRepo) {
                    req.userName = userName;
                    req.companyId = userFromRepo.companyId;
                    req.companyName = companyFromRepo.companyName;
                    req.documentsRequired = companyFromRepo.documentsRequired;
                    next();
                  }
                  else {
                    res.statusCode = 401;
                    res.setHeader('response-description', 'Invalid user name or password');
                    res.end();
                  }
                })
                .catch(function (err) {
                  console.log(err)
                  res.statusCode = 500;
                  res.setHeader('response-description', 'Oops, Something went wrong ER9211633');
                  res.end();
                });
            }
            else {
              res.statusCode = 401;
              res.setHeader('response-description', 'Invalid user name or password');
              res.end();
            }
          }
          else {
            res.statusCode = 401;
            res.setHeader('response-description', 'Invalid user name or password');
            res.end();
          }
        })
        .catch(function (err) {
          console.log(err)
          res.statusCode = 500;
          res.setHeader('response-description', 'Oops, Something went wrong ER9211633');
          res.end();
        });

    } catch (err) {
      res.statusCode = 500;
      res.setHeader('response-description', 'Oops, Something went wrong ER9211634');
      res.end();
    }

  }
  else {
    res.statusCode = 401;
    res.setHeader('response-description', 'Invalid user name or password');
    res.end();
  }
};

module.exports.authenticateSession = function (req, res, next) {
  if (req.session.transbott_userName && req.session.transbott_password) {
    next();
  }
  else {
    res.redirect('/logout');
  }
};


module.exports.unauthenticateSession = function (req, res, next) {
  if (req.session.transbott_userName && req.session.transbott_password) {
    res.redirect('/');
  }
  else {
    next();
  }
};