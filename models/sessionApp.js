const mongoose = require('../libs/mongoose'),
Schema = mongoose.Schema;

var schema = new Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId,
  },
  sessionId: {
    type: Number,
    required: true,
    unique: true,
  },
  theme: String,
  describeSession: String,
  category: String,
  speaker: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Speaker',
  },
  questions: [
    {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Question',
    },
  ],
  created: {
    type: Date,
    default: Date.now
  },
});

const SessionApp = mongoose.model('SessionApp', schema);

module.exports = SessionApp;
