const SessionApp = require('../../models/sessionApp');

module.exports = (req, res, next) => {
  SessionApp.findOne({ sessionId: req.params.id })
    .populate('speaker')
    .then((session) => {
      res.json(session);
    })
    .catch((e) => {
      console.log(e);
      next(e);
    });
}
