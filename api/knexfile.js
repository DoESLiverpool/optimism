module.exports = {

  development: {
    client: 'better-sqlite3',

    connection: {
      filename: __dirname + '/../databases/optimism_development.sqlite3'
    },
    useNullAsDefault: true,
    pool: {
      min: 1,
      max: 1,
      acquireTimeoutMillis: 30000,
      idleTimeoutMillis: 30000
    },
    migrations: {
      directory: __dirname + '/migrations'
    },
    seeds: {
      directory: __dirname + '/seeds/development'
    }
  },
  testing: {
    client: 'better-sqlite3',

    connection: {
      filename: ':memory:'
    },
    useNullAsDefault: true,
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
