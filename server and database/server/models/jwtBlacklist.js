var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var jwtBlackListSchema = new Schema({
    jwt_value: {
        type: String,
        unique: true
    },
    user: {
        type: Schema.Types.ObjectId,
        required: true
    },
    createdAt: { type: Date, expires: '2881m', default: Date.now }
});

module.exports = mongoose.model('Blacklist', jwtBlackListSchema);