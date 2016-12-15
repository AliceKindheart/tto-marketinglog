'use strict';

angular.module('mean.technologies').controller('TechController', ['$scope', '$stateParams', 'Global', 'Technologies', '$state', function ($scope, $stateParams, Global, Technologies, $state) {
    $scope.global = Global;

    $scope.create = function() {
        var technology = new Technologies({
            Tech_RUNumber: this.Tech_RUNumber,
            Tech_name: this.Tech_name,
            Tech_inventor: this.Tech_inventor,
            Tag_name: this.Tag_name,
            Tech_marketer: this.Tech_marketer
        });
        technology.$save(function(response) {
            //$state.go('viewCompany',{Company_name : responseid});
            $state.go('viewTech',{id : response.id});
        });

        this.Tech_RUNumber = "";
        this.Tech_name = "";
        this.Tech_inventor = "";
        this.Tag_name = "";
        this.Tech_marketer = "";
    };

    $scope.remove = function(technology) {
        console.log("removetech was called");
        console.log($scope.technology);

        if (technology) {
            console.log("THERE WAS A TECHNOLOGY");
            technology.$remove();  

            for (var i in $scope.technologies) {
                if ($scope.technologies[i] === technology) {
                    console.log("that thing happened");
                    $scope.technolgies.splice(i, 1);
                }
            }
        }
        else {
            console.log("hello else");
            $scope.technology.$remove();
            $state.go('techs');
        }
    };

    $scope.update = function() {
        var technology = $scope.technology;
        console.log("$SCOPE>TAG_NAME", $scope.Tag_name);
        var tagname = $scope.Tag_name;

    //    console.log("$scope.technology");
      //  console.log($scope.technology);
    //    if (!technology.updated) {
      //      console.log("technology didn't updated");
        
        if(tagname) {
            console.log("THERE WAS A TAGNAME");
            technology.Tag_name = tagname;
        }

            technology.updated = [];
        
        technology.updated.push(new Date().getTime());
        technology.$update(function() {
        $state.go('viewTech',{id : technology.id});

        });
    };

    $scope.findOne = function() {
        console.log("findOneTechnology ran");
        console.log("$stateParams.id=");
        console.log($stateParams.id);
        Technologies.get({
            id: $stateParams.id 
        }, function(technology) {
            console.log(technology);
            $scope.technology = technology;
        });
    };

    
    $scope.find = function() {
        Technologies.query(function(technologies) {
            console.log("findtechfindtechnology");
            $scope.technologies = technologies;
            console.log("TECHNOLOGIES:");
            console.log(technologies);
        });
    };



}]);