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
    require('../middleware/is-login'),
    require('../middleware/api/is-valid-category'),
    require('./registration-speaker'));

  app.get('/api/speakers/:id/categories-name',
    require('./get-speaker-categories-name')); // categories-name через параметр

  app.get('/api/categories-name',
    require('./get-categories-name'));

  app.post('/api/add-session',
    require('../middleware/api/is-json'),
    require('../middleware/is-speaker'),
    require('../middleware/api/is-valid-speaker-category'),
    require('./add-session'));

  app.get('/api/speakers/:id/sessions',
    require('./get-speaker-sessions'));

  app.delete('/api/sessions/:id',
    require('../middleware/api/get-session'),
    require('../middleware/is-speaker'),
    require('../middleware/api/check-access-to-change-session'),
    require('./remove-session'));

  app.post('/api/questions',
    require('../middleware/api/is-json'),
    require('../middleware/is-login'),
    require('../middleware/api/is-session-exists'),
    require('../middleware/api/is-ask-yourself'),
    require('./ask-question'));

  app.get('/api/questions',
    require('../middleware/is-login'),
    require('../middleware/api/is-valid-request-range'),
    require('./get-questions'));

  app.get('/api/questions/:id',
    require('../middleware/is-login'),
    require('../middleware/api/is-my-question'),
    require('./get-question-details'));
}
