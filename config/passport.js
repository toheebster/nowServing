var LocalStrategy = require('passport-local').Strategy;
var User = require('../app/models/user');

module.exports = function(passport) {
	passport.serializeUser(function(user, done) {
		done(null, user.id);
	});

	passport.deserializeUser(function(id, done) {
		User.findById(id, function(err, user) {
			done(err, user);
		});
	});

	passport.use('local-signup', new LocalStrategy({
			usernameField : 'email',
			passwordField : 'password',
			passReqToCallback: true
		},
		function(req, email, password, done) {
			User.findOne({'local.email' : email}, function(err, user) {
				if(err)
					return done(err);
				if(user) {
					return done(null, false,{message: 'User already exists.'});
				} else {
					var newUser = new User();

					newUser.local.email = email;
					newUser.local.password = newUser.generateHash(password);
					newUser.username = req.body.username;
<<<<<<< HEAD
<<<<<<< HEAD
					newUser.businessName =  req.body.businessName;
=======
					newUser.businessName = req.body.businessName;
>>>>>>> b8cdcca41d632a714576da35facb015659a2a508
=======
					newUser.businessName =  req.body.businessName;
>>>>>>> 05b664c33714846d9f982a524e4c71094722bb36
					newUser.save(function(err) {
						if(err)
							throw err;
						return done(null, newUser);
					});
				}

			});
		})
	);

	passport.use('local-login', new LocalStrategy({
			usernameField: 'email',
			passwordField: 'password',
		},
		function(email, password, done) {
			User.findOne({'local.email': email}, function(err, user) {
				if(err)
					return done(err);
				if(!user)
					return done(null, false,{message:"user not existed"});
				if(!user.validPassword(password))
					return done(null, false,{message:"password incorrect"});
				return done(null, user);

			});
		})
	);

	//passport.use('local-signup', new LocalStrategy({
	//	usernameField : 'email',
	//	passwordField : 'password',
	//	passReqToCallback: true
	//},
	//function(req, email, password, done) {
	//	User.findOne({'local.email' : email}, function(err, user) {
	//		if(err)
	//			return done(err);
	//		if(user) {
	//			return done(null, false);
	//		} else {
	//			var newUser = new User();
<<<<<<< HEAD
    //
=======
	//
>>>>>>> 05b664c33714846d9f982a524e4c71094722bb36
	//			newUser.local.email = email;
	//			newUser.local.password = newUser.generateHash(password);
	//			newUser.username = req.username;
	//			newUser.save(function(err) {
	//				if(err)
	//					throw err;
	//				return done(null, newUser);
	//			});
	//		}
<<<<<<< HEAD
    //
	//	});
	//}));

=======
	//
	//	});
	//}));
    //
>>>>>>> 05b664c33714846d9f982a524e4c71094722bb36
	//passport.use('local-login', new LocalStrategy({
	//	usernameField: 'email',
	//	passwordField: 'password',
	//},
	//function(email, password, done) {
	//	User.findOne({'local.email': email}, function(err, user) {
	//		if(err)
	//			return done(err);
	//		if(!user)
	//			return done(null, false);
	//		if(!user.validPassword(password))
	//			return done(null, false);
	//		return done(null, user);
    //
	//	});
	//}));

};