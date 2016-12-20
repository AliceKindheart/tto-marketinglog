'use strict';

//Companies service used for companies REST endpoint
angular.module('mean.tags').factory("Tags", ['$resource', function($resource) {
    return $resource('tags/:id', {
        id: '@id'
    }, {
        update: {
            method: 'PUT'
        }
    });
}]);