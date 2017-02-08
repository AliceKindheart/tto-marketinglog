'use strict';

angular.module('mean.contacts').controller('ContactsController', ['$scope', '$stateParams', 'Global', 'Contacts', '$state', '$http', function ($scope, $stateParams, Global, Contacts, $state, $http) {
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
            //$state.go('viewCompany',{Company_name : responseid});
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
        console.log("UPDATE, $scope.contact", $scope.contact);
        //console.log("$scope.contact.Contact_notes", $scope.contact.Contact_notes);
        var contact = $scope.contact;
        contact.compname = $scope.nameofcompany;
        console.log($scope.nameofcompany);


        //contact.Company_name = company;

        //console.log("$scope.contact");
        //console.log($scope.contact);
        //if (!contact.updated) {
          //  console.log("contact didn't updated");
            contact.updated = [];
        //}
        contact.updated.push(new Date().getTime());
        contact.$update(function() {
        $state.go('viewContact',{id : contact.id});
        //$state.go('viewContact', {id: $stateParams.id});

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
            //console.log("COMPANY", company);
            $scope.nameofcompany=company.Company_name
            //console.log("nameofcompany", $scope.nameofcompany);
        });

        $scope.findcompanies();

    };




    $scope.find = function() {
        console.log("LOOKINGFOR CONTACTS!~!!!!");
        var arrayofcontacts = [];

        Contacts.query(function(contacts) {
            console.log("contactcontactcontact");
            //var contact;
            $scope.contacts = contacts;
            
            var companies = [];

            contacts.forEach(function(contact){
                if (contact.Company){
                    //$scope.company = contact.Company
                    arrayofcontacts.push(contact.Company);
                } else {
                    arrayofcontacts.push({Company_name: "None"});
                }
                $scope.companies = arrayofcontacts;
            });

            console.log("SCOPE.COMPANies", $scope.companies);
            console.log(contacts);

        });
    };

    $scope.findcompanies =  function(){
        //console.log("FINDCOMPANIES GOT CALLED");
        $scope.companies = [];
        $http.get('/companies')
        .then(function(response){
            $scope.companyresponse = response.data;
          //  console.log("$scope.companyresponse", $scope.companyresponse);
            $scope.companyresponse.forEach(function(company){
                $scope.companies.push(company.Company_name);
            });
            //console.log("$scope.companies", $scope.companies);
        });
    };

      $scope.selected = [];



    $scope.choose = function (company) {
        $scope.Company_name = company;
      };

      $scope.exists = function (company) {
        //console.log("nameofcompanychecked", $scope.nameofcompany);
        //console.log("company", company);
        if (company == $scope.nameofcompany){
            return true;
        }
      };

      $scope.choose2edit = function(company){
        //$scope.nameofcompany = company;
        $scope.nameofcompany = company;
        console.log("COMPANY, $scope.nameofcompany", $scope.nameofcompany);
      };




}]);