const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const imageSchema = new Schema({
    src: {
        type: String,
        required: true
    },
    alt: {
        type: String,
        required: true
    }
    }, { timestamps: true }
);


var Images = mongoose.model('image', imageSchema);

module.exports = Images; 