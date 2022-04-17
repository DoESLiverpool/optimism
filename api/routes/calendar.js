const express = require('express');
const mainModel = require('../model');
const moment = require('moment');
const { checkId, checkDate } = require('../model/validation');

const router = express.Router();
module.exports = router;

router.get('/:startDate/:endDate/:resourceId', async function (req, res) {
  const startDate = checkDate(req.params.startDate);

  if (startDate == null) {
    res.status(400).send('Start date is not a valid ISO-formatted date.');
    return;
  }

  const endDate = checkDate(req.params.endDate);

  if (endDate == null) {
    res.status(400).send('End date is not a valid ISO-formatted date.');
    return;
  }

  if (endDate <= startDate) {
    res.status(400).send('The end date must be after the start date.');
    return;
  }

  const resourceId = checkId(req.params.resourceId);

  if (resourceId == null) {
    res.status(400).send('Resource id is not valid.');
    return;
  }

  const resource = await mainModel.resources.getById(resourceId);

  if (resource == null) {
    res.status(404).send('No such resource.');
    return;
  }
  const slots = await mainModel.slots.getByResourceId(resource.id);
  const bookings = await mainModel.bookings.getByDate(startDate, endDate, resource.id);

  const responseDates = {
    dates: []
  };

  for (let date = startDate; date <= endDate; date = date.add(1, 'd')) {
    const dateSlots = [];
    slots.forEach((slot) => {
      if (_slotIsAvailableOnDay(slot, date)) {
        dateSlots.push({
          starts: moment(date).add(slot.starts),
          ends: moment(date).add(slot.ends),
          status: _slotIsAvailable(slot, date, resource, bookings) ? 'available' : 'unavailable'
        });
      }
    });
    responseDates.dates.push({
      date: date.toISOString(),
      resources: [{
        resourceName: resource.name,
        slots: dateSlots
      }]
    });
  }

  return res.json(responseDates);
});

0111110

/**
 *
 * @param slot
 * @param date
 */
function _slotIsAvailableOnDay (slot, date) {
  const day = date.day();
  const val = 2 ** day;
  return slot.day & val;
}

/**
 * Checks whether a slot is available to book, based on existing bookings and resource fields.
 *
 * @param {*} slot - the slot to check
 * @param {*} date - the date to check
 * @param {*} resource - the resource to check
 * @param {*} bookings - all the bookings for the resource over the time period for the calendar entries
 * @returns true if the slot can be booked, false if it can't
 */
function _slotIsAvailable (slot, date, resource, bookings) {
  const maxCapacity = resource.capacity;
  const day = date.day();
  return true;
}

// This method can be used to set the day of the week, with Sunday as 0 and Saturday as 6.

// 'id',
// 'resource_type_id=resourceTypeId',
// 'name',
// 'capacity',
// 'min_minutes=minimumBookingTime',
// 'max_minutes=maximumBookingTime'

// 'id',
// 'name',
// 'day',
// 'starts',
// 'ends'
