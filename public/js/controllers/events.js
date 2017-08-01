'use strict';

angular.module('mean.events').controller('EventController', ['$window', '$filter', '$scope', '$http', '$stateParams', 'Global', 'Technologies', 'Events', '$state', function ($window, $filter, $scope, $http, $stateParams, Global, Technologies, Events, $state) {
    $scope.global = Global;

    $scope.addressees=[];
    $scope.comps = [];
    $scope.cntcts = [];
    $scope.emails=[];
    $scope.methods = ["Phone", "Email", "Meeting"];   
    $scope.selected = ["None"];
    $scope.selectedcompanies =[];
    $scope.selectedcontacts=[];
    $scope.outcomes = ["In review", "Not interested", "No response", "Other"];
    $scope.numberofoutcomes = $scope.outcomes.length;
    $scope.usernames=[];
    $scope.yesno = ["Yes", "No"];

    $scope.choose = function(comp){
       // console.log("stupidchoosefunctionran");
        $scope.company = comp;
     //   console.log("$scope.company", $scope.company);
        var company = $scope.company;

        $http({
            method: 'GET',
            url: '/findcompanycontacts',
            params: {Company_name: company}
        }).then(function(company){
            $scope.company = company.data;
            //console.log("COMpanyfound", $scope.company);
            $scope.contacts = $scope.company.Contacts;
            //console.log($scope.contacts, "$scope.contacts");
            $scope.contactschunked = $scope.chunk($scope.contacts, 3);
        });
        $scope.event.company = comp;
       // $scope.event.CompanyId = comp.id;
    }; 

    $scope.chooseuser = function(user){
        console.log("USER: ", user);
        $scope.event.newusername=user;
        $scope.event.userchange=true;
    }; 

    $scope.chunk = function(arr, size){
        var newArr =[];
        for (var i=0; i<arr.length; i+=size) {
            newArr.push(arr.slice(i, i+size));
        }
        return newArr;
    };

    $scope.contacts = function(event){
        //console.log(event.Contacts);
        var names=[];
        for (var x=0; x<event.Contacts.length; x++){ 
            if (event.Contacts[x].length===0){
              //  console.log("triggered");
                names.push(["None"]);
            } else {
                names.push(event.Contacts[x].Contact_name);
               // console.log("contactname", event.Contacts[x].Contact_name);
            } 
        }
        names = names.join(", ");
        //console.log ("names", names, typeof names);
        event.names = names;
        $scope.eventcontacts =names;
        //console.log("$scope.eventcontacts", $scope.eventcontacts);
        if ($scope.contacts.length>=3) {
          //  console.log("SHORT");
            $scope.eventcontactschunked=$scope.chunk($scope.eventcontacts, 3);
        } else {
            $scope.contactschunked = $scope.contacts;
        }
    };

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
            Event_outcome: this.Event_outcome,
            FollowedUp: false
        });
         //console.log("DATEFORMAT: ", event.Event_date);
         //console.log("DATEtype: ", typeof event.Event_date);
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
        this.FollowedUp = "";
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
                Event_outcome: this.Event_outcome,
                Followedup: false
            });

            event.$save(function(response) {
                console.log("response", response);
            });  
            $scope.cntcts = [];     
        }
        $state.go('techs');     
    };

    $scope.editoutcome = function (outcome) {
        $scope.event.Event_outcome = outcome;
        console.log("NEWOUTCOME", $scope.event.Event_outcome);
    };

    $scope.exists = function (tag, list) {
        return list.indexOf(tag) > -1;
    };

    $scope.findCompanies = function() {
        $http({
            method: 'GET',
            url: '/companiesforevent'
        }).then(function(response){
            $scope.companies = response.data;
            $scope.companynames = [];
            //console.log("$scope.companies", $scope.companies);
            response.data.forEach(function(company){
                $scope.companynames.push(company.Company_name);
            });
        //console.log("companynames", $scope.companynames);
            $scope.chunkedcompanies = $scope.chunk($scope.companynames, 3);
        });            
    };

    $scope.findCompanies2 = function() {
        $http({
            method: 'GET',
            url: '/companiesforevent'
        }).then(function(response){
            $scope.companies = response.data;
            $scope.companynames = [];
            //console.log("$scope.companies", $scope.companies);         
            $scope.chunkedcompanies = $scope.chunk($scope.companies, 3);
        });            
    };
    
    $scope.findCompaniesToEditEvent=function(){
        $scope.findCompanies();
        $scope.choose();
    };

    $scope.findEvent = function() {
        Events.query(function(events) {
            //console.log("findeventfindevent");
            $scope.events = events;
            //console.log(events);
        });
    };

    $scope.findOneEvent = function() {
       // console.log("findoneeventran");
        Events.get({
            id: $stateParams.id 
        }, function(response) {
            //console.log("response", response);
            $scope.event = response;
           // console.log("$scope.event", $scope.event);
            $scope.contacts(response);
           // console.log("stupidateformatlookslike: ", $scope.event.Event_date);
           // console.log("typeofstupid: ", typeof $scope.event.Event_date);
            

            $scope.event.Event_date = new Date($scope.event.Event_date);
            $scope.event.Event_followupdate = new Date($scope.event.Event_followupdate);
             //$scope.event.Event_date=($scope.event.Event_date | date:'MM/dd/yyyy');
            
            if ($scope.event.FollowedUp===true){
          //      console.log("saysfollowedup=true");
                $scope.event.Followedupanswer="Yes";
             //   console.log("followedupanswerisnow:", $scope.event.Followedupanswer);
            } else if ($scope.event.FollowedUp===false){
                $scope.event.Followedupanswer="No";
             //   console.log("saysfollowedup=true");
            }

            if ($scope.event.Event_flag===true){
                $scope.event.flaganswer="Yes";
            } else {
                $scope.event.flaganswer="No";
            }

            $scope.event.CompanyId=$scope.event.Company.id;
            console.log("$scope.eventonload", $scope.event);

            
        });
        $scope.Edit = false;
        $scope.FollowUp = false;
        
        $scope.findusers();
    };

    $scope.findusers = function(){
        $http.get('/showusers')
            .then(function(response){
                $scope.users = response.data;
               // console.log("length", $scope.users.length, "$scope.users", $scope.users);
                for (var x=0; x<$scope.users.length; x++){
                   // console.log("$scope.users[x]", $scope.users[x]);
                    $scope.usernames.push($scope.users[x].name)
                }

           // console.log("$scope.usernames", $scope.usernames);
            $scope.chunkedusernames=$scope.chunk($scope.usernames,3);


            });
    };

    $scope.followedup = function(answer){
        if (answer==="Yes"){
            $scope.event.Followedupanswer=true;
        } else if (answer==="No"){
            $scope.event.Followedupanswer=false;
        
        }
        //$scope.event.Followedupanswer = answer;
        console.log("FOLLLOWEDUPANSWEER", $scope.event.Followedupanswer);
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

    $scope.gettechandcomp = function(){
        $http({
            method: 'GET',
            url: 'findteck',
            params: {TechId: $stateParams.TechId}
        }).then(function(teck){
            $scope.technology=teck.data;
            console.log("teck", $scope.technology);
        });

        $http({
            method: 'GET',
            url: 'findkomp',
            params: {CompId: $stateParams.CompId}
        }).then(function(komp){
            $scope.kompany=komp.data;
            console.log("komp", $scope.kompany);
        });
    };

    $scope.removeEvent = function(event) {
        console.log("removeevent was called");
        console.log($scope.event);

        if ($window.confirm("Are you sure you want to delete this event?")){
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

    $scope.selectmethod2 = function (method){
        $scope.event.Event_method = method;
        if(method==="Email"){
            $scope.email=true;
        } else {
            $scope.email=false;
        }
        console.log("newmethod", $scope.event.Event_method, typeof $scope.event.Event_method);
        console.log("revisedevent", $scope.event);
    }; 

    $scope.selectoutcome = function (outcome){
        $scope.Event_outcome = outcome;
    };

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
        window.open('mailto:' + $scope.emails + '?subject=' + $scope.technology.Tech_name + '&body=Dear ' + $scope.addressees + ", \n Any interest in " + $scope.technology.Tech_name + "? It's really good and I think you might like it.");       
    };

    $scope.sendemailandsubmit=function(){
        $scope.createEvent();
        $scope.sendemail();
    };

    $scope.sendemailandsubmit2=function(){
        $scope.createMultEvent();
        $scope.sendemail();
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

    $scope.showEdit = function(){
        $scope.Edit = true;
        $scope.FollowUp = false;
    };

    $scope.showFollowUp = function(){
        console.log("SHOWFOLLOWUP");
        $scope.FollowUp = true;
        $scope.Edit = false;
    };

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

    $scope.updateEvent = function() {
        

        var event = $scope.event;
        event.updated = [];
        event.updated.push(new Date().getTime());
        
        event.$update(function() {
        //console.log("response", response.data);
        }).then(function(){
            $scope.Edit=false;
            $state.go('viewEvent',{id : event.id});
        });
    };

    $scope.checkifnewuser = function(){
         //find user object if a new user has been selected
        if ($scope.event.userchange===true){
            console.log("USERCHANGED!");
            $http({
                method: 'GET',
                url: '/findnewuser',
                params: {name: $scope.event.newusername}
            }).then(function(user){
                console.log("What came back: ", user.data);
                $scope.event.newuser = user.data;
                


             
                $scope.fixthedateformat();
                console.log("$scope.event typeof", typeof $scope.event, "$scope.event", $scope.event);

                
                
                
            }).then(function(){
                //$scope.updateEvent();
                //$scope.updateEvent();
                console.log('superstupid');
            });
        } else {
            console.log("ELLLLLLLLLLLLLSSSSSSSSSSSSEEEEEEEEEEE");
           //$scope.fixthedateformatandupdate();
            //console.log("$scope.event typeof", typeof $scope.event, "$scope.event", $scope.event);
            $scope.updateEvent();
            
        }
    };


    $scope.fixthedateformatandupdate= function(){
        $scope.event.Event_date = new Date($scope.event.Event_date);
        //console.log("new eventdate: ", $scope.event.Event_date);
        
        $scope.event.Event_date = $filter('date')($scope.event.Event_date, "yyyy-MM-dd");
       // console.log("typeTYPEPEPEPEPEP ofnew eventdate: ", typeof $scope.event.Event_date);
        $scope.event.Event_date = new Date($scope.event.Event_date);
        //console.log("typeTYPEPEPEPEPEP ofnew eventdate: ", typeof $scope.event.Event_date);
        //$scope.event.Event_followupdate = $filter('date')($scope.event.Event_followupdate, "yyyy-MM-dd");
        $scope.event.Event_followupdate = new Date($scope.event.Event_followupdate);
         //console.log("UPDATEDEVENTT", $scope.event);
        $scope.event.Event_followupdate = $filter('date')($scope.event.Event_followupdate, "yyyy-MM-dd");
        $scope.event.Event_followupdate = new Date($scope.event.Event_followupdate);
        $scope.updateEvent();
    };

        
        


  



   

    
    

    


    

    


    

}]);