const express = require('express');
const knex = require('../db');

const router = express.Router()
module.exports = router;

router.get('/', function (req, res) {

    knex
        .select('resources.name as rname', 'slots.name', 'slots.starts', 'slots.ends','slots.day')
        .from('resources')
        .join('resources_slots', 'resources.id', '=', 'resources_slots.resource_id')
        .join('slots', 'slots.id', '=', 'resources_slots.slot_id')
        .then(function(results) {
            res.json({result: results});
        })
        .catch(function(error) {
            res.status(500);
            res.json({result: error});
        });

});

