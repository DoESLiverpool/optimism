const express = require('express');
const nunjucks = require('nunjucks');
const path = require('path');
const settings = require('./settings');

const app = express();
const port = settings.port;

const templatesFolder = path.join(__dirname, 'templates');
const staticFilesRootDirectory = path.join(__dirname, 'static');

nunjucks.configure(templatesFolder, {
  autoescape: true,
  express: app,
  watch: true
});

app.use(express.static(staticFilesRootDirectory));
app.use(require('./routes/public'));
app.use(require('./routes/select-a-resource'));
app.use(require('./routes/select-a-time'));
app.use('/admin', require('./routes/admin/login'));
app.use('/admin', require('./routes/admin/logout'));
app.use('/admin', require('./routes/admin/home'));
app.use('/admin', require('./routes/admin/bookings'));
app.use('/admin', require('./routes/admin/resources'));
app.use('/admin', require('./routes/admin/resourceTypes'));
app.use('/admin', require('./routes/admin/slots'));

app.listen(port, () => console.log(`Optimism website listening on port ${port}`));
