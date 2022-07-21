var mongoose = require('mongoose');

var schema = new mongoose.Schema({
    call_id: {type: String,required: true},
    manual_transcript: {
        text: String,
        start_duration: String,
        end_duration: String
    },
    total_time:{type: Number,default:null},
    transcript: [
        {
            speaker: String,
            utterance: String,
            startTime: Number,
        }
    ],
});

var model = mongoose.model('ProcessedCall', schema);

module.exports = model;
