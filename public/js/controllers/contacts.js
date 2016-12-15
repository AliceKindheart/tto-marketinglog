'use strict';

angular.module('mean.contacts').controller('ContactsController', ['$scope', '$stateParams', 'Global', 'Contacts', '$state', function ($scope, $stateParams, Global, Contacts, $state) {
    $scope.global = Global;

    $scope.create = function() {
        var contact = new Contacts({
            Contact_name: this.Contact_name,
            Contact_email: this.Contact_email,
            Contact_phone: this.Contact_phone,
            Contact_title: this.Contact_title,
            Company_name: this.Company_name,
            Notes: this.Notes
        });
        contact.$save(function(response) {
            //$state.go('viewCompany',{Company_name : responseid});
            $state.go('viewContact',{id : response.id});
        });

        this.Contact_name = "";
        this.Contact_email = "";
        this.Contact_phone = "";
        this.Contact_title = "";
        this.Company_name = "";
        this.notes = "";
    };

    $scope.remove = function(contact) {
        console.log("remove was called");
        console.log($scope.contact);

        if (contact) {
            console.log("THERE WAS A CONTACT");
            contact.$remove();  

            for (var i in $scope.contacts) {
                if ($scope.contacts[i] === contact) {
                    console.log("that thing happened");
                    $scope.contacts.splice(i, 1);
                }
            }
        }
        else {
            console.log("hello else");
            $scope.contact.$remove();
            $state.go('contacts');
        }
    };

    $scope.update = function() {
        var contact = $scope.contact;
        console.log("$scope.contact");
        console.log($scope.contact);
        if (!contact.updated) {
            console.log("contact didn't updated");
            contact.updated = [];
        }
        contact.updated.push(new Date().getTime());
        contact.$update(function() {
        $state.go('viewContact',{id : contact.id});

        });
    };

    $scope.findOne = function() {
        var company;
        console.log("findOne contact ran");
        //console.log("$stateParams.id=");
        //console.log($stateParams.id);
        Contacts.get({
            id: $stateParams.id 
        }, function(contact) {
            company = contact.Company;
            console.log(contact);
            $scope.contact = contact;
            $scope.company = company;
            console.log("COMPATT", company);
        });
    };
    $scope.find = function() {

        console.log("LOOKINGFOR CONTACTS!~!!!!");
        Contacts.query(function(contacts) {
            console.log("contactcontactcontact");
            var contact;
            $scope.contacts = contacts;
            
            var companies = [];

            contacts.forEach(function(contact){
                if (contact.Company){
                    //$scope.company = contact.Company
                    companies.push(contact.Company);
                } else {
                    companies.push({Company_name: "None"});
                }
                $scope.companies = companies;
            });


            console.log("SCOPE.COMPANies", $scope.companies);
            console.log(contacts);

        });
    };



}]);