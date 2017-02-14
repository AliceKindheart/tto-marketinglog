'use strict';

//admin service used for admin REST endpoint
angular.module('mean.admin').factory("AdminFactory", ['$resource', function($resource) {
    return $resource('/udpateuser', 
        //id: '@id'
    {
        update: {
            method: 'PUT'
        }
    });
}]);

