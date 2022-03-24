const ModelItemsBase = require('./modelItemsBase');

class ResourceItems extends ModelItemsBase {
  constructor (model) {
    super(model, 'resources', 'id', [
      'resource_type_id=resourceTypeId',
      'name',
      'capacity',
      'min_minutes=minimumBookingTime',
      'max_minutes=maximumBookingTime'
    ]);
  }
}

module.exports = ResourceItems;
