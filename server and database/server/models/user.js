var mongoose = require('mongoose');
var Schema = mongoose.Schema;

const inboxSchema = new Schema({
    author: {
        type: String,
        required: true
    },
    date: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    post: {
        type: String,
        required: true
    },
    read: {
        type: Boolean,
        required: true
    }
}, { timestamps: true });

var Users = new Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    recovery_email: {
        type: String,
        required: true,
        unique: true
    },
    admin:   {
        type: Boolean,
        default: false
    },
    inbox: [inboxSchema]
}, { timestamps: true });


module.exports = mongoose.model('User', Users);