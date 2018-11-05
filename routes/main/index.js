
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
            login: false,
            registration: false,
            logout: true,
            createSpeaker: !user.speakerId,
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
          logout: false,
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
