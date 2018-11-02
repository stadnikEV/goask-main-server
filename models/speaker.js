const mongoose = require('../libs/mongoose'),
Schema = mongoose.Schema;

var schema = new Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId,
  },
  speakerId: {
    type: Number,
    required: true,
    unique: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  about: String,
  firstname: String,
  lastname: String,
  categories: [
    {
      categoryName : String,
    },
  ],
  sessions: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'SessionApp',
    },
  ],
  created: {
    type: Date,
    default: Date.now
  },
});

const Speaker = mongoose.model('Speaker', schema);

module.exports = Speaker;
