const getPublicPaths = require('../../libs/get-public-paths');
const isLogin = require('../../libs/is-login');
const User = require('../../models/user');

module.exports = (req, res, next) => {
  let { publicPathFrontEnd, publicPathBackEnd } = getPublicPaths();

  isLogin({ req, User })
    .then((user) => {
      if (!user) {
        res.render('main', {
          headerButtons: {
            login: true,
          },
          selectButton: {},
          publicPathFrontEnd,
          publicPathBackEnd,
        });
        return;
      }
      if (user.speaker.speakerId) {
        res.render('main', {
          headerButtons: {
            profileSetings: true,
          },
          selectButton: {},
          publicPathFrontEnd,
          publicPathBackEnd,
        });
        return;
      }
      res.render('registration-speaker', {
        headerButtons: {
          profileSetings: true,
          createSpeaker: true,
        },
        selectButton: {
          createSpeaker: 'button-header__link_selected',
        },
        publicPathFrontEnd,
        publicPathBackEnd,
      });
    })
    .catch((e) => {
      next(e);
    });
}
