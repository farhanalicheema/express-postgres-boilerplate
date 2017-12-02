/**
 * This file contains few useful helping functions
 * 
 */

// easy used 'mkdir', when dirpath or parent dirpath not exist, it will create the directory automatically. ( https://www.npmjs.com/package/mkdir-p )
var mkdir = require('mkdir-p')
// File I/O is provided by simple wrappers around standard POSIX functions ( https://nodejs.org/api/fs.html )
var fs = require('fs')
// Including random.js which contains helping functions for generating random strings
const random = require('../utilities/random')

// This helping function is for saving a file at given path,
// It takes two variables as input
// 1. Path to with file is to be saved
// 2. File
// It returns callback function containing two variable is response
// 1. Error message if any error occurred
// 2. The unique name of the file
module.exports.saveFileAt = function saveFileAt (path, file, callback) {
  // Checking if file is provided
  if (file) {
    // Making complete path
    var dir = __dirname + path

    // Giving file a unique name
    var fileName = random.randomstr()
    // Creating parent directories if doest not exist
    mkdir(dir, function (err) {
      // Error handling
      if (err) {
        callback(err, fileName)
      }else {
        // Reading and then writing file to provided path        
        fs.readFile(file.path, function (err, data) { // read file from the given path
          fs.writeFile(dir + '/' + fileName + '.' + file.extension, data, function (err) { // write file in uploads folder
            callback(err, fileName)
          })
        })
      }
    })
  }else {
    callback('nofile', '')
  }
}

// This helping function is for validating a request body with required fields,
// It takes two variables as input
// 1. Request body
// 2. The required fields
// It returns callback function containing one variable is response
// 1. Error message if any required key is missing or empty
module.exports.validateRequiredKeys = function (body, fields, callback) {
  var key = ''
  var name = ''
  var errorField = ''
  var value = ''

  // Traversing through the required fields
  for (var i = 0; i < fields.length; i++) {
    key = fields[i].key
    name = fields[i].name
    errorField = ''
    value = body[key]

    // if request body does not contain respective field then throw error 
    if (!value || value.replace(/\s+/g, '') == '') {
      errorField = name
      break
    }
  }
  callback(errorField)
}

// This helping function returns date , takes DD/MM/YYYY as input parameter
module.exports.convertDDMMYYYYtoDate = function (d) {
  // validating format if valid the process else return input
  if (/\d{2}\/\d{2}\/\d{4}/g.test(d)) {
    var splitted = d.split('/')
    if (splitted.length > 3) {
      new Date(splitted[2], Number(splitted[1]) - 1, splitted[0])
    }else {
      return d
    }
  }else {
    return d
  }
}

// This helping function returns number f dates between 2 dates, it takes 2 dates, date1 and date2 as input parameters
module.exports.getDaysFromTwoDates = function (date1, date2) { // Get 1 day in milliseconds
  var one_day = 1000 * 60 * 60 * 24 // Convert both dates to milliseconds
  var date1_ms = date1.getTime()
  var date2_ms = date2.getTime() // Calculate the difference in milliseconds
  var difference_ms = date2_ms - date1_ms // Convert back to days and return
  return Math.round(difference_ms / one_day)
}

// This helping function returns date in MM/DD/YYYY, it takes date as input parameter
module.exports.formatDatetoMMddYYYY = function (date) {
  var year = date.getFullYear()

  var month = (1 + date.getMonth()).toString()
  month = month.length > 1 ? month : '0' + month

  var day = date.getDate().toString()
  day = day.length > 1 ? day : '0' + day

  return month + '/' + day + '/' + year
}
