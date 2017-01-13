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

    
    $scope.update = function() {
        var company = $scope.company;
        
        console.log("$SCOPE.WHATYOUNEED", $scope.whatyouneed);

        var tagname = $scope.whatyouneed;

       // if(tagname) {
         //   console.log("THERE WAS A TAGNAME");
            company.Tag_name = tagname;
        //}
            
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


    var showtags;
    var whatyouneed;
    var cmpnyid;


    $scope.findOne = function() {
        var tagarray = [];
        var tags = [];
        var contactarray;
        var contacts = [];
        console.log("findOne ran");
        console.log("$stateParams.id=");
        console.log($stateParams.id);
        cmpnyid = $stateParams.id;
        Companies.get({
            id: $stateParams.id 
            }, function(company) {
                console.log(company);
                //$scope.company = company;
                contactarray = company.Contacts;
                console.log("CONTTTTTTTTTTACTS;", contactarray);

                if(contactarray!==0){
                    console.log(contactarray.length, "length");
                    for (var i=0; i<contactarray.length; i++){
                        contacts.push(contactarray[i].Contact_name);
                    } 

                            
                    
                    

                } else {
                    contacts.push("None");
                }
                $scope.contacts = contacts;
                console.log("$scope.contacts", $scope.contacts);






                if(company.Tags.length!==0){
                    //console.log("it thinks there's a company.tag");
                    tagarray = company.Tags;
                } else {
                    //console.log("this happened");
                    tagarray.push({Tag_name:"None"});
                }
                
            
                tagarray.forEach(function(tag){
                    tags.push(tag.Tag_name);
                });

                $scope.whatyouneed = tags;
                whatyouneed = $scope.whatyouneed;
            
                $scope.tags = tags.join(", ");
                //console.log("SCOPE.TAGS", $scope.tags);

                $scope.findtags();
                $scope.selected = $scope.tags;

                //$scope.findcompanycontacts();
                //console.log("findonecalled and here's $scope.whatyouneed", $scope.whatyouneed, typeof $scope.whatyouneed);


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

          //  console.log("arrayofarrayoftagobjects", arrayofarrayoftagobjects);
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
          //  console.log("arrayoftags", arrayoftags);

            var arrayoftagnames = [];
            var stringoftagnames;
            arrayoftags = arrayoftags.forEach(function(array){
                stringoftagnames = array.join(", ");
                arrayoftagnames.push(stringoftagnames);
            });

           // console.log("arrayoftagnames", arrayoftagnames);

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

    $scope.findcompanycontacts = function(){
        console.log("FINDCONTACTS GOT CALLED");
        $scope.contacts= [];
        $http.get('/companycontacts/cmpnyid')
        .then(function(response){
            $scope.contactresponse = response.data;
            console.log("$scope.contactresponse", $scope.contactresponse);
            $scope.contactresponse.forEach(function(contact){
                $scope.contacts.push(contact.Contact_name);
            });
            console.log("$scope.contacts", $scope.contacts);
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




}]);