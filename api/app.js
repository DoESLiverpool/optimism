const express = require('express');
const app = express();

require('dotenv').config();
const port = process.env.OPTIMISM_API_PORT || 3001

const resourceRoutes = require('./routes/resources');
const bookingRoutes = require('./routes/bookings');
const calendarRoutes = require('./routes/calendar');
const slotRoutes = require('./routes/slots');

app.use(express.json());
app.use('/api/resources', resourceRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/calendar', calendarRoutes);
app.use('/api/slots', slotRoutes);

app.listen(port, () => console.log(`Optimism api listening on port ${port}.`))

module.exports = app