var mongoose = require('mongoose');

var schema = new mongoose.Schema({
    file_name: {type: String, required: true},
    account_id: {type: String, required: true},
    language: {type: String, required: true},
    manual_transcript: {type: String, required: true},
    start_duration: {type: String, required: true},
    end_duration: {type: String, required: true},
});

var model = mongoose.model('ManualTranscript', schema);

module.exports = model;

