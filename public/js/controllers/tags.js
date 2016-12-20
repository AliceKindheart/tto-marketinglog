'use strict';

angular.module('mean.tags').controller('TagsController', ['$scope', '$stateParams', 'Global', 'Tags', '$state', function ($scope, $stateParams, Global, Tags, $state) {
    $scope.global = Global;

     $scope.find =  function(){
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

    $scope.create = function() {
        var company = new Companies({
            Company_name: this.Company_name,
            Notes: this.Notes,
            Tag_name: this.Tag_name
        });
        company.$save(function(response) {
            //$state.go('viewCompany',{Company_name : responseid});
            $state.go('viewCompany',{id : response.id});
        });

        this.Company_name = "";
        this.notes = "";
        this.Tag_name = "";
    };

}]);
