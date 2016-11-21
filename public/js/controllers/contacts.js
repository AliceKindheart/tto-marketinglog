'use strict';

angular.module('mean.contacts').controller('ContactsController', ['$scope', '$stateParams', 'Global', 'Contacts', 'Companies', '$state', function ($scope, $stateParams, Global, Companies, Contacts, $state) {
    $scope.global = Global;

    $scope.create = function() {
        var contact = new Contacts({
            Contact_name: this.Contact_name,
            Notes: this.Notes
        });
        contact.$save(function(response) {
            //$state.go('viewCompany',{Company_name : responseid});
            $state.go('viewContact',{id : response.id});
        });

        this.Contact_name = "";
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
        console.log("findOne ran");
        //console.log("$stateParams.id=");
        //console.log($stateParams.id);
        Companies.get({
            id: $stateParams.id 
        }, function(contact) {
            console.log(contact);
            $scope.contact = contact;
        });
    };
    $scope.find = function() {
        Contacts.query(function(contacts) {
            console.log("contactcontactcontact");
            $scope.contacts = contacts;
            console.log(contacts);
        });
    };



}]);