var mongoose = require('mongoose');

var requestSchema = mongoose.Schema({
	creatorID: {type: String, default: ""},
    userID: {type: String, default: ""},
    message: {type: String, default: ""},
    service: {type: String, default: ""},
    customerName: {type: String, default: ""},
    contactInfo: {type: String, default: ""},
    status: {type: Number, default:0}, //0 new, 1 accepted, 2 rejected, 3 completed
    proposedTime: {type:[Date], default:[]},
    acceptedTime: {type:[Boolean], default:[]},
    createdTime: {type:Date, default:Date.now()}
});

module.exports = mongoose.model('Request', requestSchema);
