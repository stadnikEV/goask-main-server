const getPublicPaths = require('../../libs/get-public-paths');

module.exports = (req, res, next) => {
  const user = res.locals.user;
  const questionId = res.locals.questionId;

  try {
    res.render('pages/play-user', {
      userName: user.userName,
      questionId,
      header: {
        buttons: {
          logout: true,
          createSpeaker: true,
        },
      },
      paths: getPublicPaths(),
    });
  } catch (e) {
    next(e);
  }
};
