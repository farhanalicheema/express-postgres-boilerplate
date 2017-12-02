/**
 * This file contains the data base configurations
 */
var Sequelize = require('sequelize'); // Node Module used for DB queries ( https://www.npmjs.com/package/sequelize )
var config = require('./config'); // Getting the environmental variables

var db = config.dbName; // Database Name
var user = config.dbUser; // Database Username
var password = config.dbPassword; // Database Password
var dbHost = config.dbHost; // hosting address of server
console.log(db,user,password)
const sequelize = new Sequelize(db, user, password, {
  host: dbHost, 
  dialect: 'postgres', // Type of database, because Sequelize also support MySQL
  logging: false, // Change to true if wants to see log of database

  pool: {
    max: 5,
    min: 0,
    idle: 10000
  },

});

/**
 * Making connection
 */
sequelize
  .authenticate()
  .then(() => {
    sequelize.sync();
    console.log('Connection has been established successfully to '+config.dbName);
    return null;
  })
  .catch(err => {
    console.error('Unable to connect to the '+config.dbName+':', err);
  });

module.exports = sequelize;