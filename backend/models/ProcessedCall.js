var mongoose = require('mongoose');

var schema = new mongoose.Schema({
    call_id: {type: String,required: true},
    file_name: {type: String, required: true},
    account_id: {type: String, required: true},
    language: {type: String, required: true},
    plan: {type: String, required: true},
    total_time:{type: Number,default:null},
    transcript: [
        {
            speaker: String,
            utterance: String,
            startTime: Number,
        }
    ],
    wer_results: {
        total_words: Number,
        word_error_rate: Number,
        start_duration: String,
        end_duration: String,
        substitution: {
            count: Number,
            error_phrases: [{type: String}]
        },
        deletion: {
            count: Number,
            error_phrases: [{type: String}]
        },
        addition: {
            count: Number,
            error_phrases: [{type: String}]
        }
    }
});

var model = mongoose.model('ProcessedCall', schema);

module.exports = model;
