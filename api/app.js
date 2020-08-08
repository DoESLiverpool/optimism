const express = require('express')
const db = require('./db')
const Resource = require('./models/resource')
const app = express()
const port = 3001

const publicResourceRoutes = require('./routes/public/resources');
const publicBookingRoutes = require('./routes/public/bookings');
const publicCalendarRoutes = require('./routes/public/calendar');
const publicSlotRoutes = require('./routes/public/slots');

app.use(express.json());
app.use('/api/resources', publicResourceRoutes);
app.use('/api/bookings', publicBookingRoutes);
app.use('/api/calendar', publicCalendarRoutes);
app.use('/api/slots', publicSlotRoutes);


app.listen(port, () => console.log(`Optimism api listening on port ${port}.`))

