const getPublicPaths = require('../../libs/get-public-paths');
const Question = require('../../models/question');
const mongoose = require('../../libs/mongoose');

module.exports = (req, res, next) => {
  const questionText = req.body.text;
  const user = res.locals.user;
  const session = res.locals.session;
  const speaker = session.speaker;

  const question = new Question({
    _id: new mongoose.Types.ObjectId(),
    question: questionText,
    status: 'pending',
    user: user._id,
    session: session._id,
    speaker: speaker._id,
  });

  let questionId = null;

  question.save()
    .then((question) => {
      questionId = question._id;
      session.questions.push(questionId);
      return session.save();
    })
    .then(() => {
      speaker.questions.push(questionId);
      return speaker.save();
    })
    .then(() => {
      user.questions.push(questionId);
      return user.save();
    })
    .then(() => {
      let { publicPathBackEnd } = getPublicPaths();
      res.json({ link: `${publicPathBackEnd}/my-questions` });
    })
    .catch((e) => {
      next(e);
    });
};
