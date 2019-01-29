const getPublicPaths = require('../../libs/get-public-paths');
const isLogin = require('../../libs/is-login');
const User = require('../../models/user');

module.exports = (req, res, next) => {
  isLogin({ req, User })
    .then((user) => {
      if (!user || !user.speakerId || !user.speakerActive) {
        res.redirect('/login');
        return;
      }

      res.render('pages/page-my-requests', {
        userName: user.userName,
        speakerId: user.speakerId,
        header: {
          buttons: {
            logout: true,
          },
        },
        userNavigation: {
          buttons: {
            sessions: true,
            requests: true,
            requestsSelect: 'button-user-navigation__button_selected',
          }
        },
        paths: getPublicPaths(),
      });
    })
    .catch((e) => {
      next(e);
    });
};
