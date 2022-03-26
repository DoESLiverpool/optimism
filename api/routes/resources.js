const express = require('express');
const mainModel = require('../model');
const router = express.Router();
const { validatedId, checkPostItemFields, checkPutItemFields } = require('../model/validation');
module.exports = router;

router.get('/:id?', async function (req, res) {
  if (req.params.id) {
    const id = validatedId(req.params.id);

    if (id == null) {
      res.status(400).send('Resource id is not valid.');
      return;
    }

    try {
      const resource = await mainModel.resources.get(id);
      if (resource == null) {
        res.status(404).send('No such resource');
      } else {
        const resourceType = await mainModel.resourceTypes.get(resource.resourceTypeId);
        resource.resourceTypeName = resourceType.name;
        res.json(resource);
      }
    } catch (error) {
      console.log(`Error trying to GET resource: ${error}`);
      res.status(500).send('Unexpected error trying to get a resource.');
    }
  } else {
    try {
      const resources = await mainModel.resources.getAll();
      for (const resource of resources) {
        const resourceType = await mainModel.resourceTypes.get(resource.resourceTypeId);
        resource.resourceTypeName = resourceType.name;
      }
      res.json(resources);
    } catch (error) {
      console.log(`Error trying to GET resource: ${error}`);
      res.status(500).send('Unexpected error trying to get all resources.');
    }
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
    res.json(result);
  } catch (error) {
    console.log(`Error trying to POST a new resource: ${error}`);
    res.status(500).send('Unexpected error trying to create a new resource');
  }
});

router.put('/', async function (req, res) {
  const resourceItem = req.body;
  if (!checkPutItemFields(resourceItem, mainModel.resources)) {
    res.status(400).send('Resource does not have required fields.');
    return;
  }
  try {
    const result = await mainModel.resources.update(req.body);
    res.json(result);
  } catch (error) {
    console.log(`Error trying to PUT a resource: ${error}`);
    res.status(500).send('Unexpected error trying to update a resource');
  }
});

router.delete('/:id?', async function (req, res) {
  const id = validatedId(req.params.id);

  if (id == null) {
    res.status(400).send('Resource id is not valid.');
    return;
  }
  try {
    const result = await mainModel.resources.delete(id);
    res.json(result);
  } catch (error) {
    console.log(`Error trying to DELETE a resource: ${error}`);
    res.status(500).send('Unexpected error trying to delete a resource');
  }
});
