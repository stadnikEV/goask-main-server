const config = require('../../config');
const httpRequest = require('request-promise-native');
let getRequestData = require('../../libs/get-request-data');

const HttpError = require('../../error');

module.exports = (req, res, next) => {

  const questionId = res.locals.questionId;

  getRequestData({
    req,
    res,
    timeout: config.get('maxRequestInterval'),
  })
    .then((streamData) => {
      return httpRequest.post({
        url: `http://localhost:5000/stream/${questionId}`,
        body: streamData,
      });
    })
    .then((response) => {
      const data = JSON.parse(response);
      res.json(data);
    })
    .catch((e) => {
      if (e.name === 'StatusCodeError') {
        const error = JSON.parse(e.error)
        next(new HttpError(error));

        return;
      }

      next(e);
    });
};
