const HttpError = require('../error');
const Question = require('../models/question');

module.exports = (req, res, next) => {
  const questionId = req.params.id;

  Question.findById(questionId)
    .then((question) => {
      if (!question) {
        return Promise.reject(new HttpError({
          status: 404,
          message: 'Question not found',
        }));
      }

      if (question.status === 'ready') {
        res.redirect('/my-requests');

        return;
      }

      res.locals.question = question;

      next();
    })
    .catch((e) => {
      next(e);
    });
};
