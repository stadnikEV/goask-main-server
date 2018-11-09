module.exports = ({ app }) => {
  app.get('/', require('./main'));
  app.get('/login', require('./login'));
  app.get('/registration', require('./registration'));
  app.get('/registration-speaker', require('./registration-speaker'));
  app.get('/my-sessions', require('./my-sessions'));
  app.get('/public-sessions',
    require('../middleware/routes/sessions-page-check'),
    require('./public-sessions'));
  app.get('/public-sessions/:category',
    require('../middleware/routes/is-valid-category'),
    require('../middleware/routes/sessions-page-check'),
    require('./public-sessions'));
}
