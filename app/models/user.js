var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

var userSchema = mongoose.Schema({
	local: {
		email		: String,
		password	: String
	},
	username: {type: String, default: ""},
	businessName: {type: String, default: ""},
	intro: {type: String, default: ""},
	gender: {type: Number, default: 0},  //0 not specified, 1 male, 2 female
	services: {type:[String], default:[]},  //store service ids
	rejected: {type:[String], default:[]},  //store request ids
	completed: {type:[String], default:[]}, //store request ids
	accepted: {type:[String], default:[]},  //store request ids
	new: {type:[String], default:[]}
});

userSchema.methods.generateHash = function(password) {
	return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

userSchema.methods.validPassword = function(password) {
	return bcrypt.compareSync(password, this.local.password);
};

module.exports = mongoose.model('User', userSchema);