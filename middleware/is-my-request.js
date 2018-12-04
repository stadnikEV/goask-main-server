const HttpError = require('../error');

module.exports = (req, res, next) => {
  const questionId = req.params.id;
  const speaker = res.locals.speaker;
  const questions = speaker.questions;

  const isExistId = (id) => {
    return id.toString() === questionId;
  }

  if (!questions.some(isExistId)) {
    const httpError = new HttpError({
      status: 403,
      message: 'No permissions to modify data',
    });
    next(httpError);

    return;
  }

  res.locals.questionId = questionId;

  next();
};
