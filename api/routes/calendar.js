const express = require('express');
const knex = require('../db');
const moment = require('moment');
const checkDay = require('../helpers/checkDay')

const router = express.Router()
module.exports = router;

router.get('/:startDate/:endDate/:resourceId', function (req, res) {

    // (1) The path will have a start and end date (format: yyyy-mm-dd).
    // (2) The path will have a resource id.
    // (3) Get the resource name.
    // (4) Get a set of all available slot start times, slot end times
    //     an slot days for the specified resource.
    // (5) Get a set of all available bookings for the resource within
    //     the start and end date.
    // (6) For each day within the start and date range:
    //     (a) create a set of slots for that day if the slot is valid
    //         for that day, based in its slots.day value; 
    //         For example: if the slots.day value == 'Monday' then only
    //         create a slot of the day is a Monday.
    // (7) For each slot from (6)(a) check whether its slots.starts and
    //     slots.end value intersect the booking's starts and ends range.
    //     If it does, mark the slot as booked. Otherwise mark it as available.
    // (8) Return the results.
    
    // Step (1)
    const starts = moment(req.params.startDate);
    const ends = moment(req.params.endDate).endOf('day');

    // Step (2)
    const resourceId = req.params.resourceId;
    
    console.log(`starts: ${starts}, ends: ${ends}`);
    
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
            // Step (3): get the resource name
            resourceName = results[0].name;
            return slotsQuery;
        })
        .then(function (results) {
            // Step (4): Get slots for the resource
            slots = results;
            return bookingsQuery;
        })
        .then(function (results) {
            // Step (5): Get bookings within the start and end dates
            bookings = results;

            let currentDate = moment(starts);

            responseDates = {
                dates: []
            }

            // Step (6)
            while(currentDate < ends) {

                date = {
                    date: currentDate.toISOString(),
                    resources: [{
                            resourceName: resourceName,
                            slots: []
                        }
                    ]
                };

                slots.forEach((s) => {

                    responseSlot = {
                        starts: moment(currentDate).add(s.starts),
                        ends: moment(currentDate).add(s.ends),
                        status: 'available'
                    };

                    // Step (6)(a)
                    if (checkDay(currentDate, s)) {
                        // Step (7)
                        bookings.forEach((b) => {

                        });
                        date.resources[0].slots.push(responseSlot);
                    };                
                });

                responseDates.dates.push(date);
                currentDate.add(1, 'd');
            }

            // Step (8)
            res.json(responseDates);
        })
        .catch(function (error) {
            res.status(500);
            res.json({ result: error });
        });
});

// function checkDay(date, slot) {
//     // isoWeekday returns a number between
//     // 1 (Monday) and 7 (Sunday).
//     isoDay = date.isoWeekday();

//     return true;
// }
