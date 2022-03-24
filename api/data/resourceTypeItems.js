const ModelItemsBase = require('./modelItemsBase');

class ResourceTypeItems extends ModelItemsBase {
  static readQuery (knex) {
    return knex
      .select('resource_types.id', 'resource_types.name')
      .from('resource_types');
  }

  get (id) {
    const query = ResourceTypeItems.readQuery(this.knex).where('resource_types.id', id);
    return query.then((resourceTypes) => {
      return resourceTypes.length === 0 ? null : resourceTypes[0];
    });
  }
}

module.exports = ResourceTypeItems;
