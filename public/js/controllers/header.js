'use strict';

angular.module('mean.system').controller('HeaderController', ['$scope', 'Global', 'SignOut', '$state', function ($scope, Global, SignOut, $state) {
    $scope.global = Global;

    $scope.menu = [{
        "title": "Companies",
        "state": "companies"
    }, {
        "title": "Contacts",
        "state": "contacts"
    }, {
        "title": "Technologies",
        "state": "techs"
    }, {
        "title": "Event",
        "state": "events"
    }, {
        "title": "Add New Event",
        "state": "addEvent"
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