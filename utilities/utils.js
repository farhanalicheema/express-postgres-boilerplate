var mkdir = require('mkdir-p');
var fs = require('fs');
const random = require('../utilities/random');

module.exports.saveFileAt = function writeFile(path, file, callback) {
  if (file) {
    var dir = __dirname + path;
    var fileName = random.randomstr();
    mkdir(dir, function (err) {
      if (err) {
        callback(err, fileName)
      }
      else {
        fs.readFile(file.path, function (err, data) { // readfilr from the given path
          fs.writeFile(dir + '/' + fileName + '.' + file.extension, data, function (err) { // write file in uploads folder
            callback(err, fileName)
          });
        });
      }
    });
  }
  else {
    callback("nofile", "");
  }
}

module.exports.velidateRequiredKeys = function (body, fields, callback) {

  var key = '';
  var name = '';
  var errorField = '';
  var value = '';
  for (var i = 0; i < fields.length; i++) {
    key = fields[i].key;
    name = fields[i].name;
    errorField = '';
    value = body[key];
    if (!value || value.replace(/\s+/g, '') == '') {
      errorField = name;
      break;
    }
  }
  callback(errorField);
}


module.exports.convertDDMMYYYYtoDate = function (d) {
  if (/\d{2}\/\d{2}\/\d{4}/g.test(d)) {
    var splitted = d.split('/');
    if (splitted.length > 3) {
      new Date(splitted[2], Number(splitted[1]) - 1, splitted[0]);
    }
    else {
      return d;
    }
  }
  else {
    return d;
  }
}

module.exports.getDaysFromTwoDates = function (date1, date2) {   //Get 1 day in milliseconds
  var one_day = 1000 * 60 * 60 * 24;    // Convert both dates to milliseconds
  var date1_ms = date1.getTime();
  var date2_ms = date2.getTime();    // Calculate the difference in milliseconds
  var difference_ms = date2_ms - date1_ms;        // Convert back to days and return
  return Math.round(difference_ms / one_day);
}

module.exports.formatDatetoMMddYYYY = function (date){
  var year = date.getFullYear();

  var month = (1 + date.getMonth()).toString();
  month = month.length > 1 ? month : '0' + month;

  var day = date.getDate().toString();
  day = day.length > 1 ? day : '0' + day;
  
  return month + '/' + day + '/' + year;
}