const mongoose = require('mongoose');

const registrationSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
  },
  email: {
    type: String,
    trim: true,
  },
  username: {
    type: String,
    trim: false,
  },
  password: {
    type: String,
    trim: false,
  },
});

const Registration = mongoose.model('Registration', registrationSchema);
module.exports = Registration;