const crypto = require('crypto');

const mongoose = require('../libs/mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId,
  },
  active: Boolean,
  userName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    unique: true,
    required: true
  },
  emailConfirm: {
    type: String,
    required: true
  },
  hashedPassword: {
    type: String,
    required: true
  },
  saltPassword: {
    type: String,
    required: true
  },
  saltEmailConfirm: {
    type: String,
    required: true
  },
  questions: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Question',
    }
  ],
  created: {
    type: Date,
    default: Date.now
  },
  speakerId: Number,
});

schema.methods.encryptPassword = function(password) {
  return crypto.createHmac('sha1', this.saltPassword).update(password).digest('hex');
};

schema.methods.encryptEmailConfirm = function(_emailConfirm) {
  return crypto.createHmac('sha1', this.saltEmailConfirm).update(_emailConfirm).digest('hex');
};

schema.virtual('password')
  .set(function(password) {
    this._plainPassword = password;
    this.saltPassword = Math.random() + '';
    this.hashedPassword = this.encryptPassword(password);
  })
  .get(function() { return this._plainPassword; });

schema.virtual('_emailConfirm')
  .set(function(_emailConfirm) {
    this.saltEmailConfirm = Math.random() + '';
    this.emailConfirm = this.encryptPassword(_emailConfirm);
  })


schema.methods.checkPassword = function(password) {
  return this.encryptPassword(password) === this.hashedPassword;
};

const User = mongoose.model('User', schema);

module.exports = User;
