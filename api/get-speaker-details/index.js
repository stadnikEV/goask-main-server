const getQuery = require('./get-query');
const getResponse = require('./get-response');
const Speaker = require('../../models/speaker');

module.exports = (req, res, next) => {
  const speakerId = req.params.id;
  const query = getQuery({ req });

  Speaker.findOne({ speakerId }, query.speaker)
    .sort({ created: -1 })
    .populate('session', 'theme -_id')
    .then((response) => {
      // const response = getResponse({ speakers, fields: query.fields })
      // res.json(response);
    })
    .catch((e) => {
      next(e);
    });
}
