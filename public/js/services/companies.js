'use strict';

//Companies service used for companies REST endpoint
angular.module('mean.companies').factory("Companies", ['$resource', function($resource) {
    return $resource('companies/:companies_id', {
        companies_Id: '@id'
    }, {
        update: {
            method: 'PUT'
        }
    });
}]);