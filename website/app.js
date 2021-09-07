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

nunjucks.configure(templatesFolder, {
    autoescape: true,
    express: app,
    watch: true
});

app.use(express.static(staticFilesRootDirectory));
app.use(publicRoutes);
app.use(selectResourceRoute);
app.use(selectTimeRoute);

app.listen(port, () => console.log(`Optimism website listening on port ${port}`));