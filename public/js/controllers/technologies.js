'use strict';

angular.module('mean.technologies').controller('TechController', ['$scope', '$stateParams', 'Global', 'Technologies', '$state', '$http', '$window', function ($scope, $stateParams, Global, Technologies, $state, $http, $window) {
    $scope.global = Global;

    $scope.create = function() {
        var technology = new Technologies({
            Tech_RUNumber: this.Tech_RUNumber,
            Tech_name: this.Tech_name,
            Tech_inventor: this.Tech_inventor,
            Tag_name: this.selected,
            Tech_marketer: $scope.marketer,
            isActive: true
        });
        console.log("$scope.marketer", $scope.marketer);
        console.log("technology:", technology);
        technology.$save(function(response) {
            $state.go('viewTech',{id : response.id});
        });

        this.Tech_RUNumber = "";
        this.Tech_name = "";
        this.Tech_inventor = "";
        this.Tag_name = "";
        this.Tech_marketer = "";
    };

    $scope.remove = function(technology) {
        if ($window.confirm("Are you sure you want to delete this technology?")){
            if (technology) {
                technology.$remove();  

                for (var i in $scope.technologies) {
                    if ($scope.technologies[i] === technology) {
                        $scope.technolgies.splice(i, 1);
                    }
                }
            } else {
                $scope.technology.$remove();
                $state.go('techs');
            }
        }
    };

    $scope.update = function() {
        //$scope.$apply();
        var technology = $scope.technology;
        var tagname = $scope.whatyouneed;
        //console.log("tagname", tagname);
        var marketer = $scope.Tech_marketer;
        //console.log("$scope.marketer", $scope.marketer);

        technology.Tag_name = $scope.whatyouneed;
        //console.log(technology.Tag_name, "technology.Tag_name");
        technology.marketer = $scope.marketer;
        //technology.User = $scope.Tech_marketer;
        console.log(technology, "technology");
    
        technology.updated = [];
        
        technology.updated.push(new Date().getTime());
        technology.$update(function() {
        $state.go('viewTech',{id : technology.id});

        });
    };

    var showtags;
    var whatyouneed;

    $scope.findOne = function() {
        var tagarray = [];
        var tags = [];
        var tagids =[];
        var user;
    
        Technologies.get({
            id: $stateParams.id 
            }, function(technology) {
                $scope.technology = technology;
                console.log($scope.technology, "$scope.technology");
                if (technology.User) {
                    //console.log("whyis thisbeing called?");
                    $scope.user = technology.User;
                    $scope.username = technology.User.name;
                } else {
                    $scope.username = "none";
                    $scope.user = "none";
                }
                //console.log($scope.user, "$scope.user");
                //console.log($scope.user.name, "$scope.user.name");
                //$scope.tagstomatch = $scope.technology.Tags;
                //console.log("$scope.tagstomatch", $scope.tagstomatch);
                if(technology.Tags.length!==0){
                    tagarray = technology.Tags;
                } else {
                    tagarray.push({Tag_name:"None"});
                }
                $scope.tagarray = tagarray;

                tagarray.forEach(function(tag){
                    tags.push(tag.Tag_name);
                    tagids.push(tag.id);
                });

                $scope.tagids = tagids;
                console.log("$scope.tagids", $scope.tagids);



                $scope.whatyouneed = tags;
                whatyouneed = $scope.whatyouneed;

                $scope.tags = tags.join(", ");
                 $scope.findtagsandusers();
                $scope.selected = $scope.tags;

                $scope.findEventsforOneTechnology();
                $scope.findSuggestedCompanies();
        
            });
    };

    $scope.findSuggestedCompanies = function(){
        console.log("findSuggestedCompanieswas called");
        console.log("$SCOPE")
        $http({
            method: 'GET',
            url: '/findsuggestedcompanies',
            params: {
                //tech: $scope.technology,
                tags: $scope.tags,
                tagarray: $scope.tagarray,
                tagids: $scope.tagids

            }
        }).then(function(resp){
            console.log("response", resp);
            $scope.suggestedcompanies=resp.data;
        });
    };

    
    $scope.find = function() {
        Technologies.query(function(technologies) {
            $scope.technologies = technologies;
            //console.log("$scope.technologies:", $scope.technologies);  
            $scope.gettagsandmarketers();         
        });
    };

    $scope.usernames = [];

     $scope.findtagsandusers =  function(){
            //console.log("findtagsandusers");
            $scope.tagnames = [];
            $http.get('/tags')
            .then(function(response){
                $scope.tagresponse = response.data;
                $scope.tagresponse.forEach(function(tag){
                    $scope.tagnames.push(tag.Tag_name);
                });
                $scope.chunkedtagnames = $scope.chunk($scope.tagnames, 5);
            });
            $http.get('/showusers')
                .then(function(response){
                    $scope.usersresponse = response.data;
                    $scope.usersresponse.forEach(function(userObject){
                        $scope.usernames.push(userObject.name);
                    });
                    $scope.chunkedmarketers = $scope.chunk($scope.usernames, 3);
                });
                //console.log("$scope.usernames: ", $scope.usernames);
        };
     $scope.selected = [];

     $scope.chunk = function(arr, size){
        var newArr =[];
            for (var i=0; i<arr.length; i+=size) {
                newArr.push(arr.slice(i, i+size));
            }
            return newArr;
    };

  //$scope.getUser = function(){
    //$http.get('/currentuser')
      //  .then(function(response){
        //    $scope.user = response;
          //  console.log("$scope.user", $scope.user);
            //});
    //};

    $scope.getAdmin = function(){
        console.log("hello?");
    };
     
    $scope.toggle = function (tag, tags) {
        var idx = tags.indexOf(tag);
        if (idx > -1) {
          tags.splice(idx, 1);
        }
        else {
          tags.push(tag);
        }
      };

    $scope.toggle2 = function (tag, whatyouneed) {
        var idx = $scope.whatyouneed.indexOf(tag);
        if (idx > -1) {
            $scope.whatyouneed.splice(idx, 1);
        }
        else {
          $scope.whatyouneed.push(tag);
        }
      };  

      $scope.exists = function (tag, list) {
        return list.indexOf(tag) > -1;
      };

      $scope.yes = function(){
        $scope.technology.isActive = true;
      };

      $scope.no = function(){
        $scope.technology.isActive = false;
      };

 
    $scope.choosemarketer = function (name) {
        $scope.marketer = name;
        //$scope.user.name = name;
        console.log(" chosen $scope.marketer", $scope.marketer);
        $scope.marketerchosenorchanged = true;
        //$scope.$apply();
    };  

      $scope.marktheusername = function (name) {
        //console.log("marktheuser");
        var thingtocheck;
        thingtocheck = $scope.user.name;
        if($scope.user.name && !$scope.marketerchosenorchanged) {
            $scope.marketer = $scope.user.name;
        } else if ($scope.marketerchosenorchanged) {
            thingtocheck = $scope.marketer;
        }
        //console.log("$scope.marketer", $scope.marketer);
        if (thingtocheck === name){
            return true;
        }
      };

    $scope.searchForTech = function(){
        //console.log($scope.number, "$scope.number");
        $http({
            method: 'GET',
            url: '/searchfortech',
            params: {number: $scope.number}
        }).then(function(resp){
            var technology = resp.data;
            $state.go('viewTech', {id: technology.id});
        });
    };

    $scope.mymarketing = function(){
        $scope.showall = false;

        $scope.mycampaignsbutton = false;
        $scope.allactivebutton =  true;
        $scope.activeinactivebutton = true;
        //console.log("yes");
        $http({
            method: "GET",
            url: '/mymarketing'
        }).then(function(tex){
            //console.log("returned");
            $scope.technologies = tex.data;
            //console.log("$scope.technologies", $scope.technologies);
            $scope.gettagsandmarketers();
        });
        $scope.title = "My Active ";
    };

    $scope.allcamps = function(){
        $scope.title = "All Active and Inactive ";
        $scope.mycampaignsbutton = true;
        $scope.allactivebutton =  true;
        $scope.activeinactivebutton = false;

        $http({
            method: 'GET',
            url: '/allcampaigns'
        }).then(function(tex){
            $scope.technologies = tex.data;
            $scope.gettagsandmarketers();
            $scope.showall = true;
        });
    };

    $scope.active = function(){
        $scope.showall = false;

        $scope.mycampaignsbutton = true;
        $scope.allactivebutton =  false;
        $scope.activeinactivebutton = true;

        $scope.title = "All Active ";
        $http({
            method: 'GET',
            url: '/active'
        }).then(function(tex){
            //console.log("TEXX:", tex);
            $scope.technologies = tex.data;
            //console.log($scope.technologies, "$scope.technologies2");
            $scope.gettagsandmarketers();
        });
    };

    $scope.gettagsandmarketers = function(){
        //$scope.technologies is an array of objects; we are now going to get the information we want out of the array
        var arrayofarrayoftagobjects = [];
        var arrayoftagobjects = []; 
        $scope.arrayofusers = [];  
        var tempuser; 
        $scope.technologies.forEach(function(technology){
            //loading marketer information into an array
            if (!technology.User){
                $scope.arrayofusers.push("");
            } else {
                tempuser = technology.User;
                $scope.arrayofusers.push(tempuser.name);
            }
            //since there's only one marketer per technology, we've now got an array of strings/marketers that we can easily index for display
            
            //now we'll get the tag information into a useable format--this gets a little more complicated, since each technology can have more than one tag
            //first, we put the array of tag objects from each technology into an array, making an array of arrays of tag objects 
            if(technology.Tags){
                arrayofarrayoftagobjects.push(technology.Tags); 
            } else {
                //we'll push an empty string for technologies that don't have tags (since we'll want to be able to index these later!)
                arrayofarrayoftagobjects.push([{Tag_name: ""}]);
            }    
        });

        var arrayoftagnames = [];
        var tagnames = [];
        //now we go through the array of arrays of tag objects and put the name of each tag into a separate array called tagnames
        //visually, we're staring with something like this: [[{tag}, {tag}], [{tag}, {tag}, {tag}], [{tag}]]
        arrayofarrayoftagobjects.forEach(function(array){
            //so for each array in the array of arrays....
            array.forEach(function(tagobject){
                //...we go through the tag objects in the array, pull out the tagname and push that name into a separate array
                tagnames.push(tagobject.Tag_name);
            });
            //then, once we've collected all the tag names from one array, we push those tag names into yet another array descriptively called arrayoftagnames
            arrayoftagnames.push(tagnames);
            //and now we clear the array we just pushed the tagnames into so we can use it again
            tagnames = [];
        });
        //we've now got a array of arrays of tagnames. yay!
        //next step is to get the arrays of tag names into one string of tag names, so that it's easier to display:
        var stringoftagnames;
        arrayoftagnames.forEach(function(array){
            stringoftagnames=array.join(", ");
            tagnames.push(stringoftagnames);   
        });
        //now we'll put our array of strings/tagnames onto our scope 
        $scope.tagnames = tagnames;
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


    $scope.findEvents = function(){
        $scope.Eventtechs =[];
        $scope.Technologytitles=[];
        $scope.followups=[];
        $scope.users=[];
        $scope.companies=[];
        $scope.arrayofarrayofcontacts=[];
        $http({
            method: 'GET',
            url: '/getem'
        }).then(function(response){
            $scope.makeEventDataUseable(response);
            //console.log("ReSPONSE", response);
            
            //$scope.geteventsinfo();
            //console.log("$scope.arrayofarrayofcontacts", $scope.arrayofarrayofcontacts);
        });
    };

    $scope.findEventsforOneTechnology = function(){
        $scope.Eventtechs =[];
        $scope.Technologytitles=[];
        $scope.followups=[];
        $scope.users=[];
        $scope.companies=[];
        $scope.arrayofarrayofcontacts=[];
        $http({
            method: 'GET',
            url: '/geteventsforonetechnology',
            params: {techid: $scope.technology.id}
        }).then(function(response){
            $scope.makeEventDataUseable(response);
            //console.log("ReSPONSE", response);
            
            //$scope.geteventsinfo();
            //console.log("$scope.arrayofarrayofcontacts", $scope.arrayofarrayofcontacts);
        });
    };

    $scope.makeEventDataUseable = function(response){
        $scope.events = response.data;
            var evnts = $scope.events;
            //console.log("TYpeof $scope.events", typeof $scope.events);
            console.log("events", $scope.events);
            if($scope.events.length===0){
                //console.log("should hide");
                $scope.noevents = true;
            } else {
                $scope.noevents = false;
            }
            //console.log("Found events");
            for(var i=0; i<$scope.events.length; i++){
                $scope.Eventtechs.push($scope.events[i].Technology);
                $scope.users.push($scope.events[i].User);
                $scope.companies.push($scope.events[i].Company);

                if($scope.events[i].Contacts){
                    $scope.arrayofarrayofcontacts.push($scope.events[i].Contacts);
                } else {
                    $scope.arrayofarrayofcontacts.push({"Contact Name": "none"});
                }
            }

            var arrayofcontactnames =[];
            var contactnames =[];

            $scope.arrayofarrayofcontacts.forEach(function(array){
                array.forEach(function(contact){
                    contactnames.push(contact.Contact_name);
                });
                arrayofcontactnames.push(contactnames);
                contactnames = [];
            });

            var stringofcontactnames;
            arrayofcontactnames.forEach(function(array){
                stringofcontactnames=array.join(", ");
                contactnames.push(stringofcontactnames);
            });

            $scope.contactnames = contactnames;
    };
           

}]);