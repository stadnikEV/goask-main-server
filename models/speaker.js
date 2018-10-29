const mongoose = require('../libs/mongoose'),
Schema = mongoose.Schema;

var schema = new Schema({
  speakerId: {
    type: String,
    required: true,
    unique: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
});

const Speaker = mongoose.model('Speaker', schema);

module.exports = Speaker;
