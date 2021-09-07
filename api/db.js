var environment = process.env.NODE_ENV || 'development';
var config = require('../knexfile.js')[environment];
console.log('db test');
console.log(process.env.NODE_ENV);

useNullAsDefault: true;

module.exports = require('knex')(config);

