'use strict';

//Contacts service used for contacts REST endpoint
angular.module('mean.contacts').factory("Contacts", ['$resource', function($resource) {
    return $resource('contacts/:id', {
        id: '@id'
    }, {
        update: {
            method: 'PUT'
        }
    });
}]);