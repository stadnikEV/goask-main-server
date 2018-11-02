module.exports = ({ app }) => {
  app.get('/', require('./main'));
  app.get('/login', require('./login'));
  app.get('/registration', require('./registration'));
  app.get('/registration-speaker', require('./registration-speaker'));
  app.get('/my-sessions', require('./my-sessions'));

  app.post('/rest/login', require('./rest-login'));
  app.post('/rest/registration', require('./rest-registration'));
  app.post('/rest/registration-speaker', require('./rest-registration-speaker'));
  app.get('/rest/speakers/:id/categories-name', require('./rest-speakers-categories-name'));
  app.get('/rest/categories-name', require('./rest-categories-name'));
  app.post('/rest/add-session', require('./rest-add-session'));
  app.get('/rest/speakers/:id/sessions', require('./rest-speakers-sessions'));
  app.get('/rest/sessions/:id/remove', require('./rest-sessions-remove'));

  // test
  app.get('/sessions/:id', require('./sessions'));
}
