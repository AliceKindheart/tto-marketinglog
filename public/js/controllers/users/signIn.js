'use strict';

angular.module('mean.auth').controller('signIn', ['$scope', '$window', 'Global', '$state', 'LogIn', function ($scope, $window, Global, $state, LogIn) {
    $scope.global = Global;


    $scope.signIn = function(user) {

        var logIn = new LogIn({
            email: user.email,
            password: user.password
        });

        logIn.$save(function(response) {
            if(response.status === 'success'){
                $window.location.href = '/';
            } else {
                $window.confirm("Login Information Not Correct");
            }
        });

        //$window.localStorage.setItem('user', JSON.stringify(user));
        //this.currentUser= user;
    };


}]);