
const getPublicPaths = require('../../libs/get-public-paths');
const isLogin = require('../../libs/is-login');
const User = require('../../models/user');

module.exports = (req, res, next) => {
  let { publicPathFrontEnd, publicPathBackEnd } = getPublicPaths();

  isLogin({ req, User })
    .then((user) => {
      if (user) {
        let userNavigationButtons = {};

        if (user.speaker.speakerId) {
          userNavigationButtons = {
            sessions: true,
            requests: true,
          }
        }
        res.render('main', {
          headerButtons: {
            login: false,
            registration: false,
            profileSetings: true,
            createSpeaker: !user.speaker.speakerId,
          },
          userNavigationButtons,
          userName: user.userName,
          selectButton: {},
          publicPathFrontEnd,
          publicPathBackEnd,
        });
        return;
      }
      res.render('main', {
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
