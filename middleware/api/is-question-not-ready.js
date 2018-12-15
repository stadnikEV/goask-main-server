const Question = require('../../models/question');
const HttpError = require('../../error');

module.exports = (req, res, next) => {
  Question.findById(res.locals.questionId)
    .then((question) => {
      if (!question) {
        return Promise.reject(new HttpError({
          status: 403,
          message: 'Question is not found',
        }));
      }

      if (question.status === 'ready') {
        return Promise.reject(new HttpError({
          status: 403,
          message: 'Impossible to change. Video is ready',
        }));
      }

      res.locals.question = question;
      next();
    })
    .catch((e) => {
      next(e);
    });
};
