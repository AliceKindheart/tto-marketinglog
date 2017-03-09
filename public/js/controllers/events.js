'use strict';

angular.module('mean.events').controller('EventController', ['$scope', '$http', '$stateParams', 'Global', 'Technologies', 'Events', '$state', function ($scope, $http, $stateParams, Global, Technologies, Events, $state) {
    $scope.global = Global;

    $scope.createEvent = function() {
        var event = new Events({
            Event_date: this.Event_date,
            Event_notes: this.notes,
            Company: this.company,
            Contacts: this.contact,
            Technology: this.technology,
            Event_flag: this.Event_flag,
            Event_followupdate: this.followupdate, 
            Event_method: this.Event_method
        });
        event.$save(function(response) {
            //$state.go('viewCompany',{Company_name : responseid});
            $state.go('techs');
        });

        this.Event_date = "";
        this.Event_notes = "";
        this.company = "";
        this.contacts = "";
        this.flag = "";
        this.followupdate = "";
    };

    $scope.methods = ["Phone", "Email", "Meeting"];

    $scope.yesno = ["Yes", "No"];

    $scope.outcomes =["Waiting to hear", "Possibly interested", "Not interested", "Other"];

    $scope.numberofoutcomes = $scope.outcomes.length;

    $scope.removeEvent = function(event) {
        console.log("removeevent was called");
        console.log($scope.event);

        if (event) {
            console.log("THERE WAS AN EVENT");
            event.$remove();  

            for (var i in $scope.events) {
                if ($scope.events[i] === event) {
                    console.log("that thing happened");
                    $scope.events.splice(i, 1);
                }
            }
        }
        else {
            console.log("hello event else");
            $scope.event.$remove();
            $state.go('events');
        }
    };

    $scope.updateEvent = function() {
        var event = $scope.event;
        console.log("$scope.event");
        console.log($scope.event);
        if (!event.updated) {
            console.log("event didn't updated");
            event.updated = [];
        }
        event.updated.push(new Date().getTime());
        event.$update(function() {
        $state.go('viewEvent',{id : event.id});

        });
    };

    $scope.findOneEvent = function() {
        console.log("findOneEvent ran");
        console.log("$stateParams.id=");
        console.log($stateParams.id);
        Events.get({
            id: $stateParams.id 
        }, function(event) {
            console.log(event);
            $scope.event = event;
        });
    };

    $scope.findEvent = function() {
        Events.query(function(events) {
            console.log("findeventfindevent");
            $scope.events = events;
            console.log(events);
        });
    };

    $scope.findCompanies = function() {
        $http({
            method: 'GET',
            url: '/companiesforevent'
        }).then(function(response){
            $scope.companies = response.data;
            $scope.companynames = [];
            console.log("$scope.companies", $scope.companies);
            response.data.forEach(function(company){
                $scope.companynames.push(company.Company_name);
            });
//console.log("companynames", $scope.companynames);
            $scope.chunkedcompanies = $scope.chunk($scope.companynames, 3);
        });            
    };

    $scope.gettech = function(){
        $http({
            method: 'GET', 
            url: 'findtech',
            params: {id: $stateParams.id}
        }).then(function(tec){
            $scope.technology=tec.data;
            console.log("technoll", $scope.technology);
        });
    };


    $scope.chunk = function(arr, size){
        var newArr =[];
            for (var i=0; i<arr.length; i+=size) {
                newArr.push(arr.slice(i, i+size));
            }
            return newArr;
    };

    $scope.choose = function(comp){
        $scope.company = comp;
        console.log("$scope.company", $scope.company);
        var company = $scope.company;

        $http({
            method: 'GET',
            url: '/findcompanycontacts',
            params: {Company_name: company}
        }).then(function(company){
            $scope.company = company.data;
            console.log("COMpanyfound", $scope.company);
            $scope.contacts = $scope.company.Contacts;
            console.log($scope.contacts, "$scope.contacts");
            $scope.contactschunked = $scope.chunk($scope.contacts, 3);
        });
    }; 

    $scope.select = function(contact){
        $scope.contact = contact;
    };     

    $scope.setfollowupflag = function(answer){
        if(answer==="Yes"){
            $scope.flagyes = true;
            $scope.Event_flag = true;
        } else {
            $scope.flagyes = false;
            $scope.Event_flag = false;
        }
    }; 

    $scope.selectmethod = function (method){
        $scope.Event_method = method;
    }; 
    

}]);