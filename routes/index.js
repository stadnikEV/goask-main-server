module.exports = ({ app, downloadVideo, uploadVideo }) => {
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
    require('../middleware/routes/is-valid-session-id'),
    require('./public-session-details'));

  app.get('/my-questions', require('./my-guestions'));
  app.get('/my-requests', require('./my-requests'));

  app.get('/stream/:id',
    require('../middleware/is-login'),
    require('../middleware/is-speaker'),
    require('../middleware/is-my-request'),
    require('../middleware/is-question-status-not-ready'),
    require('./stream'));

  app.get('/download-video-speaker/:id',
    require('../middleware/is-speaker'),
    require('../middleware/is-my-request'),
    require('../middleware/is-not-streaming'),
    require('../middleware/api/is-video-not-upload').bind(null, uploadVideo),
    require('../middleware/is-video-exists'),
    require('./download-video').bind(null, downloadVideo));

  app.get('/download-video-user/:id',
    require('../middleware/is-login'),
    require('../middleware/api/is-my-question'),
    require('../middleware/is-question-status-ready'),
    require('../middleware/is-video-exists'),
    require('./download-video').bind(null, downloadVideo));
}
