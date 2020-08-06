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
    res.render('home.html');
});

app.get('/choose-a-resource', function(req, res) {
    res.render('choose-a-resource.html');
});

app.get('/select-a-time', function(req, res) {
    res.render('select-a-time.html');
});

app.get('/your-details', function(req, res) {
    res.render('your-details.html');
});

app.get('/confirmation', function(req, res) {
    res.render('confirmation.html');
});

app.listen(port, () => console.log(`Optimism website listening on port ${port}`));