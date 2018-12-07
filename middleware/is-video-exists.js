const httpRequest = require('request-promise-native');
const HttpError = require('../error');

module.exports = (req, res, next) => {
  const id = req.params.id;

  httpRequest.post({
    url: `http://localhost:5000/status-video`,
    body: JSON.stringify({ id: [id] }),
    headers: {
      'content-type': 'application/json',
    },
  })
    .then((response) => {
      const status = JSON.parse(response)[id];
      if (status === 'recorded') {
        next();
        return;
      }

      return Promise.reject(new HttpError({
        status: 404,
        message: 'Video not exists',
      }));
    })
    .catch((e) => {
      next(e);
    });
};
