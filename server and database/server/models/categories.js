const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CategoriesSchema = new Schema({
    category: {
        type: String,
        required: true
    },
    image: {
        type: Schema.Types.ObjectId,
        ref: 'image',
        required: true
    }
}, { timestamps: true });


var Categories = mongoose.model('Category', CategoriesSchema);

module.exports = Categories; 