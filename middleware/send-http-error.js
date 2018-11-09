module.exports = function(req, res, next) {

  res.sendHttpError = (error) => {

    res.status(error.status);
    if (req.headers['content-type'] === 'application/json') {
      res.json(error);
    } else {
      res.render("error", { error });
    }
  };

  next();
};
