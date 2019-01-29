const Admin = require('../models/admin');
const mongoose = require('../libs/mongoose');
var readline = require('readline');

module.exports = () => {
  const promise = new Promise((resolve, reject) => {
    let login = null;
    let password = null;

    Admin.findOne({ role: 'admin' })
      .then((admin) => {
        if (admin) {
          resolve();
          return;
        }

        var rl = readline.createInterface({
          input: process.stdin,
          output: process.stdout
        });

        return new Promise((resolve) => {
          rl.question('Enter the login of admin: ', function(text) {
            login = text;
            resolve(rl);
          });
        });
      })
      .then((rl) => {
        return new Promise((resolve) => {
          rl.question('Enter the password for admin: ', function(text) {
            password = text;
            rl.close();
            resolve();
          });
        });
      })
      .then(() => {
        return new Admin({
          _id: new mongoose.Types.ObjectId(),
          login,
          role: 'admin',
          password,
        })
          .save();
      })
      .then(() => {
        resolve();
      })
      .catch((err) => {
        reject(err);
      });
  });

  return promise;
}
