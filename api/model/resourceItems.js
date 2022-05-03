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
    // TODO: deal with the case where trx is provided as a parameter.
    return (async () => {
      let results = null;
      await this.model.knex.transaction(async trx => {
        const bookings = await this.model.bookings.getWhere({ resourceId: id }, trx);
        for (const r of bookings) {
          await this.model.bookings.update({ id: r.id, resourceId: null }, trx);
        }
        await trx('resources_slots').delete().where({ resource_id: id });
        results = await super.deleteById(id, trx);
      });
      return results;
    })();
  }

  updateSlots (id, slots) {
    return (async () => {
      await this.model.knex.transaction(async trx => {
        await trx('resources_slots').delete().where({ resource_id: id });
        for (const s of slots) {
          await trx('resources_slots').insert({ resource_id: id, slot_id: s.id });
        }
      });
      return slots.length;
    })();
  }
}

module.exports = ResourceItems;
