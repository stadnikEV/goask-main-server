const config = require('../../config');
const httpRequest = require('request-promise-native');
const isAllowedContentType = require('./is-allowed-content-type');
const isAllowedExtension = require('./is-allowed-extension');
const HttpError = require('../../error');
const upload = require('../../libs/upload');
const createDirectory = require('../../libs/create-directory');

module.exports = (uploadVideo, req, res, next) => {
  const id = req.params.id;
  uploadVideo[id] = true;

  httpRequest.delete({
    url: `http://localhost:5000/stream/${id}`,
  })
    .then(() => {
      return createDirectory({ path: `${config.get('downloadVideoPath')}/${id}`});
    })
    .then(() => {
      return upload({ req, id });
    })
    .then(({ fileName, contentType, extension }) => {
      if (!isAllowedContentType({ contentType })) {
        return Promise.reject(new HttpError({
          status: 403,
          message: `Not allowed content-type ${contentType}`,
        }));
      }
      if (!isAllowedExtension({ extension })) {
        return Promise.reject(new HttpError({
          status: 403,
          message: `Not allowed extension ${extension}`,
        }));
      }

      return httpRequest.post({
        url: `http://localhost:5000/stream-db/${id}`,
        body: JSON.stringify({ originalFile: fileName }),
        headers: {
          'Content-Type': 'application/json',
        },
      });
    })
    .then(() => {
      httpRequest.post({
        url: `http://localhost:5000/decoder/${id}`,
        body: JSON.stringify({ fileName: 'Goask' }),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      delete uploadVideo[id];
      res.json({});
    })
    .catch((e) => {
      delete uploadVideo[id];
      res.header('Connection', 'close');
      next(e);
    });
};
