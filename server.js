var express = require('express'),
	app = express(),
<<<<<<< HEAD
	port = process.env.PORT || 8080,
=======
	port = process.env.PORT || 4000,
>>>>>>> 58877f5fe090deefc7c81458943a78052c8521e7
	mongoose = require('mongoose'),
	passport = require('passport'),
	morgan = require('morgan'),
	cookieParser = require('cookie-parser'),
	bodyParser = require('body-parser'),
	session = require('express-session'),
	configDB = require('./config/database.js');

mongoose.connect(configDB.url); // db connection
require('./config/passport')(passport);

app.use(morgan('dev'));
app.use(cookieParser());
app.use(bodyParser());

app.use(session({ secret: 'passport demo' }));
app.use(express.static(__dirname + '/frontend/public'));


app.use(passport.initialize());
app.use(passport.session());

require('./app/routes.js')(app, passport);
app.listen(port);
console.log('Server running on port ' + port);