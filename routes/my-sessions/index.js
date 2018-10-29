
const getPublicPaths = require('../../libs/get-public-paths');
const isLogin = require('../../libs/is-login');
const User = require('../../models/user');

module.exports = (req, res, next) => {
  let { publicPathFrontEnd, publicPathBackEnd } = getPublicPaths();

  isLogin({ req, User })
    .then((user) => {
      if (user) {
        if (user.speaker.speakerId) {
          res.render('my-sessions', {
            headerButtons: {
              login: false,
              registration: false,
              profileSetings: true,
              createSpeaker: !user.speaker.speakerId,
            },
            userNavigationButtons: {
              sessions: true,
              requests: true,
            },
            userName: user.userName,
            selectButton: {
              sessions: 'button-user-navigation__link_selected',
            },
            publicPathFrontEnd,
            publicPathBackEnd,
          });
          return;
        }

      }
      res.render('my-sessions', {
        headerButtons: {
          login: true,
          registration: false,
          profileSetings: false,
          createSpeaker: false,
        },
        userNavigationButtons: null,
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
