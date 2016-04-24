var mp4Services = angular.module('mp4Services', ['ngRoute', 'ngResource']);

mp4Services.factory('APIurl', function(){
    var url  = "http://www.uiucwp.com:4000/api";
    var service = { set: function(u){ url = u; },
                    get: function(){ return url; }
                    };
  return service;
})
.factory('Users', ['$resource', 'APIurl', function($resource, APIurl){
    var url = APIurl.get()+'/users';
    //url="http://www.uiucwp.com:4000/api/users";
    console.log('User service: ' + url);
  return $resource(url, null, {
    'update': { method:'PUT' },
    'query': {method: 'GET', isArray: false }
  });
}])
.factory('Tasks', ['$resource', 'APIurl', function($resource, APIurl){
    var url = APIurl.get()+'/tasks';
    //url="http://www.uiucwp.com:4000/api/tasks";
    console.log('User service: ' + url);
  return $resource(url, null, {
    'update': { method:'PUT' },
    'query': {method: 'GET', isArray: false, params: {id: '@rmaId'}}
  });
}])

// change the APIurl()!!!!!!