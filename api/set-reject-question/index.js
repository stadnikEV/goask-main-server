const Question = require('../../models/question');
const HttpError = require('../../error');

module.exports = (req, res, next) => {
  const speaker = res.locals.speaker;
  const questionId = res.locals.questionId;

  Question.findById(questionId)
    .then((question) => {
      if (question.status === 'ready') {
        return Promise.reject(new HttpError({
          status: 403,
          message: 'Impossible to reject. The answer has already been sent.',
        }));
      }
      question.status = 'reject';
      return question.save();
    })
    .then(() => {
      speaker.questions.forEach((item) => {
        if (String(item) === String(questionId)) {
          speaker.questions.pull({ _id: String(item) })
          return;
        }
      });

      return speaker.save();
    })
    .then(() => {
      res.json({});
    })
    .catch((e) => {
      next(e);
    });
};
