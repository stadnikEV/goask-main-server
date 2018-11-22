const Question = require('../../models/question');
const categoriesNameconfig  = require('../../libs/categories-name-config.js');

module.exports = (req, res, next) => {

  Question.findById(res.locals.questionId, ['question', 'status', '-_id'])
    .populate({
      path: 'session',
      select: 'theme describeSession category -_id',
      populate: {
        path: 'speaker',
        select: 'firstname lastname about -_id',
      }
    })
    .then((data) => {
      const response = {
        categoryName: categoriesNameconfig[data.session.category],
        question: data.question,
        status: data.status,
        aboutSpeaker: data.session.speaker.about,
        speakerName: [
          data.session.speaker.firstname,
          data.session.speaker.lastname,
        ],
        sessionTheme: data.session.theme,
        describeSession: data.session.describeSession,
      }

      res.json(response);
    })
    .catch((e) => {
      next(e);
    });
};
