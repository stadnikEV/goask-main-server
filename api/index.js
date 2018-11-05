module.exports = ({ app }) => {
  app.post('/api/login',
    require('../middleware/api/is-json'),
    require('./login'));

  app.get('/api/logout', require('./logout'));

  app.post('/api/registration',
    require('../middleware/api/is-json'),
    require('./registration'));

  app.post('/api/registration-speaker',
    require('../middleware/api/is-json'),
    require('../middleware/api/is-login'),
    require('./registration-speaker'));

  app.get('/api/speakers/:id/categories-name', require('./speakers-categories-name'));

  app.get('/api/categories-name', require('./categories-name'));

  app.post('/api/add-session',
    require('../middleware/api/is-json'),
    require('../middleware/api/is-speaker'),
    require('../middleware/api/is-valid-speaker-category'),
    require('./add-session'));

  app.get('/api/speakers/:id/sessions', require('./speakers-sessions'));

  app.delete('/api/sessions/:id',
    require('../middleware/api/get-session'),
    require('../middleware/api/is-speaker'),
    require('../middleware/api/check-access-to-change-session'),
    require('./sessions-remove'));

  // test
  app.get('/sessions/:id', require('./sessions'));
}
