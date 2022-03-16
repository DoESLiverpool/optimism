const OptimismModel = require('./data/optimismModel');
const knex = require('./db');

mainModel = new OptimismModel(knex);

module.exports = mainModel;
