'use strict';

angular.module('mean.auth').controller('AdminController', ['$scope', '$window', 'Global','$state', 'SignUp', '$http', '$stateParams', function ($scope, $window, Global, $state, SignUp, $http, $stateParams) {
    $scope.global = Global;

    $scope.findusers = function(){
        $http.get('/showusers')
            .then(function(response){
                $scope.users = response.data;
            });
    };

    $scope.user;

    $scope.findUser = function(){
        console.log($stateParams, "$stateParams");
        $http({
            url: "/user/id", 
            method: "GET",
            params: {id: $stateParams.id}
        }).then(function(response){
                $scope.user = response.data;
                console.log('$scope.user', $scope.user);
        });
    };


    $scope.signUp = function(newuser) {

        var signUp = new SignUp({
            name: newuser.name,
            email: newuser.email,
            //username : user.userName,
            password : newuser.password,
            admin: newuser.admin
        });

        signUp.$save(function(response) {
            if(response.status === 'success'){
               // $window.location.href = '/';
               $scope.findusers();
            }
        });
    };


    $scope.yes = function(){    
        $scope.user.admin = true;
        console.log("$scope.user.admin", $scope.user.admin);
    };

    $scope.no = function(){    
        $scope.user.admin = false;
        console.log("$scope.user.admin", $scope.user.admin);
    };

    $scope.updateUser = function(){
        var user = $scope.user;
        console.log("user", user);

        $http({
            url: "/updateuser", 
            method: "PUT",
            params: {
                id: $scope.user.id,
                email: $scope.user.email,
                name: $scope.user.name,
                admin: $scope.user.admin
                }
        }).then(function(){
            $state.go('adduser');
        });       
    };

    $scope.delete = function(){
        var user = $scope.user;
        console.log("user", user);

        if ($window.confirm("Are you sure you want to delete this user?")){
            $http({
            url: "/deleteuser", 
            method: "DELETE",
            params: {
                id: $scope.user.id,
                }
            }).then(function(){
                $state.go('adduser');
            });           
        } else {
            $state.go('adduser');
        }

           
    };


}]);