const db = require('../db')

// FIXME Not quite sure why we need to define this but if I tried to include `db.sequelize` in
// FIXME the `Resource.init` call below it crashed.
const sequelize = db.sequelize

const Model = db.Sequelize.Model
class Resource extends Model {}
Resource.init({
  // attributes
  name: {
    type: db.Sequelize.STRING,
    allowNull: false
  },
  type: {
    type: db.Sequelize.STRING,
    allowNull: false
  },
  capacity: {
    type: db.Sequelize.INTEGER,
    allowNull: false
  },
  minLength: {
    type: db.Sequelize.INTEGER,
    allowNull: false
  },
  maxLength: {
    type: db.Sequelize.INTEGER
  }
}, {
  sequelize,
  modelName: 'resource'
  // options
})

module.exports = {
  Resource: Resource
}
