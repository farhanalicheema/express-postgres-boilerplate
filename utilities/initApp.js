var Users = require('../models/users')
var random = require('./random')
var crypto = require('crypto')

Users.findOne({
  where: {
    userName: 'admin'
  }
})
  .then(function (userFromRepo) {
    if (!userFromRepo) {
      try {
        var salt = random.randomLongstr()
        var password = crypto.createHmac('sha256', salt)
          .update('asdf@123')
          .digest('hex')

        Users.create({
          userName: 'admin',
          password: password,
          passwordSalt: salt
        })
          .then(function () {
            console.log('admin user created')
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
