'use strict';

//Events service used for events REST endpoint
angular.module('mean.events').factory("Events", ['$resource', function($resource) {
    return $resource('events', {
        id: '@id'
    }, {
        update: {
            method: 'PUT'
        }
    });
}]);