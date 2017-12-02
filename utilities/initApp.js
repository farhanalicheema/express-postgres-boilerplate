/**
 * To move things faster i have created a default user which gets created when application is started
 */

// Including User model
var Users = require('../models/users')
// Including random.js which contains helping functions for generating random strings
var random = require('./random')
// Including nodes crypto module  ( https://nodejs.org/api/crypto.html )
var crypto = require('crypto')

// Checking if user already created or not
Users.findOne({
  where: {
    userName: 'admin'
  }
})
  .then(function (userFromRepo) {
    if (!userFromRepo) {
      // if user is not already created then created one with password "asdf@123" and username "admin"
      try {
        var salt = random.randomLongstr()
        // using sha256 to get the HMAC of password with a random long string
        var password = crypto.createHmac('sha256', salt)
          .update('asdf@123')
          .digest('hex')

        Users.create({
          userName: 'admin',
          password: password,
          passwordSalt: salt
        })
          .then(function () {
            console.log('Default User created with username = "admin" and password = "asdf@123"')
          })
          .catch(function (err) {
            console.log(err)
          })
      } catch (err) {
        console.log(err)
      }
    }
  })
  .catch(function (err) {
    console.log(err)
  })
