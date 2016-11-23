'use strict';

angular.module('mean.system').controller('HeaderController', ['$scope', 'Global', 'SignOut', '$state', function ($scope, Global, SignOut, $state) {
    $scope.global = Global;

    $scope.menu = [{
        "title": "Companies",
        "state": "companies"
    }, {
        "title": "Add New Company",
        "state": "addCompany"
    },
    {
        "title": "Add New Contact",
        "state": "addContact"
    }, {
        "title": "Contacts",
        "state": "contacts"
    }];
    
    $scope.isCollapsed = false;

    $scope.SignOut = function(){
        SignOut.get(function(response){
            if(response.status === 'success'){
                $scope.global = null;
                $state.go('home');
            }
        });
    };


}]);