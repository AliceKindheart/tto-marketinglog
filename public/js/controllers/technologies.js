'use strict';

angular.module('mean.technologies').controller('TechController', ['$scope', '$stateParams', 'Global', 'Technologies', '$state', '$http', function ($scope, $stateParams, Global, Technologies, $state, $http) {
    $scope.global = Global;

    $scope.create = function() {
        var technology = new Technologies({
            Tech_RUNumber: this.Tech_RUNumber,
            Tech_name: this.Tech_name,
            Tech_inventor: this.Tech_inventor,
            Tag_name: this.selected,
            Tech_marketer: this.Tech_marketer
        });
        console.log("technology.Tech_marketer", technology.Tech_marketer);
        technology.$save(function(response) {
            //$state.go('viewCompany',{Company_name : responseid});
            $state.go('viewTech',{id : response.id});
        });

        this.Tech_RUNumber = "";
        this.Tech_name = "";
        this.Tech_inventor = "";
        this.Tag_name = "";
        this.Tech_marketer = "";
    };

    $scope.remove = function(technology) {
        console.log("removetech was called");
        console.log($scope.technology);

        if (technology) {
            console.log("THERE WAS A TECHNOLOGY");
            technology.$remove();  

            for (var i in $scope.technologies) {
                if ($scope.technologies[i] === technology) {
                    console.log("that thing happened");
                    $scope.technolgies.splice(i, 1);
                }
            }
        }
        else {
            console.log("hello else");
            $scope.technology.$remove();
            $state.go('techs');
        }
    };

    $scope.update = function() {
        var technology = $scope.technology;
        var tagname = $scope.whatyouneed;

        technology.Tag_name = tagname;
        technology.Tech_marketer = $scope.Tech_marketer;
        console.log("$scope.Tech_marketer", $scope.Tech_marketer);
        console.log($scope.Tech_marketer, "techmarketer");


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
        var user;
        console.log("findOneTechnology ran");
        //console.log("$stateParams.id=");
        //console.log($stateParams.id);
        Technologies.get({
            id: $stateParams.id 
            }, function(technology) {
                console.log(technology);
                $scope.technology = technology;
                if (technology.User) {
                    $scope.user = technology.User;
                    $scope.username = technology.User.name;
                } else {
                    $scope.username = "none";
                }

             //   console.log("USERRRR", user);
             //   console.log("$scope.username", $scope.username);

                if(technology.Tags.length!==0){
                 //   console.log("it think's there's a tag");
                    tagarray = technology.Tags;
                 //   console.log("TAGARRAY", tagarray);
                } else {
                    console.log("this happened");
                    tagarray.push({Tag_name:"None"});
                }
                
                console.log("TECHNOLOGY.TAGS", technology.Tags);


                console.log("TAGARRAY", tagarray);

                tagarray.forEach(function(tag){
                  //  console.log("made it to the foreach");
                    tags.push(tag.Tag_name);
                  //  console.log("tags", tags);
                    //scope.tags = tags.join(", ");
                    //console.log("SCOPE.TAGS", $scope.tags);
                });

                $scope.whatyouneed = tags;
                whatyouneed = $scope.whatyouneed;


                $scope.tags = tags.join(", ");
              //  console.log("SCOPE.TAGS", $scope.tags);

                 $scope.findtagsandusers();
                $scope.selected = $scope.tags;
             //   console.log("findonecalled and here's whatyouneed", whatyouneed, typeof whatyouneed);

            });
    };

    
    $scope.find = function() {
        Technologies.query(function(technologies) {
            console.log("findtechfindtechnology");
            $scope.technologies = technologies;
            console.log("TECHNOLOGIES:");
            console.log(technologies);
        
            var arrayofarrayoftagobjects = [];
            var arrayoftagobjects = []; 
            $scope.arrayofusers = [];  
            var tempuser; 

            technologies.forEach(function(technology){
                if (!technology.User){
                    $scope.arrayofusers.push("");
                } else {
                    tempuser = technology.User;
                    $scope.arrayofusers.push(tempuser.name);
                }

                
                if(technology.Tags.length!==0){
                    arrayofarrayoftagobjects.push(technology.Tags); 
                } else {
                    arrayofarrayoftagobjects.push([{Tag_name: ""}]);
                }    
            });

            console.log("arrayofarrayoftagobjects", arrayofarrayoftagobjects);

            var arrayoftagnames = [];
            var tagnames = [];
            arrayofarrayoftagobjects.forEach(function(array){
                array.forEach(function(tagobject){
                    tagnames.push(tagobject.Tag_name);
                });
                //tagnames.join(", ");
                arrayoftagnames.push(tagnames);
                tagnames = [];
            });

        //    console.log("arrayoftagnames", arrayoftagnames);

            var stringoftagnames;
            arrayoftagnames.forEach(function(array){
                stringoftagnames=array.join(", ");
                tagnames.push(stringoftagnames);   
            });
        //    console.log("tagnames", tagnames);

            $scope.tagnames = tagnames;
        });
    };

    $scope.usernames = [];

     $scope.findtagsandusers =  function(){
            console.log("FINDTAGS GOT CALLED");
            $scope.tagnames = [];
            $http.get('/tags')
            .then(function(response){
                $scope.tagresponse = response.data;
             //   console.log("$scope.tags", $scope.tags);
                $scope.tagresponse.forEach(function(tag){
                    $scope.tagnames.push(tag.Tag_name);
                });
            //    console.log("$scope.tagnames", $scope.tagnames);
            });
            $http.get('/showusers')
                .then(function(response){
                    $scope.usersresponse = response.data;
                  //  console.log("$scope.usersresponse", $scope.usersresponse);
                    $scope.usersresponse.forEach(function(userObject){
                        $scope.usernames.push(userObject.name);
                    });
                });
        };
     $scope.selected = [];

     $scope.getUser = function(){
        console.log("hello");
        $http.get('/currentuser')
            .then(function(response){
                console.log("response", response);
                $scope.user = response;
                });
    };
     
    
     
    $scope.toggle = function (tag, tags) {
        console.log($scope.selected, "scope.selected", typeof $scope.selected);
       // console.log(list, "list", typeof list);
        var idx = tags.indexOf(tag);
        console.log("idx", idx);
        if (idx > -1) {
          tags.splice(idx, 1);
        }
        else {
          tags.push(tag);
        }
      };

    $scope.toggle2 = function (tag, whatyouneed) {
        console.log(whatyouneed, "whatyouneed", typeof whatyouneed);
        console.log("toggle2");
        var idx = whatyouneed.indexOf(tag);
        console.log("idx", idx);
        if (idx > -1) {
            whatyouneed.splice(idx, 1);
        }
        else {
          whatyouneed.push(tag);
        }
      };  

      $scope.exists = function (tag, list) {
        return list.indexOf(tag) > -1;
      };

 
    $scope.choose = function (name) {
        console.log("name", name);
        $scope.Tech_marketer = name;
        console.log("TECHMARKETER", $scope.Tech_marketer);
      };  

      $scope.exists2 = function (name) {
        //console.log("nameofcompanychecked", $scope.nameofcompany);
        //console.log("company", company);
        var thingtocheck = user.name;
      //  console.log("$scope.username", $scope.username, "thingtocheck", thingtocheck);
        if (thingtocheck === $scope.username){
            return true;
        }
      };

    //  $scope.choose2edit = function(marketer){
       // $scope.nameofmarketer = marketer;
      //  $scope.Tech_marketer = marketer;
     // };

}]);