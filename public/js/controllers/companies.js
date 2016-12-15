'use strict';

angular.module('mean.companies').controller('CompaniesController', ['$scope', '$stateParams', 'Global', 'Companies', '$state', function ($scope, $stateParams, Global, Companies, $state) {
    $scope.global = Global;

    $scope.gettags =  function(){
        console.log("HELLOGETTAGS");
        Companies.get(function(tags){
            $scope.tags = tags;
            console.log("TAGS", tags);
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

    $scope.remove = function(company) {
        console.log("remove was called");
        console.log($scope.company);

        if (company) {
            console.log("THERE WAS A COMPANY");
            company.$remove();  

            for (var i in $scope.companies) {
                if ($scope.companies[i] === company) {
                    console.log("that thing happened");
                    $scope.companies.splice(i, 1);
                }
            }
        }
        else {
            console.log("hello else");
            $scope.company.$remove();
            $state.go('companies');
        }
    };

    $scope.update = function() {
        var company = $scope.company;
        
        console.log("$SCOPE.TAG_NAME", $scope.Tag_name);

        var tagname = $scope.Tag_name;

        if(tagname) {
            console.log("THERE WAS A TAGNAME");
            company.Tag_name = tagname;
        }
            
       // console.log("$scope.company", company);
       // if (!company.updated) {
         //   console.log("company didn't updated");
            company.updated = [];
       // }
            company.updated.push(new Date().getTime());
            company.$update(function() {
            $state.go('viewCompany',{id : $stateParams.id});
        });
    };


    $scope.findOne = function() {
        console.log("findOne ran");
        console.log("$stateParams.id=");
        console.log($stateParams.id);
        Companies.get({
            id: $stateParams.id 
        }, function(company) {
            console.log(company);
            $scope.company = company;
        });
    };

    
    $scope.find = function() {
        Companies.query(function(companies) {
            console.log("findfindfind");
            $scope.companies = companies;
            console.log(companies);
        });
    };



}]);