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
      sessionId: Number,
      sessionName: String,
      categoryName: String,
      sessionDescribe: String,
    },
  ],

});

const Speaker = mongoose.model('Speaker', schema);

module.exports = Speaker;
