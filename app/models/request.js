var mongoose = require('mongoose');

var requestSchema = mongoose.Schema({
    userID: {type: String, default: ""},
    message: {type: String, default: ""},
    service: {type: String, default: ""},
    customerName: {type: String, default: ""},
    contactInfo: {type: String, default: ""},
    status: {type: Number, default:1}, //1 new, 2 accepted, 3 rejected, 4 completed
    proposedTime: {type:[Date], default:[]},
    acceptedTime: {type:[Date], default:[]}

});

module.exports = mongoose.model('Request', requestSchema);