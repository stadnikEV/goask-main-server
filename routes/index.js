module.exports = ({ app }) => {
  app.get('/', require('./main'));
  app.get('/login', require('./login'));
  app.get('/registration', require('./registration'));
  app.get('/registration-speaker', require('./registration-speaker'));
  app.get('/my-sessions', require('./my-sessions'));
  app.post('/rest/login', require('./rest-login'));
  app.post('/rest/registration', require('./rest-registration'));
  app.post('/rest/registration-speaker', require('./rest-registration-speaker'));
  app.get('/rest/user-status', require('./rest-user-status'));


  // это тест
  app.get('/create-speaker/:id', require('./get-speaker'));
}
