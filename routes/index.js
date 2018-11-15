module.exports = ({ app }) => {
  app.get('/', require('./main'));
  app.get('/login', require('./login'));
  app.get('/registration', require('./registration'));
  app.get('/registration-speaker', require('./registration-speaker'));
  app.get('/my-sessions', require('./my-sessions'));
  app.get('/public-sessions',
    require('../middleware/routes/is-valid-category'),
    require('../middleware/routes/is-valid-sessions-page-number'),
    require('./public-sessions'));
  app.get('/public-sessions/:id',
    require('../middleware/routes//is-valid-session-id'),
    require('./public-session-details'));
  app.get('/my-questions', require('./my-guestions'));
}
