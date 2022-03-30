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
}

module.exports = ResourceTypeItems;
