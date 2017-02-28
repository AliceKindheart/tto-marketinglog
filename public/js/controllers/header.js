'use strict';

angular.module('mean.system').controller('HeaderController', ['$scope', 'Global', 'SignOut', '$state', '$http', function ($scope, Global, SignOut, $state, $http) {
    $scope.global = Global;

    $scope.menu = [{
        "title": "Companies",
        "state": "companies"
    }, {
        "title": "Contacts",
        "state": "contacts"
    }, {
        "title": "Marketing Campaigns",
        "state": "techs"
    }];
    
    $scope.isCollapsed = false;

    $scope.isAdmin = function(){
        $http.get('/isadmin').then(function(response){
            if(response.isadmin){
                return true;
            }
        });
    };

    $scope.SignOut = function(){
        SignOut.get(function(response){
            if(response.status === 'success'){
                $scope.global = null;
                $state.go('home');
            }
        });
    };

    $scope.Addtags = function(){
        $state.go('addtags');
    };

    $scope.addUser = function(){
        $state.go('adduser');
    };


}]);