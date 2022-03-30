const express = require('express');
const mainModel = require('../model');
const router = express.Router();
const { checkId, checkPostItemFields, checkPutItemFields } = require('../model/validation');
module.exports = router;

router.get('/', async function (req, res) {
  try {
    const resources = await mainModel.resources.getAll();
    for (const resource of resources) {
      const resourceType = await mainModel.resourceTypes.getById(resource.resourceTypeId);
      resource.resourceTypeName = resourceType.name;
    }
    res.json(resources);
  } catch (error) {
    console.log(`Error trying to GET resource: ${error}`);
    res.status(500).send('Unexpected error trying to get all resources.');
  }
});

router.get('/:id', async function (req, res) {
  const id = checkId(req.params.id);
  if (id == null) {
    res.status(400).send('Resource id is not valid.');
    return;
  }
  try {
    const resource = await mainModel.resources.getById(id);
    if (resource == null) {
      res.status(404).send('No such resource');
    } else {
      const resourceType = await mainModel.resourceTypes.getById(resource.resourceTypeId);
      resource.resourceTypeName = resourceType.name;
      res.json(resource);
    }
  } catch (error) {
    console.log(`Error trying to GET resource: ${error}`);
    res.status(500).send('Unexpected error trying to get a resource.');
  }
});

router.post('/', async function (req, res) {
  const resourceItem = req.body;
  if (!checkPostItemFields(resourceItem, mainModel.resources)) {
    res.status(400).send('Resource does not have required fields.');
    return;
  }
  try {
    const result = await mainModel.resources.insert(req.body);
    res.status(201).json(result);
  } catch (error) {
    console.log(`Error trying to POST a new resource: ${error}`);
    res.status(500).send('Unexpected error trying to create a new resource');
  }
});

router.put('/:id', async function (req, res) {
  const id = checkId(req.params.id);
  if (id == null) {
    res.status(400).send('Resource id is not valid.');
    return;
  }
  const resourceItem = req.body;
  if (resourceItem.id !== undefined && resourceItem.id !== id) {
    res.status(400).send('Resource id parameter and id in request body must match.');
    return;
  }
  delete resourceItem.resourceTypeName;
  resourceItem.id = id;
  if (!checkPutItemFields(resourceItem, mainModel.resources)) {
    res.status(400).send('Resource does not have required fields.');
    return;
  }
  try {
    const existing = await mainModel.resources.getById(resourceItem.id);
    if (existing == null) {
      res.status(404).send('No such resource');
      return;
    }
    const result = await mainModel.resources.update(req.body);
    res.json(result);
  } catch (error) {
    console.log(`Error trying to PUT a resource: ${error}`);
    res.status(500).send('Unexpected error trying to update a resource');
  }
});

router.delete('/:id?', async function (req, res) {
  const id = checkId(req.params.id);
  if (id == null) {
    res.status(400).send('Resource id is not valid.');
    return;
  }
  try {
    await mainModel.bookings.deleteWhere({ resource_id: id });
    await mainModel.knex('resources_slots').delete().where({ resource_id: id });
    const result = await mainModel.resources.deleteWhere({ id: id });
    const status = result === 0 ? 204 : 200;
    res.status(status).json(result);
  } catch (error) {
    console.log(`Error trying to DELETE a resource: ${error}`);
    res.status(500).send('Unexpected error trying to delete a resource');
  }
});
