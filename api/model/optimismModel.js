const ResourceItems = require('./resourceItems');
const ResourceTypeItems = require('./resourceTypeItems');
const SlotItems = require('./slotItems');
const BookingItems = require('./bookingItems');
/**
 * Represents the underlying database tables and provides properties to access and
 * modify the data in these.
 */
class OptimismModel {
  /**
   * Creates a new instance of OptimismModel.
   *
   * @param {Function} knex - A knex function used by OptimismModel to build queries.
   */
  constructor (knex) {
    this.knex = knex;

    this.resources = new ResourceItems(this);
    this.resourceTypes = new ResourceTypeItems(this);
    this.slots = new SlotItems(this);
    this.bookings = new BookingItems(this);
  }
}

module.exports = OptimismModel;
