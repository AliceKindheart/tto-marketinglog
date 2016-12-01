'use strict';

//Contacts service used for contacts REST endpoint
angular.module('mean.technologies').factory("Technologies", ['$resource', function($resource) {
    return $resource('technologies/:id', {
        id: '@id'
    }, {
        update: {
            method: 'PUT'
        }
    });
}]);