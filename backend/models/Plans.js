var mongoose = require('mongoose');

var schema = new mongoose.Schema({
    value: {type: String,required: true},
    viewValue: {type: String,required: true},
});

var model = mongoose.model('Plans', schema);

module.exports = model;
