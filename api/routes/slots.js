const express = require('express');
const mainModel = require('../model');
const router = express.Router();
const { validatedId, checkPostItemFields, checkPutItemFields } = require('../model/validation');
module.exports = router;

router.get('/', async function (req, res) {
  try {
    const slots = await mainModel.slots.getAll();
    res.json(slots);
  } catch (error) {
    console.log(`Error trying to GET slots: ${error}`);
    res.status(500).send('Unexpected error trying to get all slots.');
  }
});

router.get('/:id', async function (req, res) {
  const id = validatedId(req.params.id);
  if (id == null) {
    res.status(400).send('Slot id is not valid.');
  }
  try {
    const slot = await mainModel.slots.getById(id);
    if (slot == null) {
      res.status(404).send('No such slot');
    } else {
      res.json(slot);
    }
  } catch (error) {
    console.log(`Error trying to GET slot: ${error}`);
    res.status(500).send('Unexpected error trying to get a slot.');
  }
});

router.post('/', async function (req, res) {
  const slotItem = req.body;
  if (!checkPostItemFields(slotItem, mainModel.slots)) {
    res.status(400).send('Slot does not have required fields.');
  }
  try {
    const result = await mainModel.slots.insert(req.body);
    res.status(201).json(result);
  } catch (error) {
    console.log(`Error trying to POST a new slot: ${error}`);
    res.status(500).send('Unexpected error trying to create a new slot');
  }
});

router.put('/:id', async function (req, res) {
  const id = validatedId(req.params.id);
  if (id == null) {
    res.status(400).send('Slot id is not valid.');
  }
  const slotItem = req.body;
  if (slotItem.id !== undefined && slotItem.id !== id) {
    res.status(400).send('Slot id parameter and id in request body must match.');
    return;
  }
  slotItem.id = id;
  if (!checkPutItemFields(slotItem, mainModel.slots)) {
    res.status(400).send('Slot does not have required fields.');
    return;
  }
  try {
    const existing = await mainModel.resources.getById(slotItem.id);
    if (existing == null) {
      res.status(404).send('No such slot');
      return;
    }
    const result = await mainModel.resources.update(req.body);
    res.json(result);
  } catch (error) {
    console.log(`Error trying to PUT a slot: ${error}`);
    res.status(500).send('Unexpected error trying to update a slot');
  }
});

router.delete('/:id', async function (req, res) {
  const id = validatedId(req.params.id);
  if (id == null) {
    res.status(400).send('Slot id is not valid.');
    return;
  }
  try {
    await mainModel.knex('resources_slots').delete().where({ slot_id: id });
    const result = await mainModel.slots.delete({ id: id });
    const status = result === 0 ? 204 : 200;
    res.status(status).json(result);
  } catch (error) {
    console.log(`Error trying to DELETE a slot: ${error}`);
    res.status(500).send('Unexpected error trying to delete a slot');
  }
});
