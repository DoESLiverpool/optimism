const ModelItemsBase = require('./modelItemsBase');

class BookingItems extends ModelItemsBase {
  static readQuery (knex) {
    return knex
      .select('bookings.id', 'bookings.resource_id as resourceId', 'bookings.email',
        'bookings.name', 'bookings.notes', 'bookings.starts', 'bookings.ends')
      .from('bookings');
  }

  get (starts, ends, resourceId) {
    const query = BookingItems.readQuery(this.knex)
      .join('resources', 'resources.id', '=', 'bookings.resource_id')
      .where('bookings.resource_id', '=', resourceId)
      .where('starts', '>=', starts.toISOString())
      .where('ends', '<=', ends.toISOString());
    return query.then((bookings) => { return bookings; });
  }
}

module.exports = BookingItems;
