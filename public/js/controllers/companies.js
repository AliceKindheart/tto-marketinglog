'use strict';

angular.module('mean.companies').controller('CompaniesController', ['$scope', '$stateParams', 'Global', 'Companies', '$state', function ($scope, $stateParams, Global, Companies, $state) {
    $scope.global = Global;

    $scope.create = function() {
        var company = new Companies({
            Company_name: this.Company_name,
            notes: this.notes
        });

        company.$save(function(response) {
            $state.go('viewCompany',{Company_name : response.companies_id});
        });

        this.Company_name = "";
        this.notes = "";
    };

    $scope.remove = function(company) {
        if (company) {
            company.$remove();  

            for (var i in $scope.companies) {
                if ($scope.companies[i] === company) {
                    $scope.companies.splice(i, 1);
                }
            }
        }
        else {
            $scope.company.$remove();
            $state.go('companies');
        }
    };

    $scope.update = function() {
        var company = $scope.company;
        if (!company.updated) {
            company.updated = [];
        }
        company.updated.push(new Date().getTime());
        company.$update(function() {
        $state.go('viewCompany',{Companies_id : Companies.Companies_id});

        });
    };

    $scope.find = function() {
        Companies.query(function(companies) {
            $scope.companies = companies;
        });
    };

    $scope.findOne = function() {
        Companies.get({
            companies_id: $stateParams.companyId
        }, function(company) {
            $scope.company = company;
        });
    };
    $scope.find = function() {
        Companies.query(function(companies) {
            $scope.companies = companies;
        });
    };



}]);