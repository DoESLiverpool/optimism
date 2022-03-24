const ResourceItems = require('./resourceItems');
const ResourceTypeItems = require('./resourceTypeItems');
const SlotItems = require('./slotItems');
const BookingItems = require('./bookingItems');

class OptimismModel {
  constructor (knex) {
    this.knex = knex;

    this.resources = new ResourceItems(this);
    this.resourceTypes = new ResourceTypeItems(this);
    this.slots = new SlotItems(this);
    this.bookings = new BookingItems(this);
  }
}

module.exports = OptimismModel;
