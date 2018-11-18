
const getPublicPaths = require('../../libs/get-public-paths');
const isLogin = require('../../libs/is-login');
const User = require('../../models/user');

module.exports = (req, res, next) => {
  isLogin({ req, User })
    .then((user) => {
      if (!user) {
        res.redirect('/');
        return;
      }
      res.render('pages/page-my-questions', {
        userName: user.userName,
        header: {
          buttons: {
            createSpeaker: !user.speakerId,
            logout: true,
          },
        },
        userNavigation: {
          buttons: {
            sessions: user.speakerId,
            requests: user.speakerId,
            questionsSelect: 'button-user-navigation__button_selected',
          }
        },
        paths: getPublicPaths(),
      });
    })
    .catch((e) => {
      next(e);
    });
}
