const httpRequest = require('request-promise-native');
const HttpError = require('../error');

module.exports = (req, res, next) => {
  const statusVideo = res.locals.statusVideo

  if (statusVideo) {
    if (statusVideo.status !== 'recorded') {
      next(new HttpError({
        status: 404,
        message: 'Video not exists',
      }));

      return
    }

    res.locals.fileName = statusVideo.fileName;

    next();

    return;
  }

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
        if (data.status === 'recorded') {
          res.locals.fileName = data.fileName;
          next();
          return;
        }
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
