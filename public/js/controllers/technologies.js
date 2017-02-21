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
            $state.go('viewTech',{id : response.id});
        });

        this.Tech_RUNumber = "";
        this.Tech_name = "";
        this.Tech_inventor = "";
        this.Tag_name = "";
        this.Tech_marketer = "";
    };

    $scope.remove = function(technology) {
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
    };

    $scope.update = function() {
        var technology = $scope.technology;
        var tagname = $scope.whatyouneed;

        technology.Tag_name = tagname;
        technology.Tech_marketer = $scope.Tech_marketer;
    
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
    
        Technologies.get({
            id: $stateParams.id 
            }, function(technology) {
                $scope.technology = technology;
                if (technology.User) {
                    $scope.user = technology.User;
                    $scope.username = technology.User.name;
                } else {
                    $scope.username = "none";
                }

                if(technology.Tags.length!==0){
                    tagarray = technology.Tags;
                } else {
                    tagarray.push({Tag_name:"None"});
                }

                tagarray.forEach(function(tag){
                    tags.push(tag.Tag_name);
                });

                $scope.whatyouneed = tags;
                whatyouneed = $scope.whatyouneed;

                $scope.tags = tags.join(", ");
                 $scope.findtagsandusers();
                $scope.selected = $scope.tags;
        
            });
    };

    
    $scope.find = function() {
        Technologies.query(function(technologies) {
            $scope.technologies = technologies;
        
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

            var arrayoftagnames = [];
            var tagnames = [];
            arrayofarrayoftagobjects.forEach(function(array){
                array.forEach(function(tagobject){
                    tagnames.push(tagobject.Tag_name);
                });
                arrayoftagnames.push(tagnames);
                tagnames = [];
            });

            var stringoftagnames;
            arrayoftagnames.forEach(function(array){
                stringoftagnames=array.join(", ");
                tagnames.push(stringoftagnames);   
            });

            $scope.tagnames = tagnames;
        });
    };

    $scope.usernames = [];

     $scope.findtagsandusers =  function(){
            $scope.tagnames = [];
            $http.get('/tags')
            .then(function(response){
                $scope.tagresponse = response.data;
                $scope.tagresponse.forEach(function(tag){
                    $scope.tagnames.push(tag.Tag_name);
                });
            });
            $http.get('/showusers')
                .then(function(response){
                    $scope.usersresponse = response.data;
                    $scope.usersresponse.forEach(function(userObject){
                        $scope.usernames.push(userObject.name);
                    });
                });
        };
     $scope.selected = [];

     $scope.getUser = function(){
        $http.get('/currentuser')
            .then(function(response){
                $scope.user = response;
                });
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
        var idx = whatyouneed.indexOf(tag);
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
        $scope.Tech_marketer = name;
      };  

      $scope.exists2 = function (name) {
        var thingtocheck = $scope.user.name;
        if (thingtocheck === $scope.username){
            return true;
        }
      };

    $scope.searchForTech = function(){
        console.log($scope.number, "$scope.number");
        $http({
            method: 'GET',
            url: '/searchfortech',
            params: {number: $scope.number}
        }).then(function(resp){
            var technology = resp.data;
            $state.go('viewTech', {id: technology.id});
        });
    };

}]);