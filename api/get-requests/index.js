const Question = require('../../models/question');
const getStatusVideo = require('./get-status-video');
const addStatusVideo = require('./add-status-video');


module.exports = (req, res, next) => {
  const speaker = res.locals.speaker;
  const params = res.locals.params;

  const numberOfRequests = speaker.questions.length;

  if (numberOfRequests === 0) {
    res.json({
      numberOfRequests: 0,
      requests: [],
    });

    return;
  }

  let requestsDB = null;

  Question.find({ speaker: speaker._id, status: ['ready', 'pending'] }, ['status', 'question', 'created'])
    .sort({ created: -1 })
    .skip(params.from - 1)
    .limit(params.to - params.from + 1)
    .populate('session', 'theme -_id')
    .then((requests) => {
      requestsDB = requests;
      return getStatusVideo({ requests });
    })
    .then((status) => {
      const requests = addStatusVideo({
        requests: requestsDB,
        status: status,
      });

      res.json({
        numberOfRequests,
        requests,
      });
    })
    .catch((e) => {
      next(e);
    });
};
