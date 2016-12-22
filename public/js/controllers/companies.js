'use strict';

angular.module('mean.companies').controller('CompaniesController', ['$scope', '$stateParams', 'Global', 'Companies', '$state', '$http', function ($scope, $stateParams, Global, Companies, $state, $http) {
    $scope.global = Global;

    $scope.create = function() {
        var Tagnames = [];
        console.log("$scope.selected", $scope.selected);


        var company = new Companies({
            Company_name: this.Company_name,
            Notes: this.Notes,
            Tag_name: this.selected
        });
        company.$save(function(response) {
            //$state.go('viewCompany',{Company_name : responseid});
            $state.go('viewCompany',{id : response.id});
        });

        this.Company_name = "";
        this.notes = "";
        this.Tag_name = "";
    };


    $scope.remove = function(company) {
        console.log("remove was called");
        console.log($scope.company);

        if (company) {
            console.log("THERE WAS A COMPANY");
            company.$remove();  

            for (var i in $scope.companies) {
                if ($scope.companies[i] === company) {
                    console.log("that thing happened");
                    $scope.companies.splice(i, 1);
                }
            }
        }
        else {
            console.log("hello else");
            $scope.company.$remove();
            $state.go('companies');
        }
    };

    $scope.update = function() {
        var company = $scope.company;
        
        console.log("$SCOPE.TAG_NAME", $scope.Tag_name);

        var tagname = $scope.Tag_name;

        if(tagname) {
            console.log("THERE WAS A TAGNAME");
            company.Tag_name = tagname;
        }
            
       // console.log("$scope.company", company);
       // if (!company.updated) {
         //   console.log("company didn't updated");
            company.updated = [];
       // }
            company.updated.push(new Date().getTime());
            company.$update(function() {
            $state.go('viewCompany',{id : $stateParams.id});
        });
    };


    $scope.findOne = function() {
        var tagarray = [];
        var tags = [];
        console.log("findOne ran");
        console.log("$stateParams.id=");
        console.log($stateParams.id);
        Companies.get({
            id: $stateParams.id 
            }, function(company) {
                console.log(company);
                $scope.company = company;


                if(company.Tags.length!==0){
                    console.log("it thinks there's a company.tag");
                    tagarray = company.Tags;
                } else {
                    console.log("this happened");
                    tagarray.push({Tag_name:"None"});
                }
                
                console.log("COMPANY.TAGS", company.Tags);


                console.log("TAGARRAY", tagarray);

            
                    tagarray.forEach(function(tag){
                        tags.push(tag.Tag_name);
                    });
            
                $scope.tags = tags.join(", ");
                console.log("SCOPE.TAGS", $scope.tags);

                $scope.findtags();
                $scope.selected = $scope.tags;
            });


    };

    
    $scope.find = function() {
        var arrayofarrayoftagobjects = [];
        var arrayoftagobjects = [];

        Companies.query(function(companies) {
            console.log("findfindfind");
            $scope.companies = companies;
            console.log(companies);

            companies.forEach(function(company){
                if(company.Tags){
                    arrayofarrayoftagobjects.push(company.Tags);
                } else {
                    arrayofarrayoftagobjects.push([{Tag_name: "None"}]);
                }
            });

            console.log("arrayofarrayoftagobjects", arrayofarrayoftagobjects);
            var tags = [];
            var arrayoftags = [];

            arrayofarrayoftagobjects.forEach(function(array){
                array.forEach(function(object){
                    tags.push(object.Tag_name); 
                    
                });
                arrayoftags.push(tags);   
                tags = [];
                //console.log("tags", tags);      
            });
            console.log("arrayoftags", arrayoftags);

            var arrayoftagnames = [];
            var stringoftagnames;
            arrayoftags = arrayoftags.forEach(function(array){
                stringoftagnames = array.join(", ");
                arrayoftagnames.push(stringoftagnames);
            });

            console.log("arrayoftagnames", arrayoftagnames);

            $scope.tags=arrayoftagnames;

        });
    };

    $scope.findtags =  function(){
        console.log("FINDTAGS GOT CALLED");
        $scope.tagnames = [];
        $http.get('/tags')
        .then(function(response){
            $scope.tagresponse = response.data;
            console.log("$scope.tags", $scope.tags);
            $scope.tagresponse.forEach(function(tag){
                $scope.tagnames.push(tag.Tag_name);
            });
            console.log("$scope.tagnames", $scope.tagnames);
        });
    };

      $scope.selected = [];

      $scope.toggle = function (tag, list) {
        var idx = list.indexOf(tag);
        if (idx > -1) {
          list.splice(idx, 1);
        }
        else {
          list.push(tag);
        }
      };

      $scope.exists = function (tag, list) {
        return list.indexOf(tag) > -1;
      };


}]);