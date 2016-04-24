var mp4Controllers = angular.module('mp4Controllers', ['720kb.datepicker', 'ngResource', 'ngDialog']);


mp4Controllers
// Not require login
.controller('HomeCtrl', ['$scope', '$http', '$resource', 'ngDialog', function($scope, $http, $resource, ngDialog) {

}])

.controller('PortfolioCtrl', ['$scope', '$http', '$resource', function($scope, $http, $resource) {


}])


// Queue Pages
.controller('EditPortfolioCtrl', ['$scope', '$http', '$resource', function($scope, $http, $resource) {


}])

.controller('QueueCtrl', ['$scope', '$http', '$resource', function($scope, $http, $resource) {


}])



// Tasks Pages
.controller('DetailCtrl', ['$scope', '$http', '$resource', function($scope, $http, $resource) {


}])

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
    <div class="small-12 fixed navbar" ng-controller = "TopbarCtrl">
              <div class="small-12 small-centered columns">
            <div class="float-left small-6 large-4 columns">
                <div class="row">
                    <div class="columns small-4"><a href="#/" class="button round">Service</a></div>
                    <div class="columns small-8 end"><a href="#/" class="button round">My Queue</a></div>
                </div>
            </div>
            <div class="float-right small-6 large-4 columns">
                <div class="float-right row">
                    <div class="columns small-6 float-right" ng-click="showSignup()"><a  class="button round float-right">Signup</a></div>
                    <div class="columns small-4 end float-right" ng-click="showLogin()"><a class="button round float-right">Login</a></div>
                </div>

            </div>
        </div>
    </div>'
  };
})
