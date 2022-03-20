const ModelItemsBase = require('./modelItemsBase');

class ResourceItems extends ModelItemsBase {
  static readQuery (knex) {
    return knex
      .select('resources.id AS id', 'resources.name AS name', 'resource_types.name AS resourceTypeName')
      .from('resources')
      .join('resource_types', 'resources.resource_type_id', '=', 'resource_types.id');
  }

  get (id) {
    const query = ResourceItems.readQuery(this.knex).where('resources.id', id);
    return query.then((resources) => {
      return resources.length === 0 ? null : resources[0];
    });
  }

  getAll () {
    const query = ResourceItems.readQuery(this.knex).orderBy('id', 'asc');
    return query.then((resources) => { return resources; });
  }
}

module.exports = ResourceItems;
