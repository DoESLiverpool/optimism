const express = require('express');
const cors = require('cors');
const app = express();
const fs = require('fs');

require('dotenv').config();
const port = process.env.OPTIMISM_API_PORT || 3001;

// Read in the email config from the secrets
var email_user = "NEED TO SET EMAIL USER";
var email_pass = "NEED TO SET EMAIL PASS";
const email_user_path = "/run/secrets/email_user";
const email_pass_path = "/run/secrets/email_pass";
if (fs.existsSync(email_user_path))
{
    email_user = fs.readFileSync(email_user_path, { encoding: 'utf8' }).trim();
}
if (fs.existsSync(email_pass_path))
{
    email_pass = fs.readFileSync(email_pass_path, { encoding: 'utf8' }).trim();
}

const resourceRoutes = require('./routes/resources');
const resourceTypeRoutes = require('./routes/resourceTypes');
const bookingRoutes = require('./routes/bookings');
const calendarRoutes = require('./routes/calendar');
const slotRoutes = require('./routes/slots');

app.use(cors());
app.use(express.json());
app.use('/api/resources', resourceRoutes);
app.use('/api/resource-types', resourceTypeRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/calendar', calendarRoutes);
app.use('/api/slots', slotRoutes);

app.listen(port, () => console.log(`Optimism api listening on port ${port}.`));

module.exports = app;
