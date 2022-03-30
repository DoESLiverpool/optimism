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
}

module.exports = ResourceItems;
