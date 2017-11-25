var Sequelize = require('sequelize');
var config = require('./config');

var db = config.dbName;
var user = config.dbUser;
var password = config.dbPassword;
console.log(db,user,password)
const sequelize = new Sequelize(db, user, password, {
  host: 'localhost',
  dialect: 'postgres',
  logging: false,

  pool: {
    max: 5,
    min: 0,
    idle: 10000
  },

});
sequelize
  .authenticate()
  .then(() => {
    sequelize.sync();
    console.log('Connection has been established successfully to '+config.dbName);
  })
  .catch(err => {
    console.error('Unable to connect to the '+config.dbName+':', err);
  });

module.exports = sequelize;