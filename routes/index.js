module.exports = ({ app }) => {
  app.get('/', require('./main'));
  app.get('/login', require('./login'));
  app.get('/registration', require('./registration'));
  app.get('/registration-speaker', require('./registration-speaker'));
  app.get('/my-sessions', require('./my-sessions'));
}
