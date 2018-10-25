const getPublicPaths = require('../../libs/get-public-paths');
const isLogin = require('../../libs/is-login');

module.exports = (req, res, next) => {
  let { publicPathFrontEnd, publicPathBackEnd } = getPublicPaths();

  isLogin(req)
    .then((user) => {
      if (user) {
        res.render('index', {
          headerButtons: {
            profile: true,
            createSpeaker: true,
          },
          selectButton: {},
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
