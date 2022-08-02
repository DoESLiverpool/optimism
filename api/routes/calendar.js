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
      if (_slotIsValidOnDate(slot, date)) {
        dateSlots.push({
          starts: moment(date).add(slot.starts),
          ends: moment(date).add(slot.ends),
          status: _slotIsAvailableAtTime(slot, date, resource, bookings) ? 'available' : 'unavailable'
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

/**
 * Checks whether a slot is available on a given date.
 *
 * @param {*} slot - the slot to check
 * @param {*} date - the date to check
 * @returns {boolean} true if the slot is valid on the date given, false if it is not
 */
function _slotIsValidOnDate (slot, date) {
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
 * @returns {boolean} true if the slot can be booked, false if it can't
 */
function _slotIsAvailableAtTime (slot, date, resource, bookings) {
  const maxCapacity = resource.capacity;
  const slotStarts = moment(date).add(slot.starts);
  const slotEnds = moment(date).add(slot.ends);
  let remainingCapacity = maxCapacity;
  for (const b of bookings) {
    const bookingStarts = moment(b.starts);
    const bookingEnds = moment(b.ends);
    if (slotStarts.isBetween(bookingStarts, bookingEnds, undefined, '[)') ||
      slotEnds.isBetween(bookingStarts, bookingEnds, undefined, '()]')) {
      remainingCapacity--;
    }
  }
  return remainingCapacity > 0;
}
