const Sequelize = require('sequelize');
var db = require('../config/db');

module.exports = db.define('user', {
    userName: {
        type: Sequelize.STRING,
        unique: true
    },
    password: {
        type: Sequelize.STRING
    },
    passwordSalt: {
        type: Sequelize.STRING
    }
});