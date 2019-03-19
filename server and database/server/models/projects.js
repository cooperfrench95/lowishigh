const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const projectDataSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    time: {
        type: String,
        required: true
    },
    description: [{
        type: String
    }],
    youtube_link: {
        type: String,
        required: true
    }
    }, { timestamps: true }
);

const projectSchema = new Schema({
    data: projectDataSchema
    }, { timestamps: true }
);


var Projects = mongoose.model('project', projectSchema);

module.exports = Projects; 