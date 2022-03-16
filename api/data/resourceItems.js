const { query } = require('express');
const ModelIemsBase = require('./modelItemsBase');
const knex = require('../db');

class ResourceItems extends ModelIemsBase {
    constructor(knex) {
        super(knex);
    }

    static readQuery() {
        return knex.select('resources.id AS id', 'resources.name AS name', 'resource_types.name AS resourceTypeName')
            .from('resources')
            .join('resource_types', 'resources.resource_type_id', '=', 'resource_types.id');
    }

    get(id) {
        let query = ResourceItems.readQuery().where('resources.id', id);
        return query.then((resources) => {
            return resources.length == 0 ? null : resources[0];
        });    
    }

    getAll() {
        let query = ResourceItems.readQuery().orderBy('resourceTypeName', 'asc').orderBy('name', 'asc');
        return query.then((resources) => { return resources; });
    }
}

module.exports = ResourceItems;
