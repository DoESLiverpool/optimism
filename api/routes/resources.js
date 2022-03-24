const express = require('express');
const mainModel = require('../model');
const router = express.Router();
const { validatedId } = require('../model/validation');
module.exports = router;

router.get('/:resourceId?', async function (req, res) {
  if (req.params.resourceId) {
    const id = validatedId(req.params.resourceId);

    if (id == null) {
      res.status(400).send('Resource id is not valid.');
      return;
    }

    const resource = await mainModel.resources.get(id);
    if (resource == null) {
      res.status(404).send('No such resource');
    } else {
      const resourceType = await mainModel.resourceTypes.get(resource.resourceTypeId);
      resource.resourceTypeName = resourceType.name;
      res.json(resource);
    }
  } else {
    const resources = await mainModel.resources.getAll();
    for (const resource of resources) {
      const resourceType = await mainModel.resourceTypes.get(resource.resourceTypeId);
      resource.resourceTypeName = resourceType.name;
    }
    res.json(resources);
  }
});

router.post('/', async function (req, res) {
  console.log(req.body);
  const result = await mainModel.resources.insert(req.body);
  res.json(result);
});
