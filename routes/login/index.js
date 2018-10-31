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
            createSpeaker: !user.speakerId,
          },
          userName: user.userName,
          selectButton: {},
          userNavigationButtons,
          publicPathFrontEnd,
          publicPathBackEnd,
        });
        return;
      }
      res.render('login-registration', {
        page: 'login',
        headerButtons: {
          login: true,
        },
        selectButton: {
          login: 'button-header__link_selected',
        },
        publicPathFrontEnd,
        publicPathBackEnd,
      });
    })
    .catch((e) => {
      next(e);
    });
}
