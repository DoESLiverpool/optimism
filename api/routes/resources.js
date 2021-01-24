const express = require('express');
const knex = require('../db');

const router = express.Router()
module.exports = router;

router.get('/:resourceId?', async (req, res) => {

    let query = knex.select('resources.id AS id', 'resources.name AS name', 'resource_types.name AS resourceTypeName')
                    .from('resources')
                    .join('resource_types', 'resources.resource_type_id', '=', 'resource_types.id' )
                    .orderBy('resourceTypeName', 'asc')
                    .orderBy('name', 'asc');

    const id = req.params.resourceId;
    let singleResult = false;

    if (id) {
        query.where('resources.id', id);
        singleResult = true;
    }

    query.then(function (resources) {
        if (singleResult) {
            if (resources.length == 0) {
                res.status(404).send('No such resource');
            } else {
                res.json(resources[0]);
            }
        }
        else {
            res.status(200).send(resources);
        }
    })
    .catch(function(error) {
        res.status(500);
        res.json({message: error});
    });
});
