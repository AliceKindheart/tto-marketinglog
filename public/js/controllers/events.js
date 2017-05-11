'use strict';

angular.module('mean.events').controller('EventController', ['$scope', '$http', '$stateParams', 'Global', 'Technologies', 'Events', '$state', function ($scope, $http, $stateParams, Global, Technologies, Events, $state) {
    $scope.global = Global;

    $scope.createEvent = function() {
        var event = new Events({
            Event_date: this.Event_date,
            Event_notes: this.notes,
            Company: this.company,
            Contacts: this.selected,
            Technology: this.technology,
            Event_flag: this.Event_flag,
            Event_followupdate: this.followupdate, 
            Event_method: this.Event_method, 
            Event_outcome: this.Event_outcome
        });
        event.$save(function(response) {
            console.log("response", response);
            //$state.go('viewCompany',{Company_name : responseid});
            $state.go('viewTech',{id: response.TechnologyId});
        });

        this.Event_date = "";
        this.Event_notes = "";
        this.company = "";
        this.contacts = "";
        this.flag = "";
        this.followupdate = "";
        this.Event_outcome = "";
    };

    $scope.createMultEvent = function() {
        for (var x=0; x<$scope.selectedcompanies.length; x++){
            $scope.compny = $scope.selectedcompanies[x];

            for (var y=0; y<$scope.selectedcontacts.length; y++){
                
                if($scope.selectedcontacts[y].CompanyId===$scope.compny.id){
                    $scope.cntcts.push($scope.selectedcontacts[y]);
                }

            }
            console.log("cntctstosave", $scope.cntcts);

            var event = new Events({
                Event_date: this.Event_date,
                Event_notes: this.notes,
                Company: this.compny,
                Contacts: this.cntcts,
                Technology: this.technology,
                Event_flag: this.Event_flag,
                Event_followupdate: this.followupdate, 
                Event_method: this.Event_method, 
                Event_outcome: this.Event_outcome
            });

            event.$save(function(response) {
                console.log("response", response);
            });  
            $scope.cntcts = [];     
        }
        $state.go('techs');
      
    };

    $scope.methods = ["Phone", "Email", "Meeting"];

    $scope.yesno = ["Yes", "No"];

    $scope.outcomes = ["In review", "Not interested", "No response", "Other"];

    

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
            $state.go('techs');
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
       // console.log("findOneEvent ran");
       // console.log("$stateParams.id=");
       // console.log($stateParams.id);
        Events.get({
            id: $stateParams.id 
        }, function(response) {
            //console.log("response", response);
            $scope.event = response;
            $scope.contacts(response);
            $scope.event.Event_date = new Date($scope.event.Event_date);
            //$scope.event.Event_date=($scope.event.Event_date | date:'MM/dd/yyyy');
        });
    };



    $scope.contacts = function(event){
        //console.log(event.Contacts);
        var names=[];
        for (var x=0; x<event.Contacts.length; x++){ 
            if (event.Contacts[x].length===0){
                console.log("triggered");
                names.push(["None"]);
            } else {
                names.push(event.Contacts[x].Contact_name);
               // console.log("contactname", event.Contacts[x].Contact_name);
            } 
        }
        names = names.join(", ");
        //console.log ("names", names, typeof names);
        event.names = names;
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

    $scope.comps = [];
    $scope.cntcts = [];

//    $scope.choosemany = function(comp){
        //$scope.comps.push(comp);
        
  //      console.log("$scope.comps", $scope.comps, typeof $scope.comps);

    //    $http({
      //      method: 'GET',
        //    url: '/findcompanycontacts',
          //  params: {Company_name: comp}
//        }).then(function(company){
  //          $scope.comps.push(company.data);
            //console.log("COMpanyfound", $scope.comps.Contacts);
    //        var cmpny = company.data;
            //var temp =$scope.comps.Contacts;
      //      console.log("cmpny.Contacts", cmpny.Contacts);
        //    $scope.contactschunked = $scope.chunk($scope.cntcts, 3);
    //    });


//    }
    $scope.findCompanies2 = function() {
        $http({
            method: 'GET',
            url: '/companiesforevent'
        }).then(function(response){
            $scope.companies = response.data;
            $scope.companynames = [];
            console.log("$scope.companies", $scope.companies);
            
            $scope.chunkedcompanies = $scope.chunk($scope.companies, 3);
           // response.data.forEach(function(company){
             //   $scope.companynames.push(company.Company_name);
            //});
//console.log("companynames", $scope.companynames);
            //$scope.chunkedcompanies = $scope.chunk($scope.companynames, 3);
        });            
    };
    
    $scope.selectedcompanies =[];

    $scope.toggleCompanies = function (company,selected) {
        $scope.selectedcompanynames=[];
        $scope.contacts = [];
        $scope.contactinfo = [];
        //console.log("$scope.companies", $scope.companies);
        
        var idx = selected.indexOf(company);
        var idx2 = $scope.selectedcompanies.indexOf(company);
        console.log("idx", idx);
        if (idx > -1) {
          selected.splice(idx, 1);
          $scope.selectedcompanies.splice(idx2,1);
        }
        else {
          selected.push(company);
          $scope.selectedcompanies.push(company);
        }
        console.log("selected", selected);
        console.log("$scope.selectedcompanies", $scope.selectedcompanies);

        //get contact objects into a separate array
        for (var x=0; x<$scope.selectedcompanies.length; x++){
            if(typeof $scope.selectedcompanies[x]==="object"){
                $scope.contacts.push($scope.selectedcompanies[x].Contacts);
                $scope.selectedcompanynames.push(selected[x].Company_name);
            }
        }
        console.log("$scope.contacts", $scope.contacts);
        //console.log("$scope.selectedcompanynames", $scope.selectedcompanynames);

        if($scope.contacts!=="undefined"){
            var temp = [];
            for (var y=0; y<$scope.contacts.length; y++){
                for (var z=0; z<$scope.contacts[y].length; z++){
                    temp.push($scope.contacts[y][z]);
                    //$scope.contactnames.push($scope.contacts[y][z].Contact_name);
                }
                $scope.contactinfo.push(temp);
                temp=[];
            }
            //$scope.contactnames = $scope.chunk($scope.contactnames, 3);
        }


      };

//    $scope.select = function(contact){
  //      $scope.contact = contact;
  //  };     

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
        if(method==="Email"){
            $scope.email=true;
        } else {
            $scope.email=false;
        }
    }; 

    $scope.selectoutcome = function (outcome){
        $scope.Event_outcome = outcome;
    };

    $scope.selected = ["None"];

    $scope.toggle = function (contact, selected) {
        var idx = selected.indexOf(contact);
        var idx2 = $scope.selectedcontacts.indexOf(contact);
        console.log("idx", idx);
        if (idx > -1) {
          selected.splice(idx, 1);
        }
        else {
          selected.push(contact);
        }

        if (idx2 > -1) {
          $scope.selectedcontacts.splice(idx2, 1);
        }
        else {
          $scope.selectedcontacts.push(contact);
        }



        console.log("selected", selected);
    };

      $scope.selectedcontacts=[];

      $scope.toggle2 = function (contact, selected) {
        var idx = selected.indexOf(contact);
        var idx2 = $scope.selectedcontacts.indexOf(contact);
        console.log("idx", idx);
        if (idx > -1) {
          selected.splice(idx, 1);
        }
        else {
          selected.push(contact);
        }

        if (idx2 > -1){
            $scope.selectedcontacts.splice(idx2,1);
        } else {
            $scope.selectedcontacts.push(contact);
        }

        console.log("$scope.contactinfo", $scope.contactinfo);
        console.log("selected", selected);
    };

    $scope.exists = function (tag, list) {
        return list.indexOf(tag) > -1;
    };

    $scope.emails=[];
    $scope.addressees=[];

    
    $scope.sendemailandsubmit=function(){
        $scope.createEvent();
        $scope.sendemail();
    }

    $scope.sendemailandsubmit2=function(){
        $scope.createMultEvent();
        $scope.sendemail();
    }


    $scope.sendemail = function(){
        //console.log("hello");
        
        //console.log($scope.selectedcontacts, "$scope.selectedcontacts");
        //$scope.emailbody =;
        $scope.createEvent();
        for(var x=0; x<$scope.selectedcontacts.length; x++){
            //console.log("$scope.selectedcontacts[x].Contact_email", $scope.selectedcontacts[x].Contact_email);
            $scope.emails.push($scope.selectedcontacts[x].Contact_email);
            $scope.addressees.push($scope.selectedcontacts[x].Contact_name);
            //console.log("$scope.addressees", $scope.addressees);

        }
        $scope.emails = $scope.emails.join("; ");
        $scope.addressees=$scope.addressees.join(", ");
        window.open('mailto:' + $scope.emails + '?subject=' + $scope.technology.Tech_name + '&body=Dear ' + $scope.addressees + ", \n Any interest in " + $scope.technology.Tech_name + "?");

        
        //console.log("Finish");
        //console.log("$scope.emails", $scope.emails, "$scope.technology", $scope.technology);
        

        
    };


    

}]);