const crypto = require('crypto');

const mongoose = require('../libs/mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId,
  },
  role: {
    type: String,
    unique: true,
    required: true
  },
  login: {
    type: String,
    unique: true,
    required: true
  },
  hashedPassword: {
    type: String,
    required: true
  },
  salt: {
    type: String,
    required: true
  },
  created: {
    type: Date,
    default: Date.now
  },
});

schema.methods.encryptPassword = function(password) {
  return crypto.createHmac('sha1', this.salt).update(password).digest('hex');
};

schema.virtual('password')
  .set(function(password) {
    this._plainPassword = password;
    this.salt = Math.random() + '';
    this.hashedPassword = this.encryptPassword(password);
  })
  .get(function() { return this._plainPassword; });

schema.methods.checkPassword = function(password) {
  return this.encryptPassword(password) === this.hashedPassword;
};

const Admin = mongoose.model('Admin', schema);

module.exports = Admin;
