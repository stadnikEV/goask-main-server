const isLogin = require('../../libs/is-login');
const User = require('../../models/user');
const getPublicPaths = require('../../libs/get-public-paths');
const categoriesNameconfig  = require('../../libs/categories-name-config.js');

module.exports = (req, res, next) => {
  res.locals.session.categoryName = categoriesNameconfig[res.locals.session.category];

  isLogin({ req, User })
    .then((user) => {
      if (user) {
        res.render('pages/page-public-session-details', {
          userName: user.userName,
          header: {
            buttons: {
              createSpeaker: !user.speakerId,
              logout: true,
            },
          },
          userNavigation: {
            buttons: {
              sessions: user.speakerId,
              requests: user.speakerId,
            }
          },
          session: res.locals.session,
          paths: getPublicPaths(),
        });

        return;
      }


      res.render('pages/page-public-session-details', {
        header: {
          buttons: {
            login: true,
            createSpeaker: true,
          },
        },
        session: res.locals.session,
        paths: getPublicPaths(),
      });
    })
    .catch((e) => {
      next(e);
    });
};
