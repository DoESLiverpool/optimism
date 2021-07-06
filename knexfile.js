module.exports = {

  development: {
    client: 'sqlite3',
    
    connection: {
      filename: './db/optimism.sqlite3'
    },
    seeds: {
      directory: __dirname + '/seeds/development'
    }
  },
  testing: {
    client: 'sqlite3',
    
    connection: {
      filename: './db/optimism_test.sqlite3'
    },
    seeds: {
      directory: __dirname + '/seeds/testing'
    }
  }
};
