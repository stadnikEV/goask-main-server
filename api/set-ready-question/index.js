const Question = require('../../models/question');

module.exports = (req, res, next) => {
  const questionId = res.locals.questionId;

  Question.findById(questionId)
    .then((question) => {
      question.status = 'ready';
      return question.save();
    })
    .then(() => {
      res.json({});
    })
    .catch((e) => {
      next(e);
    });
};
