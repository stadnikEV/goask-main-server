const config = require('../../config');
const httpRequest = require('request-promise-native');
const getRequestData = require('../../libs/get-request-data');

const HttpError = require('../../error');

module.exports = (statusVideo, req, res, next) => {
  const questionId = res.locals.questionId;
  statusVideo[questionId] = 'streaming';

  getRequestData({
    req,
    res,
    timeout: config.get('maxRequestInterval'),
  })
    .then((streamData) => {
      return httpRequest.post({
        url: `http://localhost:5000/stream/${questionId}/start`,
        body: streamData,
      });
    })
    .then((response) => {
      const data = JSON.parse(response);
      res.json(data);
    })
    .catch((e) => {
      delete statusVideo[questionId];
      if (e.name === 'StatusCodeError') {
        const error = JSON.parse(e.error)
        next(new HttpError(error));

        return;
      }
      next(e);
    });
};
