const express = require('express');
const mainModel = require('../model');
const router = express.Router();
const { checkId, checkPostItemFields, checkPutItemFields } = require('../model/validation');
module.exports = router;

router.get('/', async function (req, res) {
  try {
    const resourceTypes = await mainModel.resourceTypes.getAll();
    res.json(resourceTypes);
  } catch (error) {
    console.log(`Error trying to GET resourceTypes: ${error}`);
    res.status(500).send('Unexpected error trying to get all resourceTypes.');
  }
});

router.get('/:id', async function (req, res) {
  const id = checkId(req.params.id);
  if (id == null) {
    res.status(400).send('ResourceType id is not valid.');
  }
  try {
    const resourceType = await mainModel.resourceTypes.getById(id);
    if (resourceType == null) {
      res.status(404).send('No such resourceType');
    } else {
      res.json(resourceType);
    }
  } catch (error) {
    console.log(`Error trying to GET resourceType: ${error}`);
    res.status(500).send('Unexpected error trying to get a resourceType.');
  }
});

router.post('/', async function (req, res) {
  const resourceType = req.body;
  if (!checkPostItemFields(resourceType, mainModel.resourceTypes)) {
    res.status(400).send('ResourceType does not have required fields.');
  }
  try {
    const result = await mainModel.resourceTypes.insert(req.body);
    res.status(201).json(result);
  } catch (error) {
    console.log(`Error trying to POST a new resourceType: ${error}`);
    res.status(500).send('Unexpected error trying to create a new resourceType');
  }
});

router.put('/:id', async function (req, res) {
  const id = checkId(req.params.id);
  if (id == null) {
    res.status(400).send('ResourceType id is not valid.');
  }
  const resourceType = req.body;
  if (resourceType.id !== undefined && resourceType.id !== id) {
    res.status(400).send('ResourceType id parameter and id in request body must match.');
    return;
  }
  resourceType.id = id;
  if (!checkPutItemFields(resourceType, mainModel.resourceTypes)) {
    res.status(400).send('ResourceType does not have required fields.');
    return;
  }
  try {
    const existing = await mainModel.resources.getById(resourceType.id);
    if (existing == null) {
      res.status(404).send('No such resourceType');
      return;
    }
    const result = await mainModel.resourceTypes.update(req.body);
    res.json(result);
  } catch (error) {
    console.log(`Error trying to PUT a resourceType: ${error}`);
    res.status(500).send('Unexpected error trying to update a resourceType');
  }
});

router.delete('/:id', async function (req, res) {
  const id = checkId(req.params.id);
  if (id == null) {
    res.status(400).send('ResourceType id is not valid.');
    return;
  }
  try {
    const result = await mainModel.resourceTypes.deleteById(id);
    const status = result === 0 ? 204 : 200;
    res.status(status).json(result);
  } catch (error) {
    console.log(`Error trying to DELETE a resourceType: ${error}`);
    res.status(500).send('Unexpected error trying to delete a resourceType');
  }
});
