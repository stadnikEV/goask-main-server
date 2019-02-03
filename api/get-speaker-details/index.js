const getResponse = require('./get-response');
const Speaker = require('../../models/speaker');

module.exports = (req, res, next) => {
  const speakerId = req.params.id;

  Speaker.findOne({ speakerId }, ['firstname', 'lastname', 'categories', 'active', 'about', 'speakerId', '-_id'])
    .sort({ created: -1 })
    .populate({
      path: 'questions',
      select: 'status -_id',
    })
    // .populate({
    //   path: 'sessions',
    //   select: 'theme status sessionId -_id',
    // })
    .then((response) => {
      res.json(getResponse({ response }));
    })
    .catch((e) => {
      next(e);
    });
}
