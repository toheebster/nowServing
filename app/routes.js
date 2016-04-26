var User = require('./models/user');
var Service = require('./models/service');
var Request = require('./models/request')

module.exports = function(app, passport) {

	app.post('/signup', passport.authenticate('local-signup'), function(req, res) {
		res.redirect('/profile.html');
	});

	app.post('/login', passport.authenticate('local-login'), function(req, res) {
		res.redirect('/profile.html');
	});

	app.get('/profile', isLoggedIn, function(req, res) {
		res.json({
			user: req.user
		});
	});

	app.get('/logout', function(req, res) {
		req.logout();
		res.redirect('/');
	});

	function isLoggedIn(req, res, next) {
		if (req.isAuthenticated())
			return next();

		res.json({
			error: "User not logged in"
		});
		res.redirect('/login.html');
	}



	//get all request
	app.get('/getAllReq', function(req,res){
		Request.find(function(err,ret){
			if (err) {
				res.status(500).json({message: 'Error happened!', data: err});
			}
			else if (ret == "" || ret == null || ret == undefined) {
				res.status(404).json({message: 'No data found!!'});
			}
			else {
				res.status(200).json({message: 'Data fetched!!', data: ret});
			}
		})
	})
	//delete all request, should be commented out in production code
	app.delete('/deleteAllReq', function(req,res){
		Request.remove({}, function(err){
			if (err) {
				res.status(500).json({message: 'Error happened!', data: err});
			}
			else {
				res.status(200).json({message: 'All request removed!!'});
			}
		})
	})


	//get request with query
	app.get('/portfolio/:user_id/queue/', function(req, res) {
		var where = null;
		var sort = null;
		var select = null;
		var skip = null;
		var limit = null;
		var count = null;
		if (req.query.where != null && req.query.where != "" && req.query.where != undefined) {
			where = JSON.parse(req.query.where.replace(/'/g,'"'));
		}
		if (req.query.sort != null && req.query.sort != "" && req.query.sort != undefined) {
			sort = JSON.parse(req.query.sort);
		}
		if (req.query.select != null && req.query.select != "" && req.query.select != undefined) {
			select = JSON.parse(req.query.select);
		}
		if (req.query.skip != null && req.query.skip != "" && req.query.skip != undefined) {
			skip = req.query.skip;
		}
		if (req.query.limit != null && req.query.limit != "" && req.query.limit != undefined) {
			limit = req.query.limit;
		}
		if (req.query.count != null && req.query.count != "" && req.query.count != undefined) {
			count = req.query.count;
		}
		if (count) {
			Request.find(where).sort(sort).select(select).skip(skip).limit(limit).count().exec(function (err, cnt) {
				if (err) {
					res.status(500).json({message: 'Error happened!', data: err});
				}
				else {
					res.status(200).json({message: 'Number of requests', data: cnt});
				}
			});
		}
		else {
			Request.find(where).sort(sort).select(select).skip(skip).limit(limit).exec(function (err, ret) {
				if (err) {
					res.status(500).json({message: 'Error happened!', data: err});
				}
				else if (ret == "" || ret == null || ret == undefined) {
					res.status(404).json({message: 'No data found!!'});
				}
				else {
					res.status(200).json({message: 'Data fetched!!', data: ret});
				}
			});
		}
	});


	//get request by id
	app.get('/request/:req_id', function(req, res) {
		Request.findById(req.params.req_id, function(err, ret) {
			if (err) {
				res.status(500).json({message: 'Error happened!', data: err});
			}
			else if (ret == "" || ret == null || ret == undefined) {
				res.status(404).json({message: 'No data found!'});
			}
			else {
				res.status(200).json({message: 'Data found!', data: ret});
			}
		});
	});

	//add new request by customers
	app.post('/portfolio/:user_id', function(req,res){
		var request = new Request();
		for (var key in req.body) {
			if (req.body.hasOwnProperty(key)) {
				if (req.body[key] != null && req.body[key] != undefined && request[key] != undefined) {
					request[key] = req.body[key];
				}
			}
		}
		request.save(function (err) {
			if (err) {
				res.status(500).json({message: 'Error happened!', data: err});
			}
			else {
				res.status(201).json({message: 'Request created!', data: request});
			}
		});
	});

	//edit request
	app.put('/portfolio/:user_id/queue/:req_id', function(req, res){
		//Request.findById(req.params.req_id, function (err, ret) {
		Request.findById(req.body.rid, function (err, ret) {  //this line is for test
			if (err) {
				res.status(500).json({message: 'Error happened!', data: err});
			}
			else if (ret == "" || ret == null || ret == undefined) {
				res.status(404).json({message: 'Invalid request'});
			}
			else {
				for (var key in req.body) {
					if (req.body.hasOwnProperty(key)) {
						if (req.body[key] != null && req.body[key] != undefined && ret[key] != undefined) {
							ret[key] = req.body[key];
						}
					}
				}
				ret.save(function (err, ret2) {
					if (err) {
						res.status(404).json({message: 'Error happened!', data: err});
					}
					else {
						res.status(200).json({message: 'Request updated!', data: ret2});
					}
				})
			}
		});

	});

	//delete request
	app.delete('/deleteRequest', function(req, res) {
		Request.findById(req.params.req_id, function (err, ret) {
			//Request.findById(req.params.serv_id, function (err, serv) {
			if (err) {
				res.status(500).json({message: 'Error happened!', data: err});
			}
			else if (ret == '') {
				res.status(404).json({message: 'Invalid request!'});
			}
			else {
				ret.remove({_id: req.params.req_id}, function (err) {
					if (err) {
						res.status(404).json({message: 'Error happened!', data: err});
					}
					else {
						res.status(200).json({message: 'Request deleted!'});
					}
				});
			}
		});
	});


	//get all users
	app.get('/getAllUser', function(req,res){
		User.find(function(err,user){
			if (err) {
				res.status(500).json({message: 'Error happened!', data: err});
			}
			else if (user == "" || user == null || user == undefined) {
				res.status(404).json({message: 'No data found!!'});
			}
			else {
				res.status(200).json({message: 'Data fetched!!', data: user});
			}
		})
	})

	//get user by id
	app.get('/portfolio/:user_id', function(req, res) {
		User.findById(req.params.user_id, function(err, user) {
			if (err) {
				res.status(500).json({message: 'Error happened!', data: err});
			}
			else if (user == "" || user == null || user == undefined) {
				res.status(404).json({message: 'No data found!'});
			}
			else {
				res.status(200).json({message: 'Data found!', data: user});
			}
		});
	});

	/*    get user by query   */
	//app.get('/portfolio/:user_id', function(req, res) {
	//	var where = null;
	//	var sort = null;
	//	var select = null;
	//	var skip = null;
	//	var limit = null;
	//	var count = null;
	//	if (req.query.where != null && req.query.where != "" && req.query.where != undefined) {
	//		where = JSON.parse(req.query.where.replace(/'/g,'"'));
	//	}
	//	if (req.query.sort != null && req.query.sort != "" && req.query.sort != undefined) {
	//		sort = JSON.parse(req.query.sort);
	//	}
	//	if (req.query.select != null && req.query.select != "" && req.query.select != undefined) {
	//		select = JSON.parse(req.query.select);
	//	}
	//	if (req.query.skip != null && req.query.skip != "" && req.query.skip != undefined) {
	//		skip = req.query.skip;
	//	}
	//	if (req.query.limit != null && req.query.limit != "" && req.query.limit != undefined) {
	//		limit = req.query.limit;
	//	}
	//	if (req.query.count != null && req.query.count != "" && req.query.count != undefined) {
	//		count = req.query.count;
	//	}
	//	if (count) {
	//		User.find(where).sort(sort).select(select).skip(skip).limit(limit).count().exec(function (err, cnt) {
	//			if (err) {
	//				res.status(500).json({message: 'Error happened!', data: err});
	//			}
	//			else {
	//				res.status(200).json({message: 'Number of users', data: cnt});
	//			}
	//		});
	//	}
	//	else {
	//		User.find(where).sort(sort).select(select).skip(skip).limit(limit).exec(function (err, user) {
	//			if (err) {
	//				res.status(500).json({message: 'Error happened!', data: err});
	//			}
	//			else if (user == null || user == undefined) {
	//				res.status(404).json({message: 'No data found!!'});
	//			}
	//			else {
	//				res.status(200).json({message: 'Data fetched!!', data: user});
	//			}
	//		});
	//	}
	//});

	//update user info, mostly the request lists
	app.put('/portfolio/:user_id', function(req, res) {
		User.findById(req.params.user_id, function (err, user) {
			if (err) {
				res.status(500).json({message: 'Error happened!', data: err});
			}
			else if (user == "" || user == null || user == undefined) {
				res.status(404).json({message: 'Invalid request'});
			}
			else {
				for (var key in req.body) {
					if (req.body.hasOwnProperty(key)) {
						if (req.body[key] != null && req.body[key] != undefined && user[key] != undefined) {
							user[key] = req.body[key];
						}
					}
				}
				user.save(function (err, user2) {
					if (err) {
						res.status(404).json({message: 'Error happened!', data: err});
					}
					else {
						res.status(200).json({message: 'User updated!', data: user2});
					}
				})

			}
		});
	})


	//get all services
	app.get('/getAllServ', function(req,res){
		Service.find(function(err,serv){
			if (err) {
				res.status(500).json({message: 'Error happened!', data: err});
			}
			else if (serv == "" || serv == null || serv == undefined) {
				res.status(404).json({message: 'No data found!!'});
			}
			else {
				res.status(200).json({message: 'Data fetched!!', data: serv});
			}
		})
	})
	//delete all services, should be commented out in production code
	app.delete('/deleteAllServ', function(req, res){
		Service.remove({}, function(err){
			if (err) {
				res.status(500).json({message: 'Error happened!', data: err});
			}
			else {
				res.status(200).json({message: 'All Services removed!!'});
			}
		})
	})



	//get service by query
	app.get('/service', function(req, res){
		var where = null;
		var sort = null;
		var select = null;
		var skip = null;
		var limit = null;
		var count = null;
		if (req.query.where != null && req.query.where != "" && req.query.where != undefined) {
			where = JSON.parse(req.query.where.replace(/'/g,'"'));
		}
		if (req.query.sort != null && req.query.sort != "" && req.query.sort != undefined) {
			sort = JSON.parse(req.query.sort);
		}
		if (req.query.select != null && req.query.select != "" && req.query.select != undefined) {
			select = JSON.parse(req.query.select);
		}
		if (req.query.skip != null && req.query.skip != "" && req.query.skip != undefined) {
			skip = req.query.skip;
		}
		if (req.query.limit != null && req.query.limit != "" && req.query.limit != undefined) {
			limit = req.query.limit;
		}
		if (req.query.count != null && req.query.count != "" && req.query.count != undefined) {
			count = req.query.count;
		}
		if (count) {
			Service.find(where).sort(sort).select(select).skip(skip).limit(limit).count().exec(function (err, cnt) {
				if (err) {
					res.status(500).json({message: 'Error happened!', data: err});
				}
				else {
					res.status(200).json({message: 'Number of services', data: cnt});
				}
			});
		}
		else {
			Service.find(where).sort(sort).select(select).skip(skip).limit(limit).exec(function (err, serv) {
				if (err) {
					res.status(500).json({message: 'Error happened!', data: err});
				}
				else if (serv == "" || serv == null || serv == undefined) {
					res.status(404).json({message: 'No data found!!'});
				}
				else {
					res.status(200).json({message: 'Data fetched!!', data: serv});
				}
			});
		}
	})

	//get service by id
	app.get('/service/:serv_id', function(req, res) {
		Service.findById(req.params.user_id, function(err, serv) {
			if (err) {
				res.status(500).json({message: 'Error happened!', data: err});
			}
			else if (serv == "" || serv == null || serv == undefined) {
				res.status(404).json({message: 'No data found!'});
			}
			else {
				res.status(200).json({message: 'Data found!', data: serv});
			}
		});
	});

	// post service
	app.post('/portfolio/:user_id/queue', function(req, res) {
		var service = new Service();
		for (var key in req.body) {
			if (req.body.hasOwnProperty(key)) {
				if (req.body[key] != null && req.body[key] != undefined && service[key] != undefined) {
					service[key] = req.body[key];
				}
			}
		}
		service.save(function (err) {
			if (err) {
				res.status(500).json({message: 'Error happened!', data: err});
			}
			else {
				res.status(201).json({message: 'Service created!', data: service});
			}
		});
	});

	// update service, for future use
	app.put('/service/:serv_id', function(req, res) {
		Service.findById(req.params.serv_id, function (err, serv) {
			if (err) {
				res.status(500).json({message: 'Error happened!', data: err});
			}
			else if (serv == "" || serv == null || serv == undefined) {
				res.status(404).json({message: 'Invalid request'});
			}
			else {
				for (var key in req.body) {
					if (req.body.hasOwnProperty(key)) {
						if (req.body[key] != null && req.body[key] != undefined && serv[key] != undefined) {
							serv[key] = req.body[key];
						}
					}
				}
				user.save(function (err, serv2) {
					if (err) {
						res.status(404).json({message: 'Error happened!', data: err});
					}
					else {
						res.status(200).json({message: 'Service updated!', data: serv2});
					}
				})

			}
		});
	})
	//delete service
	app.delete('/portfolio', function(req, res) {
		Service.findById(req.params.serv_id, function (err, serv) {
			if (err) {
				res.status(500).json({message: 'Error happened!', data: err});
			}
			else if (serv == '') {
				res.status(404).json({message: 'Invalid service!'});
			}
			else {
				serv.remove({_id: req.params.serv_id}, function (err) {
					if (err) {
						res.status(404).json({message: 'Error happened!', data: err});
					}
					else {
						res.status(200).json({message: 'Service deleted!'});
					}
				});
			}
		});
	});

	//for test
	app.put('/test', function(req,res){
		var s = "", s2 = "";
		for (var key in req.body) {
			if (req.body.hasOwnProperty(key)) {
				s += key + ",";
				s2 += req.body[key] + ",";
			}
		}
		var msg = "message";
		Request.findById("571d82637d6845660e6b9e18", function(err, ret){
			if (ret[msg] != undefined) {
				console.log(ret[msg]);
			}
			console.log("2." + ret[msg]);

		})
		res.status(200).json({keys: s2});
	})


	app.post('/portfolio/:user_id', function(req,res) {
		res.json({message: 'Hello World!'});
	});

};