'use strict';

angular.module('mean.tags').controller('TagsController', ['$scope', '$stateParams', 'Global', 'Tags', '$state', function ($scope, $stateParams, Global, Tags, $state) {
    $scope.global = Global;

     $scope.findtags =  function(){
     	$scope.tagnames = [];
        console.log("HELLOS");

        Tags.query(function(tags){
        	console.log("did it get this far?");
            $scope.tags = tags;
            console.log("TAGS", tags);

            tags.forEach(function(tag){
            	console.log("then this happened");
            	$scope.tagnames.push(tag.Tag_name);
            });
            console.log("$scope.tagnames", $scope.tagnames);

        });
    };

    

}]);
