const getPublicPaths = require('../../libs/get-public-paths');
const isLogin = require('../../libs/is-login');
const User = require('../../models/user');

module.exports = (req, res, next) => {
  let { publicPathFrontEnd, publicPathBackEnd } = getPublicPaths();

  isLogin({ req, User })
    .then((user) => {
      if (user) {
        res.render('main', {
          headerButtons: {
            profile: true,
            createSpeaker: user.speaker.speakerId,
          },
          userName: user.userName,
          selectButton: {},
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
