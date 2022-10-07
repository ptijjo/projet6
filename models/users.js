const mongoose = require('mongoose');
const uniquevalidator = require('mongoose-unique-validator');
const mongodbError = require('mongoose-mongodb-errors');

const userSchema = mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});



userSchema.plugin(uniquevalidator);
userSchema.plugin(mongodbError);

module.exports = mongoose.model('user', userSchema);