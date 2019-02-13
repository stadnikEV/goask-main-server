module.exports = ({ app, statusVideo, oauthGoogle }) => {
  app.post('/api/login',
    require('../middleware/api/is-json'),
    require('./login'));

  app.post('/api/login-admin',
    require('../middleware/api/is-json'),
    require('./login-admin'));

  app.get('/api/logout', require('./logout'));

  app.post('/api/registration',
    require('../middleware/api/is-json'),
    require('./registration-user').bind(null, oauthGoogle));

  app.post('/api/become-speaker',
    require('../middleware/api/is-json'),
    require('../middleware/is-login'),
    require('../middleware/api/is-valid-category'),
    require('./become-speaker').bind(null, oauthGoogle));

  app.post('/api/create-speaker',
    require('../middleware/api/is-json'),
    require('../middleware/api/is-valid-category'),
    require('./create-speaker').bind(null, oauthGoogle));

  app.get('/api/speakers/:id/categories-name',
    require('../middleware/api/is-valid-id'),
    require('./get-speaker-categories-name'));

  app.get('/api/categories-name',
    require('./get-categories-name'));

  app.get('/api/speakers',
    require('../middleware/is-admin'),
    require('./get-speakers'));

  app.get('/api/speakers/:id',
    require('../middleware/api/is-valid-id'),
    require('../middleware/is-admin'),
    require('./get-speaker-details'));

  app.post('/api/speakers/:id/status',
    require('../middleware/api/is-valid-id'),
    require('../middleware/is-admin'),
    require('./set-speaker-status'));

  app.post('/api/add-session',
    require('../middleware/api/is-json'),
    require('../middleware/is-speaker'),
    require('../middleware/api/is-valid-speaker-category'),
    require('./add-session'));

  app.get('/api/speakers/:id/sessions',
    require('../middleware/api/is-valid-id'),
    require('../middleware/is-speaker'),
    require('./get-speaker-sessions'));

  app.delete('/api/sessions/:id',
    require('../middleware/api/is-valid-id'),
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
    require('../middleware/api/is-valid-id'),
    require('../middleware/is-login'),
    require('../middleware/api/is-my-question'),
    require('./get-question-details'));

  app.get('/api/requests',
    require('../middleware/is-speaker'),
    require('../middleware/api/is-valid-request-range'),
    require('./get-requests').bind(null, statusVideo));

  app.put('/api/requests/:id/reject',
    require('../middleware/api/is-valid-id'),
    require('../middleware/api/is-json'),
    require('../middleware/is-speaker'),
    require('../middleware/is-my-request'),
    require('../middleware/api/is-video-not-upload').bind(null, statusVideo),
    require('../middleware/is-not-streaming').bind(null, statusVideo),
    require('../middleware/api/is-question-not-ready'),
    require('./set-reject-question').bind(null, statusVideo, oauthGoogle));

  app.put('/api/requests/:id/ready',
    require('../middleware/api/is-valid-id'),
    require('../middleware/api/is-json'),
    require('../middleware/is-speaker'),
    require('../middleware/is-my-request'),
    require('../middleware/api/is-video-not-upload').bind(null, statusVideo),
    require('../middleware/is-not-streaming').bind(null, statusVideo),
    require('../middleware/api/is-question-not-ready'),
    require('../middleware/is-video-exists'),
    require('./set-ready-question'));

  app.post('/api/stream/:id/start',
    require('../middleware/api/is-valid-id'),
    require('../middleware/is-speaker'),
    require('../middleware/is-my-request'),
    require('../middleware/api/is-question-not-ready'),
    require('../middleware/is-not-streaming').bind(null, statusVideo),
    require('../middleware/api/is-video-not-upload').bind(null, statusVideo),
    require('./stream-start').bind(null, statusVideo));

  app.post('/api/stream/:id',
    require('../middleware/api/is-valid-id'),
    require('../middleware/is-speaker'),
    require('../middleware/is-my-request'),
    require('./stream').bind(null, statusVideo));

  app.post('/api/stream/:id/stop',
    require('../middleware/api/is-valid-id'),
    require('../middleware/is-speaker'),
    require('../middleware/is-my-request'),
    require('./stream-stop').bind(null, statusVideo, oauthGoogle));

  app.post('/api/upload/:id',
    require('../middleware/api/is-valid-id'),
    require('../middleware/api/is-not-exceeded-file-size'),
    require('../middleware/is-speaker'),
    require('../middleware/is-my-request'),
    require('../middleware/api/is-question-not-ready'),
    require('../middleware/api/is-video-not-upload').bind(null, statusVideo),
    require('../middleware/is-not-streaming').bind(null, statusVideo),
    require('./upload').bind(null, statusVideo, oauthGoogle));

  app.get('/api/get-youtube-id-speaker/:id',
    require('../middleware/api/is-valid-id'),
    require('../middleware/is-speaker'),
    require('../middleware/is-my-request'),
    require('../middleware/is-video-exists'),
    require('./get-youtube-id'));

  app.get('/api/get-youtube-id-user/:id',
    require('../middleware/api/is-valid-id'),
    require('../middleware/is-login'),
    require('../middleware/api/is-my-question'),
    require('../middleware/is-video-exists'),
    require('./get-youtube-id'));
}
