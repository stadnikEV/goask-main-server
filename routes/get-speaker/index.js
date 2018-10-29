// const isJson = require('../../libs/is-json');
// const HttpError = require('../../error');
// const getPublicPaths = require('../../libs/get-public-paths');
// const isLogin = require('../../libs/is-login');
// const User = require('../../models/user');
const Speaker = require('../../models/speaker');



module.exports = (req) => {
  console.log(req.params.id);
  Speaker.findOne({ speakerId: req.params.id })
    .populate('user')
    .then((speaker) => {
      console.log(speaker.user.speaker.category[0].categoryName);
    });
}
