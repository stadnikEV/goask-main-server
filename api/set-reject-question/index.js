const Question = require('../../models/question');
const HttpError = require('../../error');
const deleteVideo = require('../../libs/google/youtube-api/delete');

module.exports = (statusVideo, oauthGoogle, req, res, next) => {
  const speaker = res.locals.speaker;
  const questionId = res.locals.questionId;
  let questionDB = null;

  Question.findById(questionId)
    .then((question) => {
      if (question.status === 'ready') {
        return Promise.reject(new HttpError({
          status: 403,
          message: 'Impossible to reject. The answer has already been sent.',
        }));
      }
      questionDB = question;
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

      if (!questionDB.statusVideo || !questionDB.statusVideo.id) {
        return;
      }

      statusVideo[questionId] = 'deleteYoutubeVideo';
      return deleteVideo({ oauthGoogle, id: questionDB.statusVideo.id });
    })
    .then(() => {
      delete statusVideo[questionId];
    })
    .catch((e) => {
      delete statusVideo[questionId];
      next(e);
    });
};
