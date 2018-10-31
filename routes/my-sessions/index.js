
const getPublicPaths = require('../../libs/get-public-paths');
const isLogin = require('../../libs/is-login');
const User = require('../../models/user');

module.exports = (req, res, next) => {
  let { publicPathFrontEnd, publicPathBackEnd } = getPublicPaths();

  isLogin({ req, User })
    .then((user) => {
      if (user) {
        if (user.speakerId) {
          res.render('my-sessions', {
            headerButtons: {
              login: false,
              registration: false,
              profileSetings: true,
              createSpeaker: !user.speakerId,
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
          return;
        }

      }
      const userNavigationButtons = (user)
        ? {}
        : false;

      const headerButtons = (user)
        ? {
            profileSetings: true,
            createSpeaker: true,
          }
        : {
            login: true,
        };

      res.render('main', {
        headerButtons,
        userNavigationButtons,
        userName: false,
        selectButton: {},
        publicPathFrontEnd,
        publicPathBackEnd,
      });
    })
    .catch((e) => {
      next(e);
    });
};
