const ModelItemsBase = require('./modelItemsBase');
/**
 * Provides access to data in the resource_types table.
 */
class ResourceTypeItems extends ModelItemsBase {
  /**
   * Creates an instance of ResourceTypeItems.
   *
   * @param {object} model - The model to which this instance belongs.
   */
  constructor (model) {
    super(model, 'resource_types', 'id', ['id', 'name']);
  };

  /**
   * Deletes an item with a specified id. Any resources which have
   * resource_type_id (resourceTypeId in JSON) = id, will have resource_type_id set to null.
   *
   * @param {number} id - The id of the item to delete.
   * @param {Function} trx - Optional knex function to be supplied when using a transaction.
   * @returns {any} TODO
   */
  deleteById (id, trx) {
    return (async () => {
      let result = null;
      await this.model.knex.transaction(async trx => {
        const resources = await this.model.resources.getWhere({ resourceTypeId: id }, trx);
        for (const r of resources) {
          await this.model.resources.update({ id: r.id, resourceTypeId: null }, trx);
        }
        result = await super.deleteById(id, trx);
      });
      return result;
    })();
  }
}

module.exports = ResourceTypeItems;
