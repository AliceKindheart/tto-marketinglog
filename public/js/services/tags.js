'use strict';

//tags service used for companies REST endpoint
angular.module('mean.tags').factory("TagsFactory", ['$resource', function($resource) {
    return $resource('/tags', 
        //id: '@id'
    {
        listtags: {
            method: 'GET'
        }
    });
}]);