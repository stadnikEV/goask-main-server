const isMultipartFormData = require('../libs/is-multipart-form-data');
module.exports = function(req, res, next) {

  res.sendHttpError = (error) => {

    res.header('Connection', 'close');
    res.status(error.status);

    const contentType = req.headers['content-type'];

    if (contentType === 'application/json'
    || contentType === 'video/webm'
    || isMultipartFormData({ contentType })) {

      res.json(error);

      return;
    }

    res.render("error", { error });
  };

  next();
};
