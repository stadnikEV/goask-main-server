const getPublicPaths = require('../../libs/get-public-paths');

module.exports = (req, res) => {
  res.render('pages/page-admin.ejs', {
    paths: getPublicPaths(),
  });
};
