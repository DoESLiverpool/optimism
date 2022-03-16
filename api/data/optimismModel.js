const ResourceItems = require("./resourceItems");

class OptimismModel {
    constructor(knex) {
        this.knex = knex;
        this.resources = new ResourceItems(knex);
    }
}

module.exports = OptimismModel;
