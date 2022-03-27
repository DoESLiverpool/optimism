const ModelItemsBase = require('./modelItemsBase');

class ResourceItems extends ModelItemsBase {
  static readQuery (knex) {
    return knex
      .select('resources.id', 'resources.resource_type_id as resourceTypeId', 'resources.name', 'resources.capacity',
        'resources.min_minutes as minimumBookingTime', 'resources.max_minutes as maximumBookingTime')
      .from('resources');
  }

  get (id) {
    const query = ResourceItems.readQuery(this.knex).where('resources.id', id);
    return query.then((resources) => {
      return resources.length === 0 ? null : resources[0];
    });
  }

  getAll () {
    const query = ResourceItems.readQuery(this.knex).orderBy('resources.id', 'asc');
    return query.then((resources) => { return resources; });
  }
}

module.exports = ResourceItems;
