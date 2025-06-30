const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

const UserDetail = new mongoose.Schema({
    username: String,
    password: String
});
UserDetail.plugin(passportLocalMongoose);

const User = mongoose.model('UserDetail', UserDetail, 'userDetail');
module.exports = User;