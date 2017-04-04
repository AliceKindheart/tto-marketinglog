'use strict';

angular.module('mean.auth').controller('signUp', ['$scope', '$window', 'Global','$state', 'SignUp', function ($scope, $window, Global, $state, SignUp) {
    $scope.global = Global;


    $scope.signUp = function(newuser) {

        var signUp = new SignUp({
            username: newuser.username,
            email: newuser.email,
            first_name: newuser.first_name,
            last_name: newuser.last_name,
            password : newuser.password,
            name: newuser.first_name + " " + newuser.last_name
        });

        signUp.$save(function(response) {
            if(response.status === 'success'){
                $window.location.href = '/';
            }
        });
    };


}]);