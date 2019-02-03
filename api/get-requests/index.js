const Question = require('../../models/question');
const addStatusVideo = require('./add-status-video');


module.exports = (statusVideo, req, res, next) => {
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


  Question.find({ speaker: speaker._id, status: ['ready', 'pending'] }, ['status', 'statusVideo', 'question', 'created'])
    .sort({ created: -1 })
    .skip(params.from - 1)
    .limit(params.to - params.from + 1)
    .populate('session', 'theme -_id')
    .then((requestsDB) => {
      const requests = addStatusVideo({
        requestsDB,
        statusVideo,
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
