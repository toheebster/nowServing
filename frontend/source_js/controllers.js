var mp4Controllers = angular.module('mp4Controllers', ['720kb.datepicker', 'ngResource', 'ngDialog']);

var NEW_REQUEST = 0;
var IN_PROGRESS = 1;
var COMPLETED = 3;
var DECLINED = 2;

var homeurl = "http://localhost:8080"
var curSPID = ""
mp4Controllers
// Not require login
.controller('HomeCtrl', ['$scope','$http','$location', 'user', function($scope, $http, $location, user) {
    $scope.cancelRequest = function () {
        ngDialog.open({ template: './partials/cancelRequest.html', className: 'ngdialog-theme-default', controller: 'cancelReqCtrl' })
    };

    $scope.showUsers = function () {
        ngDialog.open({ template: './partials/searchUsers.html', className: 'ngdialog-theme-default', controller: 'searchUsersCtrl' })
    };
    
    
    $scope.email = "";
    $scope.err_mes = "";
    $scope.search = function(){
        user.findUser($scope.email).success(function(data, status){
            console.log(data);
             $location.path('/user/portfolio/'+data.data._id); 
        }).error(function(err){
            console.log("error in search : " + err);
            $scope.err_mes = err.message;
        });
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

// Not require login
.controller('PortfolioCtrl', ['$scope', '$http', 'service', 'user', '$routeParams', 'ngDialog', function($scope, $http, service, user, $routeParams, ngDialog ) {    
    var SPID = $routeParams.id
    $scope.reload = function(){
        user.get($routeParams.id)
        .success(function (data, status, headers, config) {
            $scope.user = data.data;
            console.log($scope.user);
    
            $scope.servicesid = $scope.user.services
            $scope.services=[]
            angular.forEach($scope.servicesid, function(i, key) {
                var t = service.get(i).then(function(res){
                    var serv = res.data.data 
                    console.log("serv")
                    console.log(serv)
                    $scope.services.push(serv)
                    console.log($scope.services);            
                });
            }, $scope.services); 

            $scope.img = '../userImage/' + $scope.user._id + '.jpg';
            console.log($scope.img);
    
        }).error(function (data, status, headers, config) {
            console.log(data);
        });
    }

    
    $scope.sendRequest = function(i){
        if(curSPID !== SPID){
            $scope.curService = $scope.services[i]
            console.log("curService")
            console.log($scope.curService)
            $scope.dialog = ngDialog.open({ template: './partials/newRequest.html', className: 'ngdialog-theme-default request-dialog-width', controller: 'NewRequestCtrl', scope:$scope })
        }

    }

    $scope.showEdit = function(){
        console.log("showEdit: cur / SP")
        console.log(curSPID)
        console.log(SPID)
        return (curSPID == SPID) ? true : false; 
    }

    $scope.editService = function(i){
        console.log("show edit service!")
        $scope.oldservice = $scope.services[i]
        $scope.dialog = ngDialog.open({ template: './partials/editService.html', className: 'ngdialog-theme-default request-dialog-width', controller: 'EditServiceCtrl', scope:$scope })       
    }
    
    $scope.$watch('curSPID', function(){
        $scope.showEdit();
    }) 

    $scope.showEditPortfolio = function() {
        //console.log($scope.img);
        $scope.dialog = ngDialog.open({ template: './partials/editPortfolio.html', className: 'ngdialog-theme-default', controller: 'editPortfolioCtrl', scope:$scope });

    }
    $scope.reload()
}])
.controller('editPortfolioCtrl', ['$scope', '$http', 'user', '$routeParams', '$route', function($scope, $http, user, $routeParams, $route) {

    var SPID = $routeParams.id;
    $scope.editUser = function() {
        console.log("edit profile");
        console.log($scope.user);
        user.update($scope.user, function(res){
            console.log("$scope.user");
            console.log(res);
            $scope.dialog.close();
            $route.reload();
        })

    }

}])
.controller('EditServiceCtrl', ['$scope', '$http', 'service', '$routeParams', 'user', '$route', function($scope, $http, service, $routeParams, user, $route) {

    $scope.service = angular.copy($scope.oldservice)

    $scope.updateService = function () {
        service.update($scope.service._id, $scope.service, function(data) {
            $scope.reload();
            $scope.dialog.close()
        });
    }

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

    $scope.showAddService = function(){
        console.log("add service modal")
        $scope.dialog = ngDialog.open({ template: './partials/newService.html', className: 'ngdialog-theme-default request-dialog-width', controller: 'AddServiceCtrl', scope:$scope })
    }
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
                console.log(i);
                console.log(key);
                var t = request.get(i).then(function(res){
                    var req = res.data.data 
                    $scope.tasks.push(req)
                });
            }, $scope.tasks);

            $scope.img = '../userImage/' + $scope.SP._id + '.jpg';
            console.log($scope.img);

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

.controller('NewRequestCtrl', ['$scope', '$http', '$routeParams', 'SP', 'request','user', '$compile', function($scope, $http, $routeParams, SP, request, user, $compile) {
    
    var SPID = $routeParams.id;  
    $scope.SP;
    $scope.newRequest = {
        creatorID: "",
        userID: SPID,
        message: "",
        service: $scope.curService._id,
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
            $scope.dialog.close()

        })

    }
    $scope.newInputField = function(i){
        // gets input field index
        // if it is readonly, set it to be editable
        // if is not, just return
        var myEl = angular.element(document.querySelector('#input_'+i));
        myEl.attr('readonly');
        console.log("input: "+i)
        if(myEl.attr('readonly')){

            var j = i+1
            myEl.attr('readonly', false);

            var newInput = '<div class="row" id="inputdiv_'+j+'"><input id="input_'+j+'" ng-click="newInputField('+j+')" readonly="true"></div>';
            var content = $compile(newInput)($scope);
            angular.element(document.querySelector('#inputdiv_'+i)).after(content)
        }   
    }

    // date time picker


    $scope.reload(); 

}])

.controller('loginCtrl', ['$scope', '$http', '$resource', 'SP', 'user', '$location', function($scope, $http, $resource, SP, user, $location) {
    $scope.password;
    $scope.email;
    $scope.login = function() {
        console.log("in log in");
        $http({
            method: 'POST',
            url: homeurl+'/login',
            data: $.param({
                email: $scope.email,
                password: $scope.password
            }),
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        }).success(function (data, status, headers, config) {
            
            // SP.set(data.data) // set cur user
            // console.log("SP: ")
            // console.log(SP.get());
            // $scope.curUser = SP.get()
            // console.log("curUser: ")
            // console.log($scope.curUser._id)
            console.log($scope.setUser(data.data))
            $scope.dialog.close();
            $location.path('/user/'+data.data._id);
         }).error(function (data, status, headers, config) {
            console.log("data: "+data);
            console.log("status: "+status);
            console.log("headers: "+headers);
            $scope.message = "Login unsuccessful, try again";
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
            // SP.set(data.data) // set cur user
            // $scope.curUser = SP.get()
            // console.log($scope.setUser($scope.curUser))
            $scope.getCurUser();
            $scope.dialog.close()
            $location.path('/user/'+data.data._id);
         }).error(function (data, status, headers, config) {
            console.log("data: "+data);
            console.log("status: "+status);
            console.log("headers: "+headers);
            $scope.message = "Signup unsuccessful, please try again"
         }); 
    }
}])


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
        var url="/user/"
        //$scope.curUser = SP.get()
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
            console.log("logged out")
            // SP.set(null);
            $scope.curUser=null;
            curSPID = null
         }).error(function (data, status, headers, config) {
            console.log("data: "+data);
            console.log("status: "+status);
            console.log("headers: "+headers);
         });         
    }
    $scope.setUser = function(newval){
        $scope.curUser = newval
        curSPID = newval._id
        console.log("showLogout: ")
        console.log($scope.curUser)
    }
    $scope.showLogout = function(){
        return ($scope.curUser==null) ? false: true;
    }
    $scope.$watch('curUser', function(){
        $scope.showLogout();
    })
    $scope.getCurUser = function(){
        console.log("try get logged in user")
        $http({
            method: 'GET',
            url: homeurl+'/user',
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        }).success(function (data, status, headers, config) {
            console.log("got logged in user")
            console.log(data.data)
            $scope.curUser=data.data;
            curSPID=data.data._id;
         }).error(function (data, status, headers, config) {
            console.log("get user error")
            console.log("data: "+data);
            console.log("status: "+status);
            console.log("headers: "+headers);
         });           
    }
    $scope.getCurUser();

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
.directive('checkImage', function($http) {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            attrs.$observe('ngSrc', function(ngSrc) {
                $http.get(ngSrc).success(function(){
                }).error(function(){
                    element.attr('src', '../userImage/user-default.png'); // set default image
                });
            });
        }
    }; 
})
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
                    <div class="column small-7 float-right">
                        <a class="namebt round" ng-href="#/user/portfolio/{{curUser._id}}">Hi, {{curUser.username}}</a>
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

