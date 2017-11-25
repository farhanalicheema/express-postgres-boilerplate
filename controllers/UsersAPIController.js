const Users = require('../models/users')
const crypto = require('crypto')
const random = require('../utilities/random')
const utils = require('../utilities/utils')

module.exports = function (app) {
  app.post('/api/users', function (req, res, next) {
    utils.velidateRequiredKeys(req.body,
      [
        { key: 'userName', name: 'User name' },
        { key: 'password', name: 'Password' }
      ],
      function (errorField) {
        if (!errorField) {
          Users.findOne({
            where: {
              userName: req.body.userName.toLowerCase()
            }
          })
            .then(function (userFromRepo) {
              if (!userFromRepo) {
                try {
                  var salt = random.randomLongstr()
                  req.body.password = crypto.createHmac('sha256', salt)
                    .update(req.body.password)
                    .digest('hex')

                  Users.create({
                    userName: req.body.userName.toLowerCase(),
                    password: req.body.password,
                    passwordSalt: salt
                  })
                    .then(function () {
                      res.statusCode = 201
                      res.end()
                    })
                    .catch(function () {
                      res.statusCode = 500
                      res.setHeader('response-description', 'Oops, Something went wrong ER9211538')
                      res.end()
                    })
                } catch (err) {
                  res.statusCode = 500
                  res.setHeader('response-description', 'Oops, Something went wrong ER9211558')
                  res.end()
                }
              }else {
                res.statusCode = 403
                res.setHeader('response-description', 'User name already exists')
                res.end()
              }
            })
            .catch(function (err) {
              console.log(err)
              res.statusCode = 500
              res.setHeader('response-description', 'Oops, Something went wrong ER9211639')
              res.end()
            })
        }else {
          res.statusCode = 400
          res.setHeader('response-description', errorField + ' is required')
          res.end()
        }
      })
  })

  app.post('/api/login', function (req, res, next) {
    utils.velidateRequiredKeys(req.body,
      [
        { key: 'userName', name: 'User name' },
        { key: 'password', name: 'Password' }
      ],
      function (errorField) {
        if (!errorField) {
          try {
            Users.findOne({
              where: {
                userName: req.body.userName
              }
            })
              .then(function (userFromRepo) {
                if (userFromRepo) {
                  var salt = userFromRepo.passwordSalt
                  req.body.password = crypto.createHmac('sha256', salt)
                    .update(req.body.password)
                    .digest('hex')

                  if (req.body.password == userFromRepo.password) {
                    res.statusCode = 202
                    res.end()
                  }else {
                    res.statusCode = 401
                    res.setHeader('response-description', 'Invalid user name or password')
                    res.end()
                  }
                }else {
                  res.statusCode = 401
                  res.setHeader('response-description', 'Invalid user name or password')
                  res.end()
                }
              })
              .catch(function (err) {
                console.log(err)
                res.statusCode = 500
                res.setHeader('response-description', 'Oops, Something went wrong ER9211633')
                res.end()
              })
          } catch (err) {
            console.log(err)
            res.statusCode = 500
            res.setHeader('response-description', 'Oops, Something went wrong ER9211634')
            res.end()
          }
        }else {
          res.statusCode = 400
          res.setHeader('response-description', errorField + ' is required')
          res.end()
        }
      })
  })
}
