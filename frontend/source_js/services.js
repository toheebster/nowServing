var mp4Services = angular.module('mp4Services', ['ngRoute', 'ngResource']);
var baseUrl = "http://localhost:8080";

mp4Services.factory('SP', function(){
<<<<<<< HEAD
   var SPname  = "Hany";
   var service = { set: function(u){ SPname = u; },
                   get: function(){ return SPname; }
                   };
 return service;
})
.factory('request', function($http) {
  return {
      get: function(req_id, user_id) {
          return $http.get(baseUrl+'/request/'+req_id+'/'+user_id);
      },
      post: function(user_id, obj, callback) {
          $http.post(baseUrl+'/addRequest/'+user_id, obj).success(function(data){
              callback(data);
          });
      },
      update: function(req_id, user_id, obj, callback){
          var baseUrl = $window.sessionStorage.baseurl;
          $http.put(baseUrl+'/editRequest/'+req_id+'/'+user_id, obj).success(function(){
              callback();
          });
      },
      delete_task: function(taskID, callback){
          var baseUrl = $window.sessionStorage.baseurl;
          $http.delete(baseUrl+'/deleteRequest/'+req_id+'/'+user_id).success(function(){
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
      post: function(user_id, obj, callback) {
          $http.post(baseUrl+'/addRequest/'+user_id, obj).success(function(data){
              callback(data);
          });
      },
      update: function(user_id, obj, callback){
          var baseUrl = $window.sessionStorage.baseurl;
          $http.put(baseUrl+'/user/'+user_id, obj).success(function(){
              callback();
          });
      },
      delete_task: function(taskID, callback){
          var baseUrl = $window.sessionStorage.baseurl;
          $http.delete(baseUrl+'/deleteRequest/'+req_id+'/'+user_id).success(function(){
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
      update: function(serv_id, user_id, obj, callback){
          var baseUrl = $window.sessionStorage.baseurl;
          $http.put(baseUrl+'/editService/'+serv_id+'/'+user_id, obj).success(function(){
              callback();
          });
      },
      delete_task: function(serv_id, user_id, callback){
          var baseUrl = $window.sessionStorage.baseurl;
          $http.delete(baseUrl+'/deleteService/'+serv_id+'/'+user_id, obj).success(function(){
              callback();
          });
      }
  }
});
=======
    var SP=null;
    var service = { set: function(u){ SP = u; },
                    get: function(){ return SP; }
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
>>>>>>> 05b664c33714846d9f982a524e4c71094722bb36
