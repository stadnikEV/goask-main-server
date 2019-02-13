const getPublicPaths = require('../../libs/get-public-paths');
const isLogin = require('../../libs/is-login');
const User = require('../../models/user');

module.exports = (req, res, next) => {
  isLogin({ req, User })
    .then((user) => {
      // if (!user) {
      //   res.redirect('/');
      //   return;
      // }
      if (user.speakerId) {
        res.redirect('/');
        return;
      }
      res.render('pages/page-create-speaker', {
        isLogin: !!user,
        header: {
          buttons: {
            logout: !!user,
            login: !user,
            createSpeaker: true,
            createSpeakerSelect: 'button-header__button_selected',
          },
        },
        paths: getPublicPaths(),
      });
    })
    .catch((e) => {
      next(e);
    });
}
