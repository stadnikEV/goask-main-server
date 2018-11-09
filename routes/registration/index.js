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
      res.render('pages/page-registration', {
        header: {
          buttons: {
            registration: true,
            registrationSelect: 'button-header__link_selected'
          }
        },
        paths: getPublicPaths(),
      });
    })
    .catch((e) => {
      next(e);
    });
}
