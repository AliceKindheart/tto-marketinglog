'use strict';

//admin service used for users REST endpoint
angular.module('mean.admin').factory("Users", ['$resource', function($resource) {
    return $resource('users/:id', {
        id: '@id'
    },   {
        update: {
            method: 'PUT'
        }
    });
}]);

