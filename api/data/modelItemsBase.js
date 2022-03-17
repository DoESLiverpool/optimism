class ModelItemsBase {
    constructor(model) {
        this.model = model;
        this.knex = model.knex;
    }
}

module.exports = ModelItemsBase;
