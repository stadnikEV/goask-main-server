const Question = require('../../models/question');
const HttpError = require('../../error');

module.exports = (req, res, next) => {
  const speaker = res.locals.speaker;
  const status = req.body.status;
  const questionId = res.locals.questionId;

  if (status !== 'reject') {
    next(new HttpError({
      status: 400,
      message: 'Not correct status',
    }));

    return;
  }

  Question.findById(questionId)
    .then((question) => {
      question.status = status;
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
