const ModelIemsBase = require('./modelItemsBase');

class SlotItems extends ModelIemsBase {
  constructor (model) {
    super(model, 'slots', 'id', [
      'id',
      'name',
      'day',
      'starts',
      'ends'
    ]);
  }

  getByResourceId (resourceId) {
    const query = this.getSelectQuery(this.knex)
      .join('resources_slots', 'slots.id', '=', 'resources_slots.slot_id')
      .where('resources_slots.resource_id', resourceId);
    return query.then((slots) => { return slots; });
  }
}

module.exports = SlotItems;
