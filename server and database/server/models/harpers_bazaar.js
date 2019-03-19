const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const imgSchema = new Schema({
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

const harpersbazaarSchema = new Schema({
    img: imgSchema,
    date: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    link: {
        type: String,
        required: true
    }
    }, { timestamps: true }
);


var Articles = mongoose.model('article', harpersbazaarSchema);

module.exports = Articles; 