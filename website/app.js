const express = require('express');
const nunjucks = require('nunjucks');
const path = require('path');

const app = express();

require('dotenv').config();
const port = process.env.OPTIMISM_WEBSITE_PORT || 3000

const templatesFolder = path.join(__dirname, 'templates');
const staticFilesRootDirectory = path.join(__dirname, 'static');

const publicRoutes = require('./routes/public');
const selectResourceRoute = require('./routes/select-a-resource');

nunjucks.configure(templatesFolder, {
    autoescape: true,
    express: app,
    watch: true
});

app.use(express.static(staticFilesRootDirectory));
app.use(publicRoutes);
app.use(selectResourceRoute);

app.listen(port, () => console.log(`Optimism website listening on port ${port}`));