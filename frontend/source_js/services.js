var mp4Services = angular.module('mp4Services', ['ngRoute', 'ngResource']);
var baseUrl = "http://localhost:8081";

mp4Services.factory('SP', function(){
    var SP =  {
        username: "",
        businessName: "",
        intro: "",
        gender: 0,  //0 not specified, 1 male, 2 female
        services: [],  //store service ids
        rejected: [],  //store request ids
        completed: [], //store request ids
        accepted: [],  //store request ids
        new: [],
        myrequests: [],  //store request ids
    };
    var service = { set: function(u){ SP = u; console.log("fact SP: "); console.log(SP)},
                    get: function(){ console.log("fact SP: "); console.log(SP); return SP; }
                    };
  return service;
})
.factory('request', function($http) {
   return {
       get: function(req_id) {
           return $http.get(baseUrl+'/request/'+req_id);
       },
       post: function(user_id, obj, callback) {
           $http.post(baseUrl+'/addRequest/'+user_id, obj).success(function(data){
               callback(data);
           });
       },
       update: function(req_id, obj, callback){
           
           $http.put(baseUrl+'/editRequest/'+req_id, obj).success(function(){
               callback();
           });
       },
       delete: function(req_id, callback){
           
           $http.delete(baseUrl+'/deleteRequest/'+req_id).success(function(){
               callback();
           });
       }
   }
})
.factory('user', function($http) {
   return {
       get: function(user_id) {
           return $http.get(baseUrl+'/user/'+user_id);
       },
       getAll: function() {
        return $http.get(baseUrl+'/getAllUser');
       },
       findUser:function(u_email){ 
           console.log("get url is : " + baseUrl+'/findUser/'+u_email);
           return $http.get(baseUrl+'/findUser/'+u_email);
       },
       post: function(user_id, obj, callback) {
           $http.post(baseUrl+'/addRequest/'+user_id, obj).success(function(data){
               callback(data);
           });
       },
       update: function(user_id, obj, callback){
           
           $http.put(baseUrl+'/user/'+user_id, obj).success(function(){
               callback();
           });
       },
       delete: function(req_id, callback){
           
           $http.delete(baseUrl+'/deleteRequest/'+req_id).success(function(){
               callback();
           });
       }
   }
})
.factory('service', function($http) {
   return {
       get: function(serv_id) {
           return $http.get(baseUrl+'/service/'+serv_id);
       },
       post: function(user_id, obj, callback) {
           $http.post(baseUrl+'/addService/'+user_id, obj).success(function(data){
               callback(data);
           });
       },
       update: function(serv_id, obj, callback){
           
           $http.put(baseUrl+'/editService/'+serv_id, obj).success(function(){
               callback();
           });
       },
       delete: function(serv_id, callback){
           
           $http.delete(baseUrl+'/deleteService/'+serv_id, obj).success(function(){
               callback();
           });
       }
   }
});