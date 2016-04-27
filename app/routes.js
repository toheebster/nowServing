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
		console.log(req['user']);
		res.json({
			user: req.user
		});
	});

	app.get('/queue/:user_id', isLoggedIn, function(req, res) {
		res.redirect('/serviceprovider/:user_id');
	});

	app.get('/logout', function(req, res) {
		req.logout();
		res.redirect('/');
	});

	function isLoggedIn(req, res, next) {
		console.log("in islogin");
		if (req.isAuthenticated()) {
			console.log("logged in")
			return next();
		}

		res.json({
			error: "User not logged in"
		});
		res.redirect('/login.html');
	}


	//test authentication
	app.get('/testA/:user_id',isLoggedIn, function(req,res) {
		console.log(req.params.user_id);
		if (req.params.user_id == req['user']._id) {
			res.json({
				data: req['user']
			});
		}
		else {
			res.json({
				data: "invalid"
			})
		}
	})

	//get all request
	app.get('/getAllReq', function(req,res){
		console.log(req['user']);
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
	app.get('/request/:req_id/:user_id', function(req, res) {
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

	//customer created new request to a user, will post request and update user
	app.post('/addRequest/:user_id', function(req,res){
		User.findById(req.params.user_id, function(err, user) {
			if (err) {
				res.status(500).json({message: 'Error happened!', data: err});
			}
			else if (user == "" || user == null || user == undefined) {
				res.status(404).json({message: 'No user found'});
			}
			else {
				var request = new Request();
				for (var key in req.body) {
					if (req.body.hasOwnProperty(key)) {
						if (req.body[key] != null && req.body[key] != undefined && request[key] != undefined) {
							request[key] = req.body[key];
						}
					}
				}
				request.userID = user._id;
				user.new.push(request._id);
				user.save(function (err2, user2) {
					if (err2) {
						res.status(404).json({message: 'Error happened!', data: err2});
					}
					else {
						request.save(function (err3) {
							if (err3) {
								res.status(500).json({message: 'Error happened!', data: err3});
							}
							else {
								res.status(201).json({message: 'Request created', data: request});
							}
						});
					}
				})
			}
		});

	});

	//edit request, will also update user's request list
	app.put('/editRequest/:req_id/:user_id', function(req, res){
		//if(req['user']._id != req.params.user_id) return;
		Request.findById(req.params.req_id, function (err, ret) {
			if (err) {
				res.status(500).json({message: 'Error happened!', data: err});
			}
			else if (ret == "" || ret == null || ret == undefined) {
				res.status(404).json({message: 'Invalid request'});
			}
			else {
				var previousStatus = ret.status;
				for (var key in req.body) {
					if (req.body.hasOwnProperty(key)) {
						if (key == "userID") continue; //user id is not allowed to change
						if (req.body[key] != null && req.body[key] != undefined && ret[key] != undefined) {
							ret[key] = req.body[key];
						}
					}
				}
				var currentStatus = ret.status;
				ret.save(function (err) {
					if (err) {
						res.status(404).json({message: 'Error happened!', data: err});
					}
					else {
						if (previousStatus != currentStatus) {
							User.findById(ret.userID, function (err2, user) {
								if (err2) {
									res.status(500).json({message: 'Error happened!', data: err2});
								}
								else if (user == "" || user == null || user == undefined) {
									res.status(404).json({message: 'No matched user found'});
								}
								else {
									var status = ["new", 'accepted', 'rejected', 'completed'];
									var index = user[status[previousStatus]].indexOf(ret._id);
									if (index > -1) {
										user[status[previousStatus]].splice(index, 1);
										if (user[status[currentStatus]].indexOf(ret._id) < 0) {
											user[status[currentStatus]].push(ret._id);
										}
										user.save(function(err3){
											if (err3) {
												res.status(200).json({message: 'Requested updated but user update has error!', data: err3});
											}
											else {
												res.status(200).json({message: 'Request updated!', data: ret});
											}
										})
									}
									else {
										user[status[currentStatus]].push(ret._id);
										user.save(function(err3){
											if (err3) {
												res.status(200).json({message: 'Requested updated but user update has error!', data: err3});
											}
											else {
												res.status(200).json({message: 'Request updated2!', data: ret});
											}
										})
									}
								}
							});
						}
					}
				})
			}
		});
	});

	//delete request, will also update user side
	app.delete('/deleteRequest/:req_id/:user_id', function(req, res) {
		Request.findById(req.params.req_id, function (err, ret) {
			if (err) {
				res.status(500).json({message: 'Error happened!', data: err});
			}
			else if (ret == '' || ret == null || ret == undefined) {
				res.status(404).json({message: 'Invalid request!'});
			}
			else {
				//console.log("0");
				var uid = ret.userID;
				var rid = ret._id;
				var req_status = ret.status;
				Request.remove({_id: rid},function(err2) {
					if (err2) {
						res.status(500).json({message: 'Error happened!', data: err2});
					}
					else {
						//console.log("1");
						User.findById(uid, function (err3, user) {
							if (err3) {
								res.status(200).json({message: 'Request deleted! But user update has error', data: err3});
							}
							else if (user == "" || user == null || user == undefined) {
								res.status(200).json({message: 'Request deleted! User not found'});
							}
							else {
								//console.log("2");
								var status = ["new", 'accepted', 'rejected', 'completed'];
								var index = user[status[req_status]].indexOf(rid);
								if (index > -1) {
									user[status[req_status]].splice(index, 1);
									user.save(function(err4){
										if (err4) {
											res.status(200).json({message: 'Request deleted! User not updated', data: err4});
										}
										else {
											res.status(200).json({message: 'Request deleted!'});
										}
									})
								}
								else {
									res.status(200).json({message: 'Request deleted!'});
								}
							}
						});
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
	//delete all users, should be commented out in production code
	app.delete('/deleteAllUser', function(req, res){
		User.remove({}, function(err){
			if (err) {
				res.status(500).json({message: 'Error happened!', data: err});
			}
			else {
				res.status(200).json({message: 'All users removed!!'});
			}
		})
	})


	//get user by id
	app.get('/user/:user_id', function(req, res) {
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

	//update user info
	app.put('/user/:user_id', function(req, res) {
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
				user.save(function (err2) {
					if (err2) {
						res.status(404).json({message: 'Error happened!', data: err2});
					}
					else {
						res.status(200).json({message: 'User updated!', data:user});
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
				res.status(200).json({message: 'All services removed!!'});
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
	app.post('/addService/:user_id', function(req, res) {
		User.findById(req.params.user_id, function(err, user) {
			if (err) {
				res.status(500).json({message: 'Error happened!', data: err});
			}
			else if (user == "" || user == null || user == undefined) {
				res.status(404).json({message: 'No user found'});
			}
			else {
				var service = new Service();
				for (var key in req.body) {
					if (req.body.hasOwnProperty(key)) {
						if (req.body[key] != null && req.body[key] != undefined && service[key] != undefined) {
							service[key] = req.body[key];
						}
					}
				}
				service.userID = user._id;
				user.services.push(service._id);
				user.save(function (err2, user2) {
					if (err2) {
						res.status(404).json({message: 'Error happened!', data: err2});
					}
					else {
						service.save(function (err3) {
							if (err3) {
								res.status(500).json({message: 'Error happened!', data: err3});
							}
							else {
								res.status(201).json({message: 'Service created!', data: service});
							}
						});
					}
				})
			}
		});
	});

	// update service, for future use
	app.put('/editService/:serv_id/:user_id', function(req, res) {
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
				serv.save(function (err2) {
					if (err2) {
						res.status(404).json({message: 'Error happened!', data: err2});
					}
					else {
						res.status(200).json({message: 'Service updated!', data: serv});
					}
				})

			}
		});
	})
	//delete service
	app.delete('/deleteService/:serv_id/:user_id', function(req, res) {
		//if(req['user']._id != req.params.user_id) return;
		Service.findById(req.params.serv_id, function (err, serv) {
			if (err) {
				res.status(500).json({message: 'Error happened!', data: err});
			}
			else if (serv == '') {
				res.status(404).json({message: 'Invalid service!'});
			}
			else {
				var uid = serv.userID;
				Service.remove({_id: req.params.serv_id}, function (err2) {
					if (err2) {
						res.status(404).json({message: 'Error happened!', data: err2});
					}
					else {
						User.findById(uid, function (err3, user) {
							if (err3) {
								res.status(200).json({message: 'Service deleted! But user update has error', data: err3});
							}
							else if (user == "" || user == null || user == undefined) {
								res.status(200).json({message: 'Service deleted! User not found'});
							}
							else {
								var index = user["services"].indexOf(serv._id);
								if (index > -1) {
									user["services"].splice(index, 1);
									user.save(function(err4){
										if (err4) {
											res.status(200).json({message: 'Service deleted! User not updated', data: err4});
										}
										else {
											res.status(200).json({message: 'Service deleted!'});
										}
									})
								}
								else {
									res.status(200).json({message: 'Service deleted!'});
								}
							}
						});
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

	//delete all data
	app.delete('/deleteAll', function(req, res){
		Service.remove({}, function(err){
			if (err) {
				res.status(500).json({message: 'Error happened!', data: err});
			}
			else {
				User.remove({}, function(err2){
					if (err2) {
						res.status(500).json({message: 'Error happened!', data: err2});
					}
					else {
						Service.remove({}, function(err3){
							if (err3) {
								res.status(500).json({message: 'Error happened!', data: err3});
							}
							else {
								res.status(200).json({message: 'All removed!!'});
							}
						})
					}
				})
			}
		})
	})

};