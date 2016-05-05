var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');

var transporter = nodemailer.createTransport({
	service: 'gmail',
	auth : {
		user: 'lineupnowserving@gmail.com',
		pass: 'nowserving'
	}	
});

function sendMail(obj) {
	transporter.sendMail(obj, function (err, response) {
		if(err) {
			console.log(err)
		} else {;
			console.log('email sent!')
		}
	});
}

exports.sendMail = sendMail;