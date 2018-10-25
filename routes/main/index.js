module.exports = (reg, res) => {
  const getPublicPaths = require('../../libs/get-public-paths');
  const isLogin = require('../../libs/is-login');

  module.exports = (req, res, next) => {
    let { publicPathFrontEnd, publicPathBackEnd } = getPublicPaths();

    isLogin(req)
      .then((isLogin) => {
        if (isLogin) {
          res.render('index', {
            headerButtons: {
              login: false,
              registration: false,
              profile: true,
              createSpeaker: true,
            },
            publicPathFrontEnd,
            publicPathBackEnd,
          });
          return;
        }
        res.render('index', {
          page: 'login',
          headerButtons: {
            login: true,
            registration: false,
            profile: false,
            createSpeaker: false,
          },
          publicPathFrontEnd,
          publicPathBackEnd,
        });
      })
      .catch((e) => {
        next(e);
      });
  }
  res.render('index');
}
