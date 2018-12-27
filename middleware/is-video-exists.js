const HttpError = require('../error');
const Question = require('../models/question');

module.exports = (req, res, next) => {
  const questionId = req.params.id;
  const getQuestion = () => {
    return new Promise((resolve, reject) => {
      if (res.locals.question) {
        resolve(res.locals.question);
        return;
      }

      Question.findById(questionId)
        .then((question) => {
          res.locals.question = question;
          resolve(question);
        })
        .catch((e) => {
          reject(e);
        });
    });
  }


  getQuestion()
    .then((question) => {
      const statusVideo = question.statusVideo;

      if (!statusVideo) {
        next(new HttpError({
          status: 404,
          message: 'Video not exists',
        }));

        return;
      }

      if (statusVideo.status !== 'processed' || !statusVideo.link) {
        next(new HttpError({
          status: 404,
          message: 'Video not exists',
        }));

        return
      }

      next();
    })
};
