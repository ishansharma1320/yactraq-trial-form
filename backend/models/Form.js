var mongoose = require('mongoose');

var schema = new mongoose.Schema({
    name: {type: String,required: true},
    email: {type: String,required: true},
    language: {type: String,required: true},
    plans: {type: [String],required: true},
    flag: {type: Boolean,default: false},

});

var model = mongoose.model('Form', schema);

module.exports = model;
