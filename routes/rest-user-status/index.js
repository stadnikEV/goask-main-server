const isJson = require('../../libs/is-json');
const isLogin = require('../../libs/is-login');
const User = require('../../models/user');


module.exports = (req, res, next) => {
  const dataStatus = isJson(req);

  if (!dataStatus.status) {
    next(dataStatus.httpError);
    return;
  }

  isLogin({ req, User })
    .then((user) => {
      if (!user) {
        res.json({
          login: false,
        });
        return;
      }
      if (user.speaker.speakerId) {
        res.json({
          login: true,
          speaker: true,
        });
        return;
      }
      res.json({
        login: true,
        speaker: false,
      });
    })
    .catch((e) => {
      next(e);
    });
}
