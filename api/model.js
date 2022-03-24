const OptimismModel = require('./data/optimismModel');
const knex = require('./db');

const mainModel = new OptimismModel(knex);

module.exports = mainModel;
