var app = angular.module('mp4', ['ngRoute', 'mp4Controllers', 'mp4Services', '720kb.datepicker', 'ngDialog']);

app.config(['$routeProvider','$locationProvider', function($routeProvider, $locationProvider) {
  $routeProvider.
  when('/', {
    templateUrl: 'partials/home.html',
    controller: 'HomeCtrl'
  }).
  when('/serviceprovider/portfolio/:id', {
    templateUrl: './partials/portfolio.html',
    controller: 'PortfolioCtrl'
  }).    

  // logged in
  when('/serviceprovider/edit/:id', {
    templateUrl: 'partials/edit_portfolio.html',
    controller: 'EditPortfolioCtrl'
  }).    
  when('/serviceprovider/:id/', {
    templateUrl: './partials/queue.html',
    controller: 'QueueCtrl'
  }).    
  when('/task/:id', {
    templateUrl: './partials/taskDetail.html',
    controller: 'DetailCtrl'
  }).

  otherwise({
    redirectTo: '/'
  });

/*  $locationProvider.html5Mode({
    enabled: true,
    requireBase: false
  });
*/
}]);

app.run(function($rootScope){
    $rootScope.$apply($(document).foundation());
});