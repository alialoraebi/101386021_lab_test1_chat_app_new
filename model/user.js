const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstname: {
        type: String,
        required: [true, 'Name is required'],
        trim: true,
        required: true,
        minlength: 3
    },
    lastname: {
        type: String,
        required: [true, 'Name is required'],
        trim: true,
        required: true,
        minlength: 2
    },
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 3
    },
    email: {
        type: String,
        unique: true,
        required: [true,'Email is required'],   
        trim: true,
        validate: {
            validator: function (v) {
                return /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(v);
            },
            message: props => `${props.value} is not a valid email address!`
        
        }
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        trim: true,
        minlength: 8

    },
    created: {
        type: Date,
        default: Date.now,
    }
});

const UserModel = mongoose.model("users", userSchema);
module.exports = UserModel;
