var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var currentKeySchema = new Schema({
    current_reset_key: {
        type: String,
        required: true
    },
    user: {
        type: Schema.Types.ObjectId,
        required: true,
        unique: true
    },
    createdAt: { type: Date, expires: '5m', default: Date.now }
});

module.exports = mongoose.model('Key', currentKeySchema);