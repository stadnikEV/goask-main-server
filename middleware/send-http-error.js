module.exports = function(req, res, next) {

  res.sendHttpError = (error) => {

    res.status(error.status);
    if (req.headers['content-type'] === 'application/json') {
      console.log(error);
      res.json(error);
    } else {
      res.render("error", { error });
    }
  };

  next();
};
