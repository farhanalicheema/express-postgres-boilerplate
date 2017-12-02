/**
 * This file contains the helping functions for making API Request
 */

 // Node http module to make http calls ( https://nodejs.org/api/http.html )
const http = require('http');
// A library to create readable "multipart/form-data" streams. Can be used to submit forms and file uploads to other web applications. ( https://www.npmjs.com/package/form-data )
const FormData = require('form-data');
// File I/O is provided by simple wrappers around standard POSIX functions ( https://nodejs.org/api/fs.html )
const fs = require('fs');
// Including utils which contains few helping function
const utils = require('./utils');
 // Getting the environmental variables
var config = require('../config/config');


// This helper is for making simple GET,POST,DELETE and PUT calls, 
// It takes 4 input parameters
// 1. Request as req
// 2. URI as path
// 3. HTTP Method as method
// 4. And Authorization string
// 
// And Returns 3 parameters
// 1. statusCode of API response
// 2. description message
// 3. response body
module.exports.genericAPIHelperWithAuth = function (req, path, method, auth, callback) {

    var repo = {
        'statusCode': '',
        'description': '',
        'response': ''
    }

    var body = JSON.stringify(req.body);
    var options = {
        host: config.apiHost,
        port: config.apiPort,
        path: path,
        method: method,
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': body.length,
            'Authorization': auth
        }
    };

    var responseString = '';
    var request = http.request(options, function (resp) {
        resp.setEncoding('utf8');
        console.log('Status: ' + resp.statusCode);
        console.log('Headers: ' + JSON.stringify(resp.headers));

        resp.on('data', function (chunk) {
            responseString += chunk;
        });
        resp.on('end', function () {
            if (responseString) {
                repo.response = JSON.parse(responseString);
            }
            repo.statusCode = resp.statusCode;
            repo.description = resp.headers['response-description'];
            callback(repo);
        });
        resp.on('error', function (e) {
            console.log("Got error: " + e.message);
            repo.statusCode = 500;
            repo.description = 'Oops, Something went wrong #GAH1';
            callback(repo);
        });
    });

    // post the data
    request.write(body);
    request.end();

};

// This helper is for making multipart POST and PUT calls, 
// It takes 5 input parameters
// 1. Request as req
// 2. URI as path
// 3. HTTP Method as method
// 4. FileNames which are to be sent
// 5. And Authorization string
// 
// And Returns 3 parameters
// 1. statusCode of API response
// 2. description message
// 3. response body
module.exports.genericAPIMultiPartHelperWithAuth = function (req, path, method, fileNames, auth, callback) {

    var repo = {
        'statusCode': '',
        'description': '',
        'response': ''
    }

    /**
     * Generating a request body which will contain files also using the form-data module
     */
    var form = new FormData();

    var nameArray = [];
    var valueArray = [];

    separateObjectToFieldsAndValues(req.body, nameArray, valueArray);

    for (var i = 0; i < nameArray.length; i++) {
        form.append(nameArray[i], valueArray[i]);
    }


    for (var f = 0; f < fileNames.length; f++) {
        var fileName = fileNames[f];
        if (req.files[fileName]) {
            if (Object.prototype.toString.call(req.files[fileName]) === '[object Array]') {
                for (var i = 0; i < fileNames; i++) {
                    form.append(fileName, fs.createReadStream(req.files[fileName][i].path));
                }
            }
            else {
                form.append(fileName, fs.createReadStream(req.files[fileName].path));
            }
        }

    }
    var headers = form.getHeaders();
    headers['Authorization'] = auth;
    var options = {
        host: config.apiHost,
        port: config.apiPort,
        path: path,
        method: method,
        headers: headers
    };

    var responseString = '';
    var request = http.request(options, function (resp) {
        resp.setEncoding('utf8');
        console.log('Status: ' + resp.statusCode);
        console.log('Headers: ' + JSON.stringify(resp.headers));

        resp.on('data', function (chunk) {
            responseString += chunk;
        });
        resp.on('end', function () {
            repo.statusCode = resp.statusCode;
            repo.description = resp.headers['response-description'];
            callback(repo);
        });
        resp.on('error', function (e) {
            console.log("Got error: " + e.message);
            repo.statusCode = 500;
            repo.description = 'Oops, Something went wrong #GAH1';
            callback(repo);
        });
    });

    // post the data
    form.pipe(request);

};

function separateObjectToFieldsAndValues(obj, nameArray, valueArray, parentKey) {
    var arrayKey, value;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) {
            value = obj[key];
            arrayKey = parentKey ? parentKey + "[" + key + "]" : key;
            if (value instanceof Array || value instanceof Object) {
                separateObjectToFieldsAndValues(value, nameArray, valueArray, arrayKey);
            }
            else {
                nameArray.push(arrayKey);
                valueArray.push(value);
            }
        }
    }
}