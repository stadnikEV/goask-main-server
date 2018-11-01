// const Speaker = require('../../models/speaker');
const SessionApp = require('../../models/sessionApp');


module.exports = (req, res, next) => {
  SessionApp.findOne({ sessionId: req.params.id })
    .populate('speaker')
    .then((speaker) => {
      console.log(speaker);
      // res.json(speaker.sessions[0].session.theme);
    })
    .catch((e) => {
      console.log(e);
      next(e);
    });
}
