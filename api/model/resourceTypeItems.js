const ModelItemsBase = require('./modelItemsBase');

class ResourceTypeItems extends ModelItemsBase {
  constructor (model) {
    super(model, 'resource_types', 'id', ['id', 'name']);
  };
}

module.exports = ResourceTypeItems;
