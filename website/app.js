const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
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

const auth = function (req, res, next) {
  const path = req.path;
  const requiresAuth = '/admin';
  const login = '/admin/login';
  const logout = '/admin/logout';

  if (path === login || path === logout) {
    return next();
  }

  if (req.session && req.session.isAdmin) {
    return next();
  }

  if (path.startsWith(requiresAuth)) {
    return res.redirect(`/admin/login?redirect=${path}`);
  }

  return next();
};

app.use(express.static(staticFilesRootDirectory));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(session({
  secret: 'b8268fa1-3b29-4885-80fc-e916b9949386',
  resave: true,
  saveUninitialized: true
}));
app.use(auth);
app.use(require('./routes/home'));
app.use(require('./routes/select-a-resource'));
app.use(require('./routes/select-a-time'));
app.use(require('./routes/your-details'));
app.use(require('./routes/confirmation'));
app.use('/admin', require('./routes/admin/login'));
app.use('/admin', require('./routes/admin/logout'));
app.use('/admin', require('./routes/admin/home'));
app.use('/admin', require('./routes/admin/bookings'));
app.use('/admin', require('./routes/admin/resources'));
app.use('/admin', require('./routes/admin/resourceTypes'));
app.use('/admin', require('./routes/admin/slots'));

app.listen(port, () => console.log(`Optimism website listening on port ${port}`));
