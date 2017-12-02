/**
 * This is sample model of Users , It contains following columns
 * 
 * 1. Username which is unique
 * 2. Password which is The HMAC of user entered password
 * 3. passwordSalt the salt with which HMAC was generated
 * 
 */

 // Node Module used for DB queries ( https://www.npmjs.com/package/sequelize )
var Sequelize = require('sequelize'); 
 // Including db.js which contains the database configuration
var db = require('../config/db');

// Creating Table with name user
module.exports = db.define('user', {
    userName: {
        type: Sequelize.STRING, // Type of column
        unique: true // unique constraint
    },
    password: {
        type: Sequelize.STRING
    },
    passwordSalt: {
        type: Sequelize.STRING
    }
});