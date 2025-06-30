const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
  username: {
    type: String,
    trim: true,
  },
  game: {
    type: String,
    trim: true,
  },
  date: {
    type: String,
    trim: true,
  },
  players: {
    type: String,
    trim: false,
  },
  userScore: {
    type: String,
    trim: false,
  }
});

const Session = mongoose.model('Session', sessionSchema);
module.exports = Session;