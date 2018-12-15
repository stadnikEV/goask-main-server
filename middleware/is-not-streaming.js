const httpRequest = require('request-promise-native');
const HttpError = require('../error');

module.exports = (req, res, next) => {
  const id = req.params.id;

  httpRequest.get({
    url: `http://localhost:5000/status-video`,
    body: JSON.stringify({ id: [id] }),
    headers: {
      'content-type': 'application/json',
    },
  })
    .then((response) => {
      const data = JSON.parse(response)[id];
      if (data) {
        if (data.status === 'stream' || data.status === 'decode') {
          return Promise.reject(new HttpError({
            status: 403,
            message: 'Video is steaming now',
          }));
        }
      }

      res.locals.statusVideo = data;
      next();
    })
    .catch((e) => {
      next(e);
    });
};
