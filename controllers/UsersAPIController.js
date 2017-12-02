/**
 * This is a sample API controller which only contains API.  
 * 
 */

// Including Users Model
const Users = require('../models/users')
// Including nodes crypto module  ( https://nodejs.org/api/crypto.html )
const crypto = require('crypto')
// Including utils which contains few helping function
const utils = require('../utilities/utils')

module.exports = function (app) {

  /**
   * Post API which takes userName and password as request and returns 202 OK if valid
   */
  app.post('/api/login', function (req, res, next) {

    // Validating request body using validate helping function, For details got to /utilities/utils.js
    utils.validateRequiredKeys(req.body,
      [
        { key: 'userName', name: 'User name' },
        { key: 'password', name: 'Password' }
      ],
      function (errorField) {
        // If request body is valid
        if (!errorField) {
          // Use of try catch to catch any exception when generating HMAC of password
          try {
            // Making a find query from Users model by username
            Users.findOne({
              where: {
                userName: req.body.userName
              }
            })
              // If successfully got response from database
              .then(function (userFromRepo) {
                // If user with username from request is found
                if (userFromRepo) {
                  // Getting the salt of user and generating generate HMAC
                  var salt = userFromRepo.passwordSalt
                  req.body.password = crypto.createHmac('sha256', salt)
                    .update(req.body.password)
                    .digest('hex')

                  // Checking if HMAC of password of user is same as HMAC of password got in request

                  // if equal then response with 202 as status code
                  if (req.body.password == userFromRepo.password) {
                    res.statusCode = 202
                    res.end()
                  }
                  // if not equal then response with 401 as status code and sending response description in a custom header named "response-description"                
                  else {
                    res.statusCode = 401
                    res.setHeader('response-description', 'Invalid user name or password')
                    res.end()
                  }
                }else {
                  // if user not found then response with 401 as status code and sending response description in a custom header named "response-description"                
                  res.statusCode = 401
                  res.setHeader('response-description', 'Invalid user name or password')
                  res.end()
                }
              })
              // Handling exception caught while getting User from Database
              .catch(function (err) {
                console.log(err)
                res.statusCode = 500
                res.setHeader('response-description', 'Oops, Something went wrong ER9211633')
                res.end()
              })
          } 
            catch (err) {
            console.log(err)
            res.statusCode = 500
            res.setHeader('response-description', 'Oops, Something went wrong ER9211634')
            res.end()
          }
        }else {
              // If required request body is not found responding with status code as 400 and setting response description
          res.statusCode = 400
          res.setHeader('response-description', errorField + ' is required')
          res.end()
        }
      })
  })
}
