module.exports = ({ app }) => {
  app.get('/', require('./main'));
  app.get('/login', require('./login'));
  app.get('/registration', require('./registration'));
  app.get('/create-speaker', require('./create-speaker'));
  app.post('/account-enter', require('./account-enter'));
  app.post('/account-create', require('./account-create'));
}
