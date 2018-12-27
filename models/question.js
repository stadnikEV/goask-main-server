const mongoose = require('../libs/mongoose'),
Schema = mongoose.Schema;

var schema = new Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId,
  },
  question: String,
  status: String,
  statusVideo: {
    status: String,
    id: String,
    link: String,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  isRecording: Boolean,
  session: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SessionApp',
  },
  speaker: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Speaker',
  },
  created: {
    type: Date,
    default: Date.now
  },
});

const Question = mongoose.model('Question', schema);

module.exports = Question;
