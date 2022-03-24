const ModelItemsBase = require('./modelItemsBase');

class ResourceTypeItems extends ModelItemsBase {
  constructor (model) {
    super(model, 'resource_types', 'id', ['name']);
  };
}

module.exports = ResourceTypeItems;
