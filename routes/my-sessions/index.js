
const getPublicPaths = require('../../libs/get-public-paths');
const isLogin = require('../../libs/is-login');
const User = require('../../models/user');

module.exports = (req, res, next) => {
  let { publicPathFrontEnd, publicPathBackEnd } = getPublicPaths();

  isLogin({ req, User })
    .then((user) => {
      if (!user) {
        res.redirect('/');
        return;
      }
      if (!user.speakerId) {
        res.redirect('/');
        return;
      }
      res.render('my-sessions', {
        headerButtons: {
          login: false,
          registration: false,
          logout: true,
          createSpeaker: false,
        },
        userNavigationButtons: {
          sessions: true,
          requests: true,
        },
        userName: user.userName,
        speakerId: user.speakerId,
        selectButton: {
          sessions: 'button-user-navigation__link_selected',
        },
        publicPathFrontEnd,
        publicPathBackEnd,
      });
    })
    .catch((e) => {
      next(e);
    });
};
