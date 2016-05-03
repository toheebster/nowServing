var mp4Controllers = angular.module('mp4Controllers', ['720kb.datepicker', 'ngResource', 'ngDialog']);

var NEW_REQUEST = 0;
var IN_PROGRESS = 1;
var COMPLETED = 3;
var DECLINED = 2;

var homeurl = "http://localhost:8080"

mp4Controllers
// Not require login
.controller('HomeCtrl', ['$scope', '$http', '$resource', 'ngDialog', function($scope, $http, $resource, ngDialog) {

}])

.controller('PortfolioCtrl', ['$scope', '$http', '$resource', function($scope, $http, $resource) {


}])


// Queue Pages
.controller('EditPortfolioCtrl', ['$scope', '$http', '$resource', function($scope, $http, $resource) {


}])

.controller('QueueCtrl', ['$scope', '$http', 'request', '$routeParams', 'user', 'ngDialog', '$location', function($scope, $http, request, $routeParams, user, ngDialog, $location) {
    
    $scope.curType = NEW_REQUEST;
    $scope.sortBy = '+';
    var SPID = $routeParams.id;
    var reqids = [];
    var i;

    // init tabs
    [].slice.call( document.querySelectorAll( '.tabs' ) ).forEach( function( el ) {new CBPFWTabs( el );});

    $scope.setType = function(type){
        $scope.curType = type;
        $scope.reload();
        console.log("query for type: "+$scope.curType)

    }

    $scope.reload = function(){
        //query for status = $scope.curType

        console.log("reload") 
        //get SP info
        $scope.SP;
        user.get(SPID).then(function(res){
            console.log("got data")
            $scope.SP = res.data.data;
    
            console.log($scope.SP)
            console.log("get req type: "+$scope.curType)
            if($scope.curType == NEW_REQUEST){
                reqids = $scope.SP.new;
            }else if($scope.curType == IN_PROGRESS){
                reqids = $scope.SP.accepted;
            }else if($scope.curType == DECLINED){
                reqids = $scope.SP.rejected;
            }else if($scope.curType == COMPLETED){
                reqids = $scope.SP.completed;
            }
            console.log(reqids)
            $scope.tasks = []
            angular.forEach(reqids, function(i, key) {
                var t = request.get(i).then(function(res){
                    var req = res.data.data 
                    console.log(req)
                    $scope.tasks.push(req)
                });
            }, $scope.tasks);


        });
    }    

    $scope.seeDetail = function(i){
        var ID = $scope.tasks[i]._id;
        console.log("id is: "+ID);

        $scope.req = $scope.tasks[i]
        $scope.curAccept = $scope.req.acceptedTime
        // show modal
        $scope.dialog = ngDialog.open({ template: './partials/requestDetail.html', className: 'ngdialog-theme-default request-dialog-width', controller: 'DetailCtrl', scope:$scope })
      
    }

    $scope.showAddService = function(){
        console.log("add service modal")
        $scope.dialog = ngDialog.open({ template: './partials/newService.html', className: 'ngdialog-theme-default request-dialog-width', controller: 'AddServiceCtrl', scope:$scope })
    }
 
    $scope.reload();

  
}])

.controller('AddServiceCtrl', ['$scope', '$http', 'service', '$routeParams', 'user', function($scope, $http, service, $routeParams, user) {

    var SPID = $routeParams.id;
    
    $scope.newService = {
        userID: SPID,
        availability: "",
        serviceName: "",
        description: ""
    };

    $scope.addService= function(){
        console.log("adding service")
        console.log($scope.newService)

        service.post(SPID, $scope.newService, function(res){
            console.log(res)
            $scope.dialog.close()            
        })

    }

}])

// Tasks Pages
.controller('DetailCtrl', ['$scope', '$http', 'request', '$routeParams', 'user', function($scope, $http, request, $routeParams, user) {

    $scope.acceptTime = function(i){
        if($scope.curType == NEW_REQUEST){
            if(!$scope.curAccept[i]){
                angular.element( document.querySelector( '#slot_'+i))
                                    .addClass('selected');
                $scope.curAccept[i] = true;

            }else if($scope.curAccept[i]){
                angular.element( document.querySelector( '#slot_'+i))
                                    .removeClass('selected');
                $scope.curAccept[i] = false;

            }

            console.log($scope.curAccept)
        }
    }

    $scope.accept = function(){
        if($scope.curType == NEW_REQUEST){
                // update request
                $scope.req.acceptedTime = $scope.curAccept;
                console.log('curAccept: ')
                console.log($scope.curAccept)
                $scope.req.status = IN_PROGRESS;
                console.log('update request')
                console.log($scope.req)
                request.update($scope.req._id, $scope.req, function(data){
                    console.log(data)
                    $scope.reload()
                    $scope.dialog.close()
                })  
                
        }

    }

    $scope.decline = function(){
        // update request
        $scope.req.status = DECLINED;
        console.log('update request')
        console.log($scope.req)
        request.update($scope.req._id, $scope.req, function(data){
            console.log(data)
            $scope.reload()
            $scope.dialog.close()
        })
    }

    $scope.complete = function(){
        // update request
        $scope.req.status = COMPLETED;
        console.log('update request')
        console.log($scope.req)
        request.update($scope.req._id, $scope.req, function(data){
            console.log(data)
            $scope.reload()
            $scope.dialog.close()            
        })
    }

    $scope.showAcceptedTime = function(){

    }


}])

.controller('NewRequestCtrl', ['$scope', '$http', '$routeParams', 'SP', 'request','user', function($scope, $http, $routeParams, SP, request, user) {
    
    var SPID = $routeParams.id;  
    $scope.SP;
    $scope.newRequest = {
        creatorID: "",
        userID: SPID,
        message: "",
        service: "",
        customerName: "",
        contactInfo: "",
        status: NEW_REQUEST, //0 new, 1 accepted, 2 rejected, 3 completed
        proposedTime: [],
        acceptedTime: [],
        createdTime: Date.now()
    };

    $scope.reload = function(){
        //query for status = $scope.curType

        console.log("reload") 
        //get SP info
        user.get(SPID).then(function(res){
            console.log("got data")
            $scope.SP = res.data.data;
    
            console.log($scope.SP)

        });
    } 

    $scope.sendRequest = function(){
        console.log("sending request")
        console.log($scope.newRequest)

        request.post(SPID, $scope.newRequest, function(data){
            console.log("sent request")
            console.log(data)
        })
    }

    $scope.reload(); 

}])

// login & signup controllers
.controller('loginCtrl', ['$scope', '$http', '$resource', 'SP', 'user', '$location', function($scope, $http, $resource, SP, user, $location) {
    $scope.password;
    $scope.email;
    $scope.login = function() {
        $http({
            method: 'POST',
            url: homeurl+'/login',
            data: $.param({
                email: $scope.email,
                password: $scope.password
            }),
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        }).success(function (data, status, headers, config) {
            
            SP.set(data.data) // set cur user
            console.log("SP: ")
            console.log(SP.get());
            $scope.curUser = SP.get()
            console.log("curUser: ")
            console.log($scope.curUser._id)
            console.log($scope.setUser($scope.curUser))
            $scope.dialog.close()
            $location.path('/serviceprovider/'+data.data._id);
         }).error(function (data, status, headers, config) {
            console.log("data: "+data);
            console.log("status: "+status);
            console.log("headers: "+headers);
            $scope.dialog.close()
         }); 
    }
}])

.controller('signUpCtrl', ['$scope', '$http', '$resource', 'SP', 'user', '$location', function($scope, $http, $resource, SP, user, $location) {
    $scope.password;
    $scope.email;
    $scope.username;
    $scope.businessName;
    $scope.signup = function() {
        $http({
            method: 'POST',
            url: homeurl+'/signup',
            data: $.param({
                email: $scope.email,
                password: $scope.password,
                username: $scope.username,
                businessName: $scope.businessName
            }),
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        }).success(function (data, status, headers, config) {
            console.log(data.data._id);
            SP.set(data.data) // set cur user
            $scope.curUser = SP.get()
            console.log($scope.setUser($scope.curUser))
            $scope.dialog.close()
            $location.path('/serviceprovider/'+data.data._id);
         }).error(function (data, status, headers, config) {
            console.log("data: "+data);
            console.log("status: "+status);
            console.log("headers: "+headers);
            $scope.dialog.close()
         }); 
    }
}])

// data passed between pages




// general controllers
.controller('TopbarCtrl', ['$scope', '$http', '$resource', 'ngDialog', 'SP', '$location', function($scope, $http, $resource, ngDialog, SP, $location) {
    $scope.curUser = null;
    $scope.showLogin = function() {
        $scope.dialog = ngDialog.open({ template: './partials/login.html', className: 'ngdialog-theme-default', controller: 'loginCtrl', scope:$scope })   
    }

    $scope.showSignup = function() {
        $scope.dialog = ngDialog.open({ template: './partials/signup.html', className: 'ngdialog-theme-default', controller: 'signUpCtrl', scope:$scope })
    }  

    $scope.viewMyQueue = function(){
        var url="/serviceprovider/"
        $scope.curUser = SP.get()
        if(!$scope.curUser){
            $scope.showLogin()
        }else{
            console.log(url+$scope.curUser._id)
            $location.path(url+$scope.curUser._id)
        }
    }
    $scope.logout = function(){
        $http({
            method: 'GET',
            url: homeurl+'/logout',
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        }).success(function (data, status, headers, config) {
            SP.set(null);
            $scope.curUser=null;
         }).error(function (data, status, headers, config) {
            console.log("data: "+data);
            console.log("status: "+status);
            console.log("headers: "+headers);
         });         
    }
    $scope.setUser = function(newval){
        $scope.curUser = newval
        console.log("showLogout: ")
        console.log($scope.curUser)
    }
    $scope.showLogout = function(){
        return ($scope.curUser==null) ? false: true;
    }
    $scope.$watch('curUser', function(){
        $scope.showLogout();
    })

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
                    <div ng-show="showLogout()" id="MyQueueBt" class="columns small-8 end" ng-click="viewMyQueue()"><a class="bt round">My Queue</a></div>
                </div>
            </div>
            <div class="float-right small-6 large-4 columns">
                <div class="float-right row" id="SignUpLoginBt" ng-hide="showLogout()">
                    <div class="columns small-6 float-right" ng-click="showSignup()"><a  class="bt round float-right">Signup</a></div>
                    <div class="columns small-4 end float-right" ng-click="showLogin()"><a class="bt round float-right">Login</a></div>
                </div>
                <div class="float-right row" id="LogoutBt" ng-show="showLogout()">
                    <div class="column small-6 float-right centertext align-self-middle">
                        <span>Hi, {{curUser.username}}</span>
                    </div>
                    <div class="columns small-4 end float-right" ng-click="logout()">
                        <a class="bt round float-right">Logout</a>
                    </div>
                </div>
            </div>
        </div>
    </div>'
  };
})
