const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const contentSchema = new Schema({
    type: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: false
    },
    image: {
        type: String,
        required: false // the image uploading will be handled seperately, this will just be a selection from the existing images in the database
    }}, { timestamps: true }
);

const commentSchema = new Schema({
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
    }
    }, { timestamps: true }
);

const dataSchema = new Schema({
        title_photo: {
            type: String,
            required: false
        },
        date: {
            type: String,
            required: true
        },
        author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User', // from documentation: The ref option is what tells Mongoose which model to use during population, in our case the User model.
            required: true
        },
        title: {
            type: String,
            required: true,
            unique: true
        },
        categories: [{ type: String, required: true }],
        tags: [{ type: String }],
        content: [contentSchema],
        comments: [commentSchema],
        subscribers: [{ type: String }]
    }, { timestamps: true }
);

const blogpostSchema = new Schema({
        name: {
            type: String,
            required: true,
            unique: true
        },
        data: dataSchema 
    },
    { timestamps: true }
);




var Blogposts = mongoose.model('blogpost', blogpostSchema);

module.exports = Blogposts; 