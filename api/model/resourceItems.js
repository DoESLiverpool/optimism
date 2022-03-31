const ModelItemsBase = require('./modelItemsBase');
/**
 * Provides access to data in the resources table.
 */
class ResourceItems extends ModelItemsBase {
  /**
   * Creates an instance of ResourceItems.
   *
   * @param {object} model - The model to which this instance belongs.
   */
  constructor (model) {
    super(model, 'resources', 'id', [
      'id',
      'resource_type_id=resourceTypeId',
      'name',
      'capacity',
      'min_minutes=minimumBookingTime',
      'max_minutes=maximumBookingTime'
    ]);
  }

  /**
   * Deletes a resource item with a specified id. Any bookings which have
   * resource_id (resourceId in JSON) = id, will have resource_id set to null.
   *
   * @param {number} id - The id of the item to delete.
   * @param {Function} trx - Optional knex function to be supplied when using a transaction.
   * @returns {any} TODO
   */
  deleteById (id, trx) {
    return (async () => {
      let results = null;
      await this.model.knex.transaction(async trx => {
        const bookings = await this.model.bookings.getWhere({ resourceId: id }, trx);
        for (const r of bookings) {
          await this.model.bookings.update({ id: r.id, resourceId: null }, trx);
        }
        results = await super.deleteById(id, trx);
      });
      return results;
    })();
  }
}

module.exports = ResourceItems;
