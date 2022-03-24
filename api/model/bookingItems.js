const ModelItemsBase = require('./modelItemsBase');

class BookingItems extends ModelItemsBase {
  constructor (model) {
    super(model, 'bookings', 'id', [
      'resource_id=resourceId',
      'email',
      'notes',
      'starts',
      'ends'
    ]);
  }

  get (starts, ends, resourceId) {
    const query = this.getSelectQuery()
      .join('resources', 'resources.id', '=', 'bookings.resource_id')
      .where('bookings.resource_id', '=', resourceId)
      .where('starts', '>=', starts.toISOString())
      .where('ends', '<=', ends.toISOString());
    return query.then((bookings) => { return bookings; });
  }
}

module.exports = BookingItems;
