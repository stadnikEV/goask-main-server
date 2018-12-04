const httpRequest = require('request-promise-native');
const getRequestData = require('../../libs/get-request-data');
const HttpError = require('../../error');

module.exports = (req, res, next) => {

  const questionId = res.locals.questionId;

  getRequestData({ req })
    .then((streamData) => {
      return httpRequest.post({
        url: `http://localhost:5000/stream/${questionId}/stop`,
        body: streamData,
      });
    })
    .then(() => {
      const body = JSON.stringify({
        fileName: 'Goask',
      });

      return httpRequest.post({
        url: `http://localhost:5000/decoder/${questionId}`,
        body,
        headers: {
          'Content-Type': 'application/json',
        },
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