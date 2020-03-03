// File to provide a centralized connection to the database
// require this file rather than `const Sequelize = require('sequelize')

const Sequelize = require('sequelize')

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: 'db/development.sqlite'
})

module.exports = {
  Sequelize: Sequelize,
  sequelize: sequelize
}

