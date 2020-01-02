var mongoose = require('mongoose');
var contentsSchma = require('../schemas/contents');

module.exports = mongoose.model('Content', contentsSchma);