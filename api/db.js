var knex = require('knex')({
    client: 'sqlite3',
    connection: {
        filename: "./db/optimism.sqlite3"
    }
});

module.exports = knex;
