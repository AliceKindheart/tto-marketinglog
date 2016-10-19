'use strict';

//Companies service used for companies REST endpoint
angular.module('mean.companies').factory("Companies", ['$resource', function($resource) {
    return $resource('companies/:id', {
        id: '@id'
    }, {
        update: {
            method: 'PUT'
        }
    });
}]);