const getQuery = require('./get-query');
const getResponse = require('./get-response');
const Speaker = require('../../models/speaker');

module.exports = (req, res, next) => {
  const query = getQuery({ req });

  Speaker.find(query.find, query.fields)
    .sort({ created: -1 })
    .then((speakers) => {
      const response = getResponse({ speakers, fields: query.fields })
      res.json(response);
    })
    .catch((e) => {
      next(e);
    });
}
