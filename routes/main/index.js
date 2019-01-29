const getPublicPaths = require('../../libs/get-public-paths');
const isLogin = require('../../libs/is-login');
const User = require('../../models/user');

module.exports = (req, res, next) => {
  isLogin({ req, User })
    .then((user) => {
      if (user) {
        res.render('pages/page-main.ejs', {
          header: {
            buttons: {
              logout: true,
              createSpeaker: !user.speakerId,
            },
          },
          userNavigation: {
            buttons: {
              sessions: user.speakerActive && user.speakerId,
              requests: user.speakerActive && user.speakerId,
            }
          },
          userName: user.userName,
          paths: getPublicPaths(),
        });
        return;
      }

      res.render('pages/page-main', {
        header: {
          buttons: {
            login: true,
          }
        },
        paths: getPublicPaths(),
      });
    })
    .catch((e) => {
      next(e);
    });
};
