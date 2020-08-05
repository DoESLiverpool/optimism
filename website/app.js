const express = require('express');
const nunjucks = require('nunjucks');
const path = require('path');

const app = express();
const port = 3000;

const templatesFolder = path.join(__dirname, 'templates');
const staticFilesRootDirectory = path.join(__dirname, 'static');

nunjucks.configure(templatesFolder, {
    autoescape: true,
    express: app,
    watch: true
});

app.use(express.static(staticFilesRootDirectory));

app.get('/', function(req, res) {
    res.render('index.html');
});

app.listen(port, () => console.log(`Optimism website listening on port ${port}`));