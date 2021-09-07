var environment = process.env.NODE_ENV || 'development';
var config = require('./knexfile.js')[environment];

useNullAsDefault: true;

module.exports = require('knex')(config);
