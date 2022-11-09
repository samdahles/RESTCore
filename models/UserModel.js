const mongoose = require('mongoose');
const validator = require('validator');
const uniqueValidator = require('mongoose-unique-validator');

const userSchema = new mongoose.Schema({
    firstName : {
        type: String,
        required: [true, 'Please provide a first name.'],
        trim: true
    },
    lastName : {
        type: String,
        required: [true, 'Please provide a last name.'],
        trim: true
    },
    email : {
        type: String,
        unique: true,
        required: [true, 'Please provide an email address.'],
        lowercase: true,
        trim: true,
        validate: {
            validator: validator.isEmail,
            message: 'Please enter a valid email address.',
            isAsync: false
        }
    },
    password : {
        type: String,
        required: [true, 'Please provide a password.'],
        select: false
    },
    __v: {
        type: Number,
        select: false
    }
}, {
    timestamps: true
});

userSchema.plugin(uniqueValidator, { message: '\'{VALUE}\' is already taken.' });



module.exports = {
    User: mongoose.model('User', userSchema)
}