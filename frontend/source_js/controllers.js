var mp4Controllers = angular.module('mp4Controllers', ['720kb.datepicker', 'ngResource', 'ngDialog']);

var newRequest = 1;
var inProgress = 2;
var completed = 4;
var declined = 3;

mp4Controllers
// Not require login
.controller('HomeCtrl', ['$scope', '$http', '$resource', 'ngDialog', function($scope, $http, $resource, ngDialog) {

}])

.controller('PortfolioCtrl', ['$scope', '$http', '$resource', function($scope, $http, $resource) {


}])


// Queue Pages
.controller('EditPortfolioCtrl', ['$scope', '$http', '$resource', function($scope, $http, $resource) {


}])

.controller('QueueCtrl', ['$scope', '$http', 'request', '$routeParams', 'user', function($scope, $http, request, $routeParams, user) {
    var curType = 1;
    $scope.sortBy = '+';
    var SPID = $routeParams.id;
    var reqids = [];

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

        console.log("reload") 
        //get SP info
        var SP;
        user.get(SPID).then(function(res){
            console.log("got data")
            SP = res.data.data;
    
            console.log(SP)
            console.log("get req type: "+curType)
            if(curType == newRequest){
                reqids = SP.new;
            }else if(curType == inProgress){
                reqids = SP.accepted;
            }else if(curType == declined){
                reqids = SP.rejected;
            }else if(curType == completed){
                reqids = SP.completed;
            }
            console.log(reqids)
            angular.forEach(reqids, function(i, key) {
                var t = request.get(i, SPID).then(function(res){
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
        //$location.path('#/request/'+ID)
    }
 
    $scope.reload();
}])



// Tasks Pages
.controller('DetailCtrl', ['$scope', '$http', '$resource', '$routeParams', 'request', function($scope, $http, $resource, $routeParams, request) {
    
    var RID = $routeParams.id;

    $scope.reload = function(){
        request.get(RID, i).then(function(res){
                    $scope.req = res.data.data 
                    console.log($scope.req)
        });

    }

    $scope.reload();

}])

.controller('NewRequestCtrl', ['$scope', '$http', '$resource', 'SP', 'request', function($scope, $http, $resource, SP, request) {
    
    var SPID = $routeParams.id;  

}])

// data passed between pages




// general controllers
.controller('TopbarCtrl', ['$scope', '$http', '$resource', 'ngDialog', function($scope, $http, $resource, ngDialog) {

    $scope.showLogin = function() {
        ngDialog.open({ template: './partials/login.html', className: 'ngdialog-theme-default' })
      }

    $scope.showSignup = function() {
        ngDialog.open({ template: './partials/signup.html', className: 'ngdialog-theme-default' })
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
