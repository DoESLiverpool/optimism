const OptimismModel = require('./model/optimismModel');
const knex = require('./db');

const mainModel = new OptimismModel(knex);

module.exports = mainModel;
