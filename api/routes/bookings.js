const express = require('express');
const mainModel = require('../model');
const router = express.Router();
const { checkId, checkPostItemFields, checkPutItemFields } = require('../model/validation');
module.exports = router;

router.get('/', async function (req, res) {
  try {
    const slots = await mainModel.bookings.getAll();
    res.json(slots);
  } catch (error) {
    console.log(`Error trying to GET bookings: ${error}`);
    res.status(500).send('Unexpected error trying to get all bookings.');
  }
});

router.get('/:id', async function (req, res) {
  const id = checkId(req.params.id);
  if (id == null) {
    res.status(400).send('Booking id is not valid.');
    return;
  }
  try {
    const slot = await mainModel.bookings.getById(id);
    if (slot == null) {
      res.status(404).send('No such booking');
    } else {
      res.json(slot);
    }
  } catch (error) {
    console.log(`Error trying to GET booking: ${error}`);
    res.status(500).send('Unexpected error trying to get a booking.');
  }
});

router.post('/', async function (req, res) {
  const bookingtem = req.body;
  if (!checkPostItemFields(bookingtem, mainModel.bookings)) {
    res.status(400).send('Booking does not have required fields.');
    return;
  }
  try {
    const result = await mainModel.bookings.insert(req.body);
    res.status(201).json(result);
  } catch (error) {
    console.log(`Error trying to POST a new booking: ${error}`);
    res.status(500).send('Unexpected error trying to create a new booking');
  }
});

router.put('/:id', async function (req, res) {
  const id = checkId(req.params.id);
  if (id == null) {
    res.status(400).send('Booking id is not valid.');
  }
  const bookingItem = req.body;
  if (bookingItem.id !== undefined && bookingItem.id !== id) {
    res.status(400).send('Booking id parameter and id in request body must match.');
    return;
  }
  bookingItem.id = id;
  if (!checkPutItemFields(bookingItem, mainModel.bookings)) {
    res.status(400).send('Booking does not have required fields.');
    return;
  }
  try {
    const existing = await mainModel.bookings.getById(bookingItem.id);
    if (existing == null) {
      res.status(404).send('No such booking');
      return;
    }
    const result = await mainModel.bookings.update(req.body);
    res.json(result);
  } catch (error) {
    console.log(`Error trying to PUT a booking: ${error}`);
    res.status(500).send('Unexpected error trying to update a booking');
  }
});

router.delete('/:id', async function (req, res) {
  const id = checkId(req.params.id);
  if (id == null) {
    res.status(400).send('Booking id is not valid.');
    return;
  }
  try {
    const result = await mainModel.bookings.deleteWhere({ id: id });
    const status = result === 0 ? 204 : 200;
    res.status(status).json(result);
  } catch (error) {
    console.log(`Error trying to DELETE a booking: ${error}`);
    res.status(500).send('Unexpected error trying to delete a booking');
  }
});
