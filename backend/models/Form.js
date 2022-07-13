var mongoose = require('mongoose');

var schema = new mongoose.Schema({
    username: {type: String,required: true},
    account_id: {type: String,required: true},
    language: {type: String,required: true},
    plans: {type: [String],required: true},
    files: {type: [String],required: true},
});

var model = mongoose.model('Form', schema);

module.exports = model;
