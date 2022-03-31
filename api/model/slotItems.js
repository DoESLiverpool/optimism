const ModelIemsBase = require('./modelItemsBase');
/**
 * Provides access to data in the slots table.
 */
class SlotItems extends ModelIemsBase {
  /**
   * Creates an instance of SlotItems.
   *
   * @param {*} model - The model to which this instance belongs.
   */
  constructor (model) {
    super(model, 'slots', 'id', [
      'id',
      'name',
      'day',
      'starts',
      'ends'
    ]);
  }

  /**
   * Gets slot items for a specific resource.
   *
   * @param {number} resourceId - The id of the resource.
   * @returns {Promise} When resolved returns all slot items for the resource.
   */
  getByResourceId (resourceId) {
    const query = this.getSelectQuery(this.knex)
      .join('resources_slots', 'slots.id', '=', 'resources_slots.slot_id')
      .where('resources_slots.resource_id', resourceId);
    return query.then((slots) => { return slots; });
  }

  /**
   * Deletes a slot item with a specified id. Any association this slot has with resources
   * (in the resources_slots join table) will be removed.
   *
   * @param {number} id - The id of the item to delete.
   * @param {Function} trx - Optional knex function to be supplied when using a transaction.
   * @returns {any} TODO
   */
  deleteById (id, trx = null) {
    return (async () => {
      let results = null;
      await this.model.knex.transaction(async trx => {
        await trx('resources_slots').delete().where({ slot_id: id });
        results = await super.deleteById(id, trx);
      });
      return results;
    })();
  }
}

module.exports = SlotItems;
