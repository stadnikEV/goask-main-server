const getPublicPaths = require('../../libs/get-public-paths');
const isLogin = require('../../libs/is-login');
const User = require('../../models/user');

module.exports = (req, res, next) => {
  isLogin({ req, User })
    .then((user) => {
      if (user) {
        res.redirect('/');
        return;
      }
      res.render('pages/page-login', {
        header: {
          buttons: {
            login: true,
            loginSelect: 'button-header__button_selected',
            createSpeaker: true,
          },
        },
        paths: getPublicPaths(),
      });
    })
    .catch((e) => {
      next(e);
    });
}
