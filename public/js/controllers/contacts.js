'use strict';

angular.module('mean.contacts').controller('ContactsController', ['$scope', '$stateParams', 'Global', 'Contacts', '$state', '$http', '$window', function ($scope, $stateParams, Global, Contacts, $state, $http, $window) {
    $scope.global = Global;

    $scope.create = function() {
        console.log($scope.selected, "Company_name");
        var contact = new Contacts({
            Contact_name: this.Contact_name,
            Contact_email: this.Contact_email,
            Contact_phone: this.Contact_phone,
            Contact_title: this.Contact_title,
            Company_name: this.Company_name,
            Contact_notes: this.Contact_notes
        });
        contact.$save(function(response) {
            $state.go('viewContact',{id : response.id});
        });

        this.Contact_name = "";
        this.Contact_email = "";
        this.Contact_phone = "";
        this.Contact_title = "";
        this.Company_name = "";
        this.Contact_notes = "";
    };

    $scope.remove = function(contact) {
        if ($window.confirm("Are you sure you want to delete this contact?")){
            if (contact) {
                contact.$remove();  
                for (var i in $scope.contacts) {
                    if ($scope.contacts[i] === contact) {
                        $scope.contacts.splice(i, 1);
                    }
                }
            } else {
                $scope.contact.$remove();
                $state.go('contacts');
            }
        }
    };

    $scope.update = function() {
        var contact = $scope.contact;
        contact.compname = $scope.nameofcompany;
        console.log("contact", contact);
        contact.updated = [];
        contact.updated.push(new Date().getTime());
        contact.$update(function() {
        $state.go('viewContact',{id : contact.id});
        });
    };

    $scope.findOne = function() {
        var company;
        console.log("$stateParams.id", $stateParams.id);
        Contacts.get({
            id: $stateParams.id 
        }, function(contact) {
            company = contact.Company;
            $scope.contact = contact;
            $scope.company = company;
            $scope.nameofcompany=company.Company_name;
        });

        $scope.findcompanies();
    };


    $scope.find = function() {
        var arrayofcontacts = [];

        Contacts.query(function(contacts) {
            $scope.contacts = contacts;
            var companies = [];

            contacts.forEach(function(contact){
                if (contact.Company){
                    arrayofcontacts.push(contact.Company);
                } else {
                    arrayofcontacts.push({Company_name: "None"});
                }
                $scope.companies = arrayofcontacts;
            });
        });
    };

    $scope.findcompanies =  function(){
        $scope.companies = [];
        $http.get('/companies')
        .then(function(response){
            $scope.companyresponse = response.data;
            $scope.companyresponse.forEach(function(company){
                $scope.companies.push(company.Company_name);
            });
        });
    };

      $scope.selected = [];

    $scope.choose = function (company) {
        $scope.Company_name = company;
      };

      $scope.exists = function (company) {
        if (company === $scope.nameofcompany){
            return true;
        }
      };

      $scope.choose2edit = function(company){
        $scope.nameofcompany = company;
        console.log("COMPANY, $scope.nameofcompany", $scope.nameofcompany);
      };

      $scope.searchForContact = function(){
        $http({
            method: 'GET',
            url: '/searchforcontacts',
            params: {contactname: $scope.contactname}
        }).then(function(resp){
            console.log("response", resp.data);
            $scope.contacts = resp.data;
        });
      };

}]);