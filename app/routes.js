var User = require('./models/user');
var Service = require('./models/service');
var Request = require('./models/request');
var mail = require('./mail');


module.exports = function(app, passport) {

	app.post('/signup', function(req, res, next) {
		passport.authenticate('local-signup', function(err, user, info) {
			if (err) { return next(err); }
			if (!user && info.message == 'User already exists.') { return res.send(400,{'status': 400,'message': 'User already exists'});}
			else {
				console.log(req.body);
				console.log(user);
				return res.send(200,{'status':200,'message':'Successful Signup', data: user});
			}
			req.logIn(user,function(err){
				if (err) { return next(err); }
				return res.send(200,{'status':200,'message':'Successful Signup', data: user});
			});

		})(req, res, next);
	});


	app.post('/login', function(req, res, next) {
		passport.authenticate('local-login', function(err, user, info) {
			if (err) { return next(err); }
			if (!user && info.message == 'user not existed') {return res.send(404,{'status': 404,'message': 'User not found'});}
			if (!user && info.message == 'password incorrect'){return res.send(404,{'status': 404,'message': 'Password incorrect'});}
			console.log(user);
			return res.send(200,{'status':200,'message':'Login Success', data: user});
			req.logIn(user,function(err){
				if (err) { return next(err); }
				return res.send(200,{'status':200,'message':'Login Success', data: user});
			});
		})(req, res, next);
	});



	//app.post('/signup', passport.authenticate('local-signup'), function(req, res) {
	//	res.redirect('/profile.html');
	//});

	//app.post('/login', passport.authenticate('local-login'), function(req, res) {
    //
	//	res.redirect('/profile.html');
	//});

	app.get('/profile', isLoggedIn, function(req, res) {
		console.log(req['user']);
		res.status(200).json({user: req.user});
	});

	//app.get('/queue/:user_id', isLoggedIn, function(req, res) {
	//	res.redirect('/serviceprovider/:user_id');
	//});

	app.get('/logout', function(req, res) {
		req.logout();
		res.redirect('/');
	});

	function isLoggedIn(req, res, next) {
		//console.log("in islogin");
		if (req.isAuthenticated()) {
			//console.log("logged in")
			return next();
		}
		res.status(404).json({
			error: "User not logged in"
		});
		//res.redirect('/login.html');
	}


	//test authentication
	app.get('/testA/:user_id',isLoggedIn, function(req,res) {
		console.log(req.params.user_id);
		if (req.params.user_id == req['user']._id) {
			res.json({data: req['user']});
		}
		else {
			res.json({data: "invalid"})
		}
	})
	app.get('/testB/:user_id', function(req,res) {
		console.log(req.params.user_id);
		if (req.isAuthenticated()) {
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
		}
		res.json({
			msg: "User not logged in"
		});
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


	//get request with query, not used
	app.get('/request', function(req, res) {
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
	app.get('/request/:req_id', isLoggedIn, function(req, res) {
		Request.findById(req.params.req_id, function(err, ret) {
			if (err) {
				res.status(500).json({message: 'Error happened!', data: err});
			}
			else if (ret == "" || ret == null || ret == undefined) {
				res.status(404).json({message: 'No data found!'});
			}
			else {
				if (ret.userID == req['user']._id || ret.creatorID == req['user']._id) {
					res.status(200).json({message: 'Data found!', data: ret});
				}
				else {
					res.status(404).json({message: 'not your request!'});
				}
			}
		});
	});

	//customer created new request to a user, will post request and update user, if customer is loggedin, his/her myrequests list will be updated
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
				user.save(function (err, user) {
					if (err) {
						res.status(404).json({message: 'Error happened!', data: err});
					}
					else {
						if (req.isAuthenticated()) {
							request.creatorID = req['user']._id;
						}
						request.save(function (err) {
							var message = 'You are in line!\nYour request number is '+request._id+'\nUse this number whenever you want cancel your request.\nYour request:\n   '+req.body.message;
							var confirmation = {from: 'lineupnowserving@gmail.com', to: req.body.contactInfo, subject: 'Line Up Notification! #'+request._id, text: message };
							if (err) {
								res.status(500).json({message: 'Error happened!', data: err});
							}
							else {
								if (req.isAuthenticated()) {
									User.findById(req['user']._id, function(err, user) {
										if (err || user == "" || user == null || user == undefined) {
											mail.sendMail(confirmation);
											console.log('request created but could not find current user!');
											res.status(201).json({message:'You should be notified shortly, please check your email and make sure it is not in your junk.' , data: request});
										}
										else {
											user.myrequests.push(request.id);
											user.save(function(err, user) {
												if (err || user == "" || user == null || user == undefined) {
													mail.sendMail(confirmation);
													console.log('Request created but not added to creator');
													res.status(201).json({message:'You should be notified shortly, please check your email and make sure it is not in your junk.' , data: request});
												}
												else {
													mail.sendMail(confirmation);
													console.log('Request created and added to creator');
													res.status(201).json({message: 'You should be notified shortly, please check your email and make sure it is not in your junk.' , data: request});
												}
											})
										}
									})
								}
								else {
									mail.sendMail(confirmation);
									res.status(201).json({message: 'Request created by non-registered user', data: request});

								}
							}
						});
					}
				})
			}
		});

	});

	//edit request, will also update user's request list
	app.put('/editRequest/:req_id', isLoggedIn, function(req, res){
		//if(req['user']._id != req.params.user_id) return;
		Request.findById(req.params.req_id, function (err, ret) {
			if (err) {
				res.status(500).json({message: 'Error happened!', data: err});
			}
			else if (ret == "" || ret == null || ret == undefined) {
				res.status(404).json({message: 'Invalid request'});
			}
			else {
				if (ret.userID == req['user']._id || ret.creatorID == req['user']._id) {
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
								User.findById(ret.userID, function (err, user) {
									if (err) {
										res.status(500).json({message: 'Error happened!', data: err});
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
											user.save(function (err) {
												if (err) {
													res.status(200).json({
														message: 'Requested updated but user update has error!',
														data: err
													});
												}
												else {
													res.status(200).json({message: 'Request updated!', data: ret});
												}
											})
										}
										else {
											user[status[currentStatus]].push(ret._id);
											user.save(function (err) {
												if (err) {
													res.status(200).json({
														message: 'Requested updated but user update has error!',
														data: err
													});
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
				else {
					res.status(404).json({message: 'not your request'});
				}
			}
		});
	});

	//delete request, will also update user side
	app.delete('/deleteRequest/:req_id', function(req, res) {
		Request.findById(req.params.req_id, function (err, ret) {
			if (err) {
				res.status(500).json({message: 'Error happened!', data: err});
			}
			else if (ret == '' || ret == null || ret == undefined) {
				res.status(404).json({message: 'Invalid request!'});
			}
			else {
				//console.log("0");
				// console.log(req);
				// if (ret.userID == req['user']._id || ret.creatorID == req['user']._id) {
					var uid = ret.userID;
					var rid = ret._id;
					var req_status = ret.status;
					var cid = ret.creatorID;
					Request.remove({_id: rid}, function (err) {
						if (err) {
							res.status(500).json({message: 'Error happened!', data: err});
						}
						else {
							//console.log("1");
							User.findById(uid, function (err, user) {
								if (err) {
									res.status(200).json({
										message: 'Request deleted! But user update has error',
										data: err
									});
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
										user.save(function (err) {
											if (err) {
												res.status(200).json({
													message: 'Request deleted! User not updated',
													data: err
												});
											}
											else {
												res.status(200).json({message: 'Request deleted!'});
											}
										})
									}
									else {
										res.status(200).json({message: 'Request deleted!'});
									}

									if (cid != "") {
										User.findById(cid, function (err, user) {
											if (err || user == "" || user == null || user == undefined) {
												res.status(200).json({message: 'Request deleteted! User not updated2'});
											}
											else {
												var index2 = user["myrequests"].indexOf(rid);
												if (index2 > -1) {
													user["myrequests"].splice(index2, 1);
													user.save(function (err) {
														if (err) {
															res.status(200).json({
																message: 'Request deleted! User not updated3',
																data: err
															});
														}
														else {
															res.status(200).json({message: 'Request deleted! Logged in user updated'});
														}
													})
												}
											}
										})
									}
								}
							});
						}
					});
				// }
				// else {
				// 	res.status(404).json({message: 'not your request'});
				// }
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

	app.delete('/user/:user_id', function(req, res) {
		User.findByIdAndRemove(req.params.user_id, function(err) {
			if(err) {
				res.status(500).json({message: 'Error finding and deleting user', data: err});
			}
			else {
				res.status(200).json({message: "User Deleted"});
			}
		});
	});


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

	//get logged in user
	app.get('/user', isLoggedIn, function(req, res) {
		User.findById(req['user']._id, function(err, user) {
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
	app.put('/editUser', isLoggedIn, function(req, res) {
		User.findById(req['user']._id, function (err, user) {
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
				user.save(function (err) {
					if (err) {
						res.status(404).json({message: 'Error happened!', data: err});
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
		Service.findById(req.params.serv_id, function(err, serv) {
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
	app.post('/addService', isLoggedIn, function(req, res) {
		User.findById(req['user']._id, function(err, user) {
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
				user.save(function (err, user) {
					if (err) {
						res.status(404).json({message: 'Error happened!', data: err});
					}
					else {
						service.save(function (err) {
							if (err) {
								res.status(500).json({message: 'Error happened!', data: err});
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
	app.put('/editService/:serv_id', isLoggedIn, function(req, res) {
		Service.findById(req.params.serv_id, function (err, serv) {
			if (err) {
				res.status(500).json({message: 'Error happened!', data: err});
			}
			else if (serv == "" || serv == null || serv == undefined) {
				res.status(404).json({message: 'Invalid request'});
			}
			else {
				if (serv.userID == req['user']._id) {
					for (var key in req.body) {
						if (key != "userID") {
							if (req.body.hasOwnProperty(key)) {
								if (req.body[key] != null && req.body[key] != undefined && serv[key] != undefined) {
									serv[key] = req.body[key];
								}
							}
						}
					}
					serv.save(function (err) {
						if (err) {
							res.status(404).json({message: 'Error happened!', data: err});
						}
						else {
							res.status(200).json({message: 'Service updated!', data: serv});
						}
					})
				}
				else {
					res.status(404).json({message: 'Not your service!'});
				}
			}
		});
	})
	//delete service
	app.delete('/deleteService/:serv_id', isLoggedIn, function(req, res) {
		//if(req['user']._id != req.params.user_id) return;
		Service.findById(req.params.serv_id, function (err, serv) {
			if (err) {
				res.status(500).json({message: 'Error happened!', data: err});
			}
			else if (serv == '') {
				res.status(404).json({message: 'Invalid service!'});
			}
			else {
				if (serv.userID == req['user']._id) {
					var uid = serv.userID;
					Service.remove({_id: req.params.serv_id}, function (err) {
						if (err) {
							res.status(404).json({message: 'Error happened!', data: err});
						}
						else {
							User.findById(uid, function (err, user) {
								if (err) {
									res.status(200).json({
										message: 'Service deleted! But user update has error',
										data: err
									});
								}
								else if (user == "" || user == null || user == undefined) {
									res.status(200).json({message: 'Service deleted! User not found'});
								}
								else {
									var index = user["services"].indexOf(serv._id);
									if (index > -1) {
										user["services"].splice(index, 1);
										user.save(function (err) {
											if (err) {
												res.status(200).json({
													message: 'Service deleted! User not updated',
													data: err
												});
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
				else {
					res.status(404).json({message: 'Not your service!'});
				}
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
				User.remove({}, function(err){
					if (err) {
						res.status(500).json({message: 'Error happened!', data: err});
					}
					else {
						Request.remove({}, function(err){
							if (err) {
								res.status(500).json({message: 'Error happened!', data: err});
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