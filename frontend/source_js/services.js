var mp4Services = angular.module('mp4Services', ['ngRoute', 'ngResource']);

mp4Services.factory('SP', function(){
    var SPname  = "Hany";
    var service = { set: function(u){ SPname = u; },
                    get: function(){ return SPname; }
                    };
  return service;
})


// change the APIurl()!!!!!!