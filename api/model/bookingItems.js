const ModelItemsBase = require('./modelItemsBase');
const crypto = require('crypto');
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
      'name',
      'notes',
      'starts',
      'ends',
      'token',
      'cancelled'
    ]);
  }

  /**
   * Generates a unique token for a booking.
   * @returns {string} URL-safe base64 encoded random token (32 bytes)
   */
  _generateToken () {
    return crypto.randomBytes(32).toString('base64url')+Date.now().toString();
  }

  /**
   * Inserts a new booking with a generated token.
   * @param {Object<string, any>} item - The booking to insert.
   * @param {Function} trx - Optional knex function to be supplied when using a transaction.
   * @returns {Promise} When resolved returns an array with the inserted booking id.
   */
  insert (item, trx = null) {
    // Generate token if not provided
    if (!item.token) {
      item.token = this._generateToken();
    }
    // Set cancelled to false if not provided
    if (item.cancelled === undefined) {
      item.cancelled = false;
    }
    return super.insert(item, trx);
  }

  /**
   * Gets bookings items for a specified resource for a provided date range.
   * Only returns non-cancelled bookings.
   *
   * @param {object} start - The start date.
   * @param {object} end - The inclusive end date.
   * @param {number} resourceId - The resource id.
   * @returns {Promise} When resolved returns an array of non-cancelled bookings for the resource where starts < date <= end.
   */
  getByDate (start, end, resourceId) {
    const query = this.getSelectQuery(this.knex)
      .join('resources', 'resources.id', '=', 'bookings.resource_id')
      .where('bookings.resource_id', '=', resourceId)
      .where('starts', '>=', start.toISOString())
      .where('ends', '>', start.toISOString())
      .where('cancelled', '=', false);
    return query.then((bookings) => { return bookings; });
  }

  /**
   * Gets a booking by its token.
   * @param {string} token - The booking token.
   * @param {Function} trx - Optional knex function to be supplied when using a transaction.
   * @returns {Promise} When resolved returns the booking with the supplied token, or null if it doesn't exist.
   */
  getByToken (token, trx = null) {
    const knexOrTrx = trx == null ? this.knex : trx;
    const query = this.getSelectQuery(knexOrTrx).where(`${this.tableName}.token`, token);
    return query.then((results) => {
      return results.length === 0 ? null : results[0];
    });
  }
}

module.exports = BookingItems;
