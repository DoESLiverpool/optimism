const express = require('express');
const knex = require('../db');

const router = express.Router()
module.exports = router;

router.get('/:startDate/:endDate/:resourceId', function (req, res) {

    // (1) The path will have a start and end date (format: yyyy-mm-dd).
    // (2) The path will have a resource id.
    // (3) Get a set of all available slot start times, slot end times
    //     an slot days for the specified resource.
    // (4) For each day within the start and date range, create a set
    //     of slots for that day. Only create a slot if it is valid for
    //     for the specific day, based in its slots.day value.
    //     For example: if the slots.day value == 'Monday' then only
    //     create a slot of the day is a Monday.
    // (5) Get a set of all available bookings for the resource within
    //     the start and end date.
    // (6) For each slot from (4) check whether its slots.starts and slots.end
    //     value intersect the booking's starts and ends range.
    //     If it does, mark the slot as booked. Otherwise mark it as available.
    // (7) Return the results.
    
    const starts = new Date(`${req.params.startDate}T00:00:00`);
    const ends = new Date(`${req.params.endDate}T23:59:59`);
    const resourceId = req.params.resourceId;

    const resourceQuery = knex
        .select('name')
        .from('resources')
        .where('id', '=', resourceId);

    const slotsQuery = knex
        .select('slots.name', 'slots.starts', 'slots.ends','slots.day')
        .from('slots')
        .join('resources_slots', 'slots.id', '=', 'resources_slots.slot_id')
        .where('resources_slots.resource_id', resourceId);

    const bookingsQuery = knex
        .select('starts', 'ends')
        .from('bookings')
        .join('resources', 'resources.id', '=', 'bookings.resource_id')
        .where('bookings.resource_id', '=', resourceId)
        .where('starts', '>=', starts.toISOString())
        .where('ends', '<=', ends.toISOString());

    let resourceName;
    let slots;
    let bookings;

    resourceQuery
        .then(function(results) {
            resourceName = results[0].name;
            return slotsQuery;
        })
        .then(function (results) {
            slots = results;
            return bookingsQuery;
        })
        .then(function (results) {
            bookings = results;
            let output = [];

            let currentDate = new Date(starts);

            while(currentDate <= ends) {
                console.log(`Before: ${currentDate.toISOString()}`);
                currentDate = currentDate.setDate(currentDate.getDate() + 1);
                console.log(`After: ${currentDate.toISOString()}`);
            }

            filterSlots(starts, ends, slots, bookings);

            slots.forEach((s) => {
                //console.log(s);
            });

            res.json({
                resourceName: resourceName,
                bookings: bookings
            });
        })
        .catch(function (error) {
            res.status(500);
            res.json({ result: error });
        });
});

function filterSlots(starts, ends, slots, bookings) {

    // # Morning slots for laser cutter
    // # Weekdays: (suggested, shout if you know better, cron inspired)
    // # nil - every day
    // # 0 - sunday
    // # 1 - monday
    // # 2 - tuesday
    // # 3 - wednesday
    // # 4 - thursday
    // # 5 - friday
    // # 6 - saturday
    // # 7 - sunday
    // # 10 - weekday
    // # 11 - weekend

    slots.forEach((s) => {
        console.log(s);
    });

    return null;
}