var knex = require('knex')({
    client: 'pg',
    
    connection: {
      host: 'optimism_db',
      user: 'postgres',
      password: 'topsecret',
      database: 'postgres'
    },
    useNullAsDefault: true
});
