const http = require('http');
const FormData = require('form-data');
const fs = require('fs');
const utils = require('./utils');

module.exports.genericAPIHelperWithAuth = function (req, path, method, auth, callback) {

    var repo = {
        'statusCode': '',
        'description': '',
        'response': ''
    }

    var body = JSON.stringify(req.body);
    var options = {
        host: '127.0.0.1',
        port: '55557',
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

module.exports.genericAPIMultiPartHelperWithAuth = function (req, path, method, fileNames, auth, callback) {

    var repo = {
        'statusCode': '',
        'description': '',
        'response': ''
    }

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
        host: '127.0.0.1',
        port: '55555',
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
            // if (responseString) {
            //     repo.response = JSON.parse(responseString);
            // }
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