const express = require('express');
const nunjucks = require('nunjucks');
const path = require('path');
const settings = require('./settings');

const app = express();
const port = settings.port;

const templatesFolder = path.join(__dirname, 'templates');
const staticFilesRootDirectory = path.join(__dirname, 'static');

const publicRoutes = require('./routes/public');
const selectResourceRoute = require('./routes/select-a-resource');
const selectTimeRoute = require('./routes/select-a-time');

const adminHomeRoute = require('./routes/admin/home');
const adminBookingsRoute = require('./routes/admin/bookings');
const adminResourcesRoute = require('./routes/admin/resources');
const adminResourceTypesRoute = require('./routes/admin/resourceTypes');
const adminSlotsRoutes = require('./routes/admin/slots');

nunjucks.configure(templatesFolder, {
  autoescape: true,
  express: app,
  watch: true
});

app.use(express.static(staticFilesRootDirectory));
app.use(publicRoutes);
app.use(selectResourceRoute);
app.use(selectTimeRoute);
app.use('/admin', adminHomeRoute);
app.use('/admin', adminBookingsRoute);
app.use('/admin', adminHomeRoute);
app.use('/admin', adminResourcesRoute);
app.use('/admin', adminResourceTypesRoute);
app.use('/admin', adminSlotsRoutes);

app.listen(port, () => console.log(`Optimism website listening on port ${port}`));
