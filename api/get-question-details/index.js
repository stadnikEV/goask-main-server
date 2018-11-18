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
    .then((question) => {
      const categoryName = categoriesNameconfig[question.session.category];
      res.json({ categoryName, question });
    })
    .catch((e) => {
      next(e);
    });
};
