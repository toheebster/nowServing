var mp4Controllers = angular.module('mp4Controllers', ['720kb.datepicker', 'ngResource', 'ngDialog']);


mp4Controllers
// Not require login
.controller('HomeCtrl', ['$scope', '$http', '$resource', 'ngDialog', function($scope, $http, $resource, ngDialog) {

}])

.controller('PortfolioCtrl', ['$scope', '$http', '$resource', 'user', '$routeParams', 'ngDialog', function($scope, $http, $resource, user, $routeParams, ngDialog ) {    
    ngDialog.close()
    user.get($routeParams.id)
    .success(function (data, status, headers, config) {
        $scope.user = data.data;
        console.log($scope.user);
    }).error(function (data, status, headers, config) {
        console.log(data);
    });
    // $scope.user = {
    //     _id: "1234",
    //     username: "Michael Kim",
    //     email: "michael@kim.com",
    //     businessName: "Kim's Kuts",
    //     intro: "PlanningSDLC for NetworkerIan Szetho: Product OwnerMaleek Akeju: Product ManagerSheri Lambesis: UX ExpertToheeb Okenla: Software Dev.Why should we build this system?What value will it provide?How long will it take to make this systemConsidering tech, org, & economical feasibilityFirst iteration Mobile app  ~ 60 hours",
    //     services: [
    //     {
    //         serviceName: "Iphone Fixes",
    //         availability: "Fridays Only"
    //     }, 
    //     {
    //         serviceName: "Haircuts",
    //         availability: "Fridays & Saturdays"
    //     }, 
    //     {
    //         serviceName: "Cook you a nice meal",
    //         availability: "Fridays & Saturdays"
    //     }]
    // };
}])


// Queue Pages
.controller('EditPortfolioCtrl', ['$scope', '$http', '$resource', function($scope, $http, $resource) {


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


// general controllers
.controller('TopbarCtrl', ['$scope', '$http', '$resource', 'ngDialog', function($scope, $http, $resource, ngDialog) {

    $scope.showLogin = function() {
        ngDialog.open({ template: './partials/login.html', className: 'ngdialog-theme-default', controller: 'loginCtrl' })
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
