'use strict';

angular.module('mean.auth').controller('AdminController', ['$scope','$window', 'Global', 'Users', '$state', 'SignUp', '$http', '$stateParams', function ($scope, $window, Global, Users, $state, SignUp, $http, $stateParams) {
    $scope.global = Global;

    $scope.findusers = function(){
        $http.get('/showusers')
            .then(function(response){
                $scope.users = response.data;
         //       console.log("$scope.users", $scope.users);
            });
    };

    $scope.findUser = function(){
      //  console.log($stateParams, "$stateParams");
        $http({
            url: "/user/id", 
            method: "GET",
            params: {id: $stateParams.id}
        }).then(function(response){
                $scope.user = response.data;
           //     console.log('$scope.user', $scope.user);
        }).then(function(){
            $http({
                url: "/usercampaigns",
                method: "GET",
                params: {id: $scope.user.id}
            }).then(function(response){
                $scope.tex = response.data;
          //      console.log($scope.tex, "$scope.tex");
            });
        });
    };

    $scope.getAdmins = function(){
        $http.get('getadmins')
            .then(function(response){
                $scope.admins = response.data;
              //  console.log("$scope.admins", $scope.admins);
            });
    };


    $scope.signUp = function(newuser) {

        var signUp = new SignUp({
            name: newuser.first_name + " " + newuser.last_name,
            first_name: newuser.first_name,
            last_name: newuser.last_name,
            email: newuser.email,
            username : newuser.username,
            password : newuser.password,
            admin: newuser.admin,
            intern: newuser.intern,
            advisor: newuser.advisor
        });

        signUp.$save(function(response) {
            if(response.status === 'success'){
               $state.go("users");
            }
        });
    };

    $scope.pickAdvisor= function(advisor){
        $scope.newuser.advisor=advisor;
       // console.log("Advisor", $scope.newuser.advisor);
    };

    $scope.changepassword = function(){
        if ($scope.newpassword !== $scope.checkedpassword){
            $window.confirm("New passwords must match");
        } else {
            $http({
                url: '/changepassword',
                method: "POST",
                data: {
                    oldpassword: $scope.oldpassword,
                    newpassword: $scope.newpassword,
                    //id: user.id
                }
            }).then(function(){
                $window.confirm("Password updated successfully");
                $state.go('home');
            });
        }
    };


    $scope.yes = function(){    
        $scope.user.admin = true;
        console.log("$scope.user.admin", $scope.user.admin);
    };

    $scope.no = function(){    
        $scope.user.admin = false;
        console.log("$scope.user.admin", $scope.user.admin);
    };

    $scope.internyes = function(){
        $scope.user.intern = true;
    };

    $scope.internno = function(){    

        $scope.user.intern = false;
        console.log("$scope.user.intern", $scope.user.intern);
    };

    $scope.newuserinternyes = function(){
        $scope.newuser.intern=true;
    };

    $scope.newuserinternno=function(){
        $scope.newuser.intern=false;
    };

    $scope.selectAdvisor = function(advisor){
        $scope.advisor = advisor;
    };

    $scope.editAdvisor = function(admin){
        $scope.user.AdvisorId=admin.id;
        console.log("AdvisorId", $scope.user.AdvisorId);
    };

    $scope.updateUser = function(){
       // var user = $scope.user;
       //console.log("$scope.user first time", $scope.user);
        $scope.user.name = $scope.user.first_name + " " + $scope.user.last_name;
        if($scope.user.intern===false){
            console.log("USERUSERUSERSERUINTERNINTERNINTERIN FALSE");
            $scope.user.Advisor=null;
            $scope.user.AdvisorId=null;
        }
       // console.log("$scope.user second time", $scope.user);
        var user = $scope.user;
        console.log("typeof user", typeof user);
        console.log("user", user);

//        user.updated =[];
  //      user.updated.push(new Date().getTime());

//        user.$update(function(){

//        }).then(function(){
  //          $state.go('viewUser', {id: user.id});
    //    });

        $http({
            url: "/updateuser", 
            method: "PUT",
            params: {
                id: user.id,
                email: user.email,
                username: user.username,
                firstname: user.first_name,
                lastname: user.last_name,
                name: user.name,
                admin: user.admin,
                intern: user.intern,
                advisor: user.Advisor,
                advisorid: user.AdvisorId
                }
        }).then(function(){
            $state.go('users');
        });       
    };

    $scope.deleteUser = function(){
        var user = $scope.user;
        console.log("user", user);

        if ($window.confirm("Are you sure you want to delete this user?")){
            $http({
            url: "/deleteuser", 
            method: "DELETE",
            params: {
                id: $scope.user.id,
                }
            }).then(function(){
                $state.go('users');
            });           
        } else {
            $state.go('users');
        }     
    };

    $scope.deleteTag = function(){
        if ($window.confirm("Are you sure you want to delete this tag?")){
            $http({
                url: '/tags',
                method: "DELETE",
                params: {
                    Tag_name: $scope.tag
                }
            }).then(function(){
                console.log("this happened");
                //$scope.$apply();
                //$state.go('addtags');
                //$window.location.reload();
                $scope.findtags();
            });
        }
    };

    $scope.findtags =  function(){
        $scope.tagnames = [];
        $http.get('/tags')
        .then(function(response){
            $scope.tagresponse = response.data;
            $scope.tagresponse.forEach(function(tag){
                $scope.tagnames.push(tag.Tag_name);
            });
            $scope.chunkedtagnames = $scope.chunk($scope.tagnames, 5);
        });
    };

    $scope.chunk = function(arr, size){
        var newArr =[];
            for (var i=0; i<arr.length; i+=size) {
                newArr.push(arr.slice(i, i+size));
            }
            return newArr;
    };

    $scope.addNewTag = function(){
        $http({
            url: '/tags',
            method: "POST",
            params: {
                Tag_name: $scope.tagname
            }
        }).then(function(){
        //    $scope.user = user;
        //    console.log("$scope.user", $scope.user);
            //console.log("$scope.global", $scope.global);
            //$window.location.reload();
            $scope.findtags();
        });
    };

    $scope.choose = function (tag) {
        $scope.tag = tag;
      };



}]);
