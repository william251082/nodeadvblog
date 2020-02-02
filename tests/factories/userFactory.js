const mongoose = require('mongoose');
const User = mongoose.model('User');


module.exports = () => {
    // returns a Promise
    return new User({}).save();
};