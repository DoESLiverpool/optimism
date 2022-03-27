const ModelIemsBase = require('./modelItemsBase');

class SlotItems extends ModelIemsBase {
  static readQuery (knex) {
    return knex
      .select('slots.name', 'slots.starts', 'slots.ends', 'slots.day')
      .from('slots');
  }

  getByResourceId (resourceId) {
    const query = SlotItems.readQuery(this.knex)
      .join('resources_slots', 'slots.id', '=', 'resources_slots.slot_id')
      .where('resources_slots.resource_id', resourceId);
    return query.then((slots) => { return slots; });
  }
}

module.exports = SlotItems;
