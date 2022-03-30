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
      dateSlots.push({
        starts: moment(date).add(slot.starts),
        ends: moment(date).add(slot.ends),
        status: slotIsAvailable(bookings, slot) ? 'available' : 'unavailable'
      });
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

function slotIsAvailable (bookings, slot) {
  return true;
}
