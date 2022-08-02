module.exports = {

  development: {
    client: 'sqlite3',

    connection: {
      filename: __dirname + '/../databases/optimism_development.sqlite3'
    },
    migrations: {
      directory: __dirname + '/migrations'
    },
    seeds: {
      directory: __dirname + '/seeds/development'
    }
  },
  testing: {
    client: 'sqlite3',

    connection: {
      filename: ':memory:'
    },
    migrations: {
      directory: __dirname + '/migrations'
    },
    seeds: {
      directory: __dirname + '/seeds/testing'
    }
  },
  production: {
    client: 'pg',

    connection: {
      host: 'optimism_db',
      user: 'postgres',
      password: 'topsecret',
      database: 'postgres'
    },
    migrations: {
      directory: __dirname + '/migrations'
    },
    seeds: {
      directory: __dirname + '/seeds/production'
    }
  }
};
