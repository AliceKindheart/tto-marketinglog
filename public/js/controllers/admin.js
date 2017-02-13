'use strict';

angular.module('mean.auth').controller('AdminController', ['$scope', '$window', 'Global','$state', 'SignUp', '$http', function ($scope, $window, Global, $state, SignUp, $http) {
    $scope.global = Global;

    $scope.findusers = function(){
        $http.get('/showusers')
            .then(function(response){
                $scope.users = response.data;
            })
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


}]);