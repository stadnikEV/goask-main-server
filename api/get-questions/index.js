const Question = require('../../models/question');

module.exports = (req, res, next) => {
  const user = res.locals.user;
  const params = res.locals.params;

  const numberOfQuestions = user.questions.length;

  Question.find({ user: user._id }, ['status', 'question', 'created'])
    .sort({ created: -1 })
    .skip(params.from - 1)
    .limit(params.to - params.from + 1)
    .populate('session', 'theme -_id')
    .then((questions) => {
      res.json({
        numberOfQuestions,
        questions,
      });
    })
    .catch((e) => {
      next(e);
    });
};
