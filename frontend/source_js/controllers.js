var mp4Controllers = angular.module('mp4Controllers', ['720kb.datepicker', 'ngResource', 'ngDialog']);


mp4Controllers
// Not require login
.controller('HomeCtrl', ['$scope', '$http', '$resource', 'ngDialog', 'user', function($scope, $http, $resource, ngDialog, user) {
    $scope.cancelRequest = function () {
        ngDialog.open({ template: './partials/cancelRequest.html', className: 'ngdialog-theme-default', controller: 'cancelReqCtrl' })
    };

    $scope.showUsers = function () {
        ngDialog.open({ template: './partials/searchUsers.html', className: 'ngdialog-theme-default', controller: 'searchUsersCtrl' })
    };

}])

.controller('searchUsersCtrl', ['$scope', '$http', '$resource', 'ngDialog', 'user', function($scope, $http, $resource, ngDialog, user) {
    user.getAll().then(function(data) {
        $scope.users = data.data.data;
        console.log($scope.users);
        $scope.searchDomain = [];
        // angular.forEach($scope.users, function(user) {
        //     $scope.searchDomain.push(user);
        // });
        console.log($scope.searchDomain);
    });
}])

.controller('PortfolioCtrl', ['$scope', '$http', '$resource', 'user', '$routeParams', 'ngDialog', 'service', function($scope, $http, $resource, user, $routeParams, ngDialog, service) {    
    ngDialog.close()
    user.get($routeParams.id)
    .success(function (data, status, headers, config) {
        $scope.user = data.data;
        $scope.services = [];
        angular.forEach($scope.user.services, function(serviceID) {
            service.get(serviceID).then(function (data) {
                $scope.services.push(data.data.data);
            });
        });
    }).error(function (data, status, headers, config) {
        console.log(data);
    });
}])



// Queue Pages
.controller('EditPortfolioCtrl', ['$scope', '$http', '$resource', '$routeParams', 'user', '$route', function($scope, $http, $resource, $routeParams, user, $route) {

    user.get($routeParams.id)
    .then(function (data) {
        $scope.user = data.data.data;
        console.log($scope.user);
        $scope.businessName = $scope.user.businessName;
        $scope.intro = $scope.user.intro;
        $scope.email = $scope.user.local.email;
        // $scope.services = $scope.user.services;
    });

    $scope.updateUsername = function (data) {
        sendData = {username: data}
        user.update($routeParams.id, sendData, function(data) {
            $route.reload();
        });
    }

    $scope.updateIntro = function (data) {
        sendData = {intro: data}
        user.update($routeParams.id, sendData, function(data) {
            $route.reload();
        });
    }

    $scope.updateBusinessName = function (data) {
        sendData = {businessName: data}
        user.update($routeParams.id, sendData, function(data) {
            $route.reload();
        });
    }
    $scope.updateEmail = function (data) {
        sendData = {local: {email: data, password: $scope.user.local.password}}

        user.update($routeParams.id, sendData, function(data) {
            $route.reload();
        });
    }




}])

.controller('QueueCtrl', ['$scope', '$http', '$resource', function($scope, $http, $resource) {

    var newRequest = 1;
    var inProgress = 2;
    var completed = 4;
    var declined = 3;
    var curType = 1;
    $scope.sortBy = '+';
    // init tabs
    [].slice.call( document.querySelectorAll( '.tabs' ) ).forEach( function( el ) {new CBPFWTabs( el );});

    $scope.tasks = [{   userID: "123123",
                        customerName: "Mike Wang", 
                        message: "this is a task", 
                        service: "Guitar Lesson",
                        contactInfo: "2172172172",
                        status: 1,
                        proposedTime: [],
                        acceptedTime: [],
                        createdTime: "2016-2-24"},
                    {   userID: "123123",
                        customerName: "Judy Chen", 
                        message: "this is a task", 
                        service: "Guitar Lesson",
                        contactInfo: "2172172172",
                        status: 1,
                        proposedTime: [],
                        acceptedTime: [],
                        createdTime: "2016-2-24"}];

    $scope.setType = function(type){
        curType = type;
        $scope.reload();
        console.log("query for type: "+curType)
    }

    $scope.reload = function(){
        //query for status = curType

    }    

    $scope.reload()
}])



// Tasks Pages
.controller('DetailCtrl', ['$scope', '$http', '$resource', function($scope, $http, $resource) {


}])

.controller('cancelReqCtrl', ['$scope', '$http', '$resource', 'request', function($scope, $http, $resource, request) {
    $scope.message = 'Your request number can be found in your confirmation email';
    $scope.requestNumber;
    $scope.cancel = function() {
        if($scope.requestNumber || $scope.requestNumber.length > 0){
            request.delete($scope.requestNumber, function() {
                $scope.requestNumber = '';
                $scope.message = 'Request canceled';
            });
        }
    }       
}])

.controller('NewRequestCtrl', ['$scope', '$http', '$resource', 'SP', function($scope, $http, $resource, SP) {
    $scope.SP = SP.get()

}])

.controller('loginCtrl', ['$scope', '$http', '$resource', 'SP', 'user', '$location', function($scope, $http, $resource, SP, user, $location) {
    $scope.password;
    $scope.email;
    $scope.login = function() {
        $http({
            method: 'POST',
            url: 'http://localhost:8080/login',
            data: $.param({
                email: $scope.email,
                password: $scope.password
            }),
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        }).success(function (data, status, headers, config) {
            console.log(data.data._id);
            $location.path('/user/portfolio/'+data.data._id);
         }).error(function (data, status, headers, config) {}); 
    }
}])

.controller('signupCtrl', ['$scope', '$http', '$resource', 'SP', 'user', '$location', function($scope, $http, $resource, SP, user, $location) {
    $scope.password;
    $scope.email;
    $scope.signup = function() {
        $http({
            method: 'POST',
            url: 'http://localhost:8080/signup',
            data: $.param({
                email: $scope.email,
                password: $scope.password
            }),
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        }).success(function (data, status, headers, config) {
            console.log(data.data);
            if(data.data._id !== undefined)
                $location.path('/user/portfolio/'+data.data._id);
            else 
                $location.path('/');
         }).error(function (data, status, headers, config) {}); 
    }
}])




// general controllers
.controller('TopbarCtrl', ['$scope', '$http', '$resource', 'ngDialog', function($scope, $http, $resource, ngDialog) {

    $scope.showLogin = function() {
        ngDialog.open({ template: './partials/login.html', className: 'ngdialog-theme-default', controller: 'loginCtrl' })
      }

    $scope.showSignup = function() {
        ngDialog.open({ template: './partials/signup.html', className: 'ngdialog-theme-default', controller: 'signupCtrl' })
    }  


}])
.controller('profileController', ['$scope', '$http', function($scope, $http) {
   $scope.profile = false;
   $http.get('/profile').success(function(data) {
        console.log(data);
        if(!data.error) {
            $scope.profile = true;
            $scope.user = data.user;
        }
   });
 }])
.directive('topbar', function() {
  return {
    template: '
    <div class="small-12 fixtop navbar" ng-controller = "TopbarCtrl">
              <div class="small-12 small-centered columns">
            <div class="float-left small-6 large-4 columns">
                <div class="row">
                    <div class="columns small-4"><a href="#/" class="bt round">Service</a></div>
                    <div class="columns small-8 end"><a href="#/serviceprovider/1" class="bt round">My Queue</a></div>
                </div>
            </div>
            <div class="float-right small-6 large-4 columns">
                <div class="float-right row">
                    <div class="columns small-6 float-right" ng-click="showSignup()"><a  class="bt round float-right">Signup</a></div>
                    <div class="columns small-4 end float-right" ng-click="showLogin()"><a class="bt round float-right">Login</a></div>
                </div>

            </div>
        </div>
    </div>'
  };
})


