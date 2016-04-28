var mongoose = require('mongoose');

var serviceSchema = mongoose.Schema({
    userID: {type: String, default: ""},
    availability: {type: String, default: ""},
    serviceName: {type: String, default: ""},
    description: {type: String, default: ""}
});

module.exports = mongoose.model('Service', serviceSchema);