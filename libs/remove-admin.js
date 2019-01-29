const Admin = require('../models/admin');

Admin.findOne({ role: 'admin' })
  .then((admin) => {
    if (admin) {
      return Admin.remove({ _id: admin._id });
    }
  })
  .then(() => {
    console.log('Admin removed');
  })
  .catch((err) => {
    console.log(err);
  });
