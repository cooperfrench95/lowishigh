const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const GallerySchema = new Schema({
    image: {
        type: Schema.Types.ObjectId,
        ref: 'image',
        required: true,
        unique: true
    }
}, { timestamps: true });


var Gallery = mongoose.model('gallery', GallerySchema);

module.exports = Gallery; 