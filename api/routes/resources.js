const express = require('express');
const mainModel = require('../model');
const router = express.Router()
module.exports = router;

router.get('/:resourceId?', async function (req, res) {

    const queryId = req.params.resourceId;

    if (queryId) {
        let id = Number(queryId);
        if (!Number.isInteger(id) || id < 0) {
            res.status(400).send(`Resource id is not valid.`);
            return;
        }

        const resource = await mainModel.resources.get(id);
        resource == null ? res.status(404).send('No such resource') : res.json(resource);
    } else {
        const resources = await mainModel.resources.getAll();
        res.json(resources);
    }
});
