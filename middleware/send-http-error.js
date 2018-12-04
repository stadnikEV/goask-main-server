module.exports = function(req, res, next) {

  res.sendHttpError = (error) => {

    res.status(error.status);
    const contentType = req.headers['content-type'];
    if (contentType === 'application/json' || contentType === 'video/webm') {
      console.log(error);
      res.json(error);
    } else {
      res.render("error", { error });
    }
  };

  next();
};
