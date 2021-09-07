// This file is to allow `knex` to run in the root, but pull in the config from inside `/api`

actual_knexfile = require('./api/knexfile.js')

module.exports = actual_knexfile
