const express = require('express');

const router = express.Router()
module.exports = router;

example_calendar = {
    date: '2020-08-17',
    resources: [
        {
            id: 3,
            name: 'Large laser cutter (Gerald)',
            slots: [
                { starts: '09:00', duration: '4:30', repeats: 1 },
                { starts: '13:30', duration: '3:30', repeats: 1 }
            ]
        },
        {
            id: 4,
            name: 'Events room',
            slots: [
                { starts: '09:00', duration: '1:00', repeats: 12 }
            ]
        }
    ]
}

router.get('/', function (req, res) {
    res.json(example_calendar);
});

