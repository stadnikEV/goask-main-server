const HttpError = require('../../error');

module.exports = (req, res, next) => {
  const questionId = req.params.id;
  const user = res.locals.user;
  const questions = user.questions;
  const isExistId = (id) => {
    return id.toString() === questionId;
  }

  if (!questions.some(isExistId)) {
    const httpError = new HttpError({
      status: 403,
      message: 'Information about this question is not available',
    });
    next(httpError);

    return;
  }

  res.locals.questionId = questionId;

  next();
};
