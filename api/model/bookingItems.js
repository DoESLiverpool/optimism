const ModelItemsBase = require('./modelItemsBase');
/**
 * Provides access to data in the bookings table.
 */
class BookingItems extends ModelItemsBase {
  /**
   * Creates an instance of BookingItems.
   *
   * @param {object} model - The model to which this instance belongs.
   */
  constructor (model) {
    super(model, 'bookings', 'id', [
      'id',
      'resource_id=resourceId',
      'email',
      'notes',
      'starts',
      'ends'
    ]);
  }

  /**
   * Gets bookings items for a specified resource for a provided date range.
   *
   * @param {object} start - The start date.
   * @param {object} end - The inclusive end date.
   * @param {number} resourceId - The resource id.
   * @returns {Promise} When resolved returns an array of bookings for the resource where starts < date <= end.
   */
  getByDate (start, end, resourceId) {
    const query = this.getSelectQuery(this.knex)
      .join('resources', 'resources.id', '=', 'bookings.resource_id')
      .where('bookings.resource_id', '=', resourceId)
      .where('starts', '>=', start.toISOString())
      .where('ends', '<=', end.toISOString());
    return query.then((bookings) => { return bookings; });
  }
}

module.exports = BookingItems;
