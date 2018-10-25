const getPublicPaths = require('../../libs/get-public-paths');
const isLogin = require('../../libs/is-login');

module.exports = (req, res, next) => {
  let { publicPathFrontEnd, publicPathBackEnd } = getPublicPaths();

  isLogin(req)
    .then((user) => {
      if (!user) {
        res.render('index', {
          headerButtons: {
            login: true,
          },
          selectButton: {},
          publicPathFrontEnd,
          publicPathBackEnd,
        });
        return;
      }
      res.render('create-speaker', {
        headerButtons: {
          profileSetings: true,
          createSpeaker: true,
        },
        selectButton: {
          createSpeaker: 'button-header__link_selected',
        },
        userName: user.userName,
        publicPathFrontEnd,
        publicPathBackEnd,
      });
    })
    .catch((e) => {
      next(e);
    });
}
