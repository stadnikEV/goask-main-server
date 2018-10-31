const getPublicPaths = require('../../libs/get-public-paths');
const isLogin = require('../../libs/is-login');
const User = require('../../models/user');

module.exports = (req, res, next) => {
  let { publicPathFrontEnd, publicPathBackEnd } = getPublicPaths();

  isLogin({ req, User })
    .then((user) => {
      if (user) {
        let userNavigationButtons = {};

        if (user.speakerId) {
          userNavigationButtons = {
            sessions: true,
            requests: true,
          }
        }
        res.render('main', {
          headerButtons: {
            profileSetings: true,
            createSpeaker: true,
          },
          selectButton: {},
          userName: user.userName,
          userNavigationButtons,
          publicPathFrontEnd,
          publicPathBackEnd,
        });
        return;
      }
      res.render('login-registration', {
        page: 'registration',
        headerButtons: {
          registration: true,
        },
        selectButton: {
          registration: 'button-header__link_selected',
        },
        publicPathFrontEnd,
        publicPathBackEnd,
      });
    })
    .catch((e) => {
      next(e);
    });
}
