const ResourceItems = require("./resourceItems");
const SlotItems = require("./slotItems");
const CalendarItems = require("./calendarItems");
const BookingItems = require("./bookingItems");

class OptimismModel {
    constructor(knex) {
        this.knex = knex;
        this.resources = new ResourceItems(this);
        this.slots = new SlotItems(this);
        this.calendar = new CalendarItems(this);
        this.bookings = new BookingItems(this);
    }
}

module.exports = OptimismModel;
