'use strict';

angular.module('mean.auth').controller('AdminController', ['$scope', '$window', 'Global','$state', 'SignUp', '$http', '$stateParams', function ($scope, $window, Global, $state, SignUp, $http, $stateParams) {
    $scope.global = Global;

    $scope.findusers = function(){
        $http.get('/showusers')
            .then(function(response){
                $scope.users = response.data;
            });
    };

    $scope.findUser = function(){
        console.log($stateParams, "$stateParams");
        $http({
            url: "/user/id", 
            method: "GET",
            params: {id: $stateParams.id}
        }).then(function(response){
                $scope.user = response.data;
                console.log('$scope.user', $scope.user);
        });
    };


    $scope.signUp = function(newuser) {

        var signUp = new SignUp({
            name: newuser.name,
            email: newuser.email,
            //username : user.userName,
            password : newuser.password,
            admin: newuser.admin
        });

        signUp.$save(function(response) {
            if(response.status === 'success'){
               $scope.findusers();
            }
        });
    };


    $scope.yes = function(){    
        $scope.user.admin = true;
        console.log("$scope.user.admin", $scope.user.admin);
    };

    $scope.no = function(){    
        $scope.user.admin = false;
        console.log("$scope.user.admin", $scope.user.admin);
    };

    $scope.updateUser = function(){
        var user = $scope.user;
        console.log("user", user);

        $http({
            url: "/updateuser", 
            method: "PUT",
            params: {
                id: $scope.user.id,
                email: $scope.user.email,
                name: $scope.user.name,
                admin: $scope.user.admin
                }
        }).then(function(){
            $state.go('adduser');
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
                $state.go('adduser');
            });           
        } else {
            $state.go('adduser');
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
                $window.location.reload();
            })
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
        });
    };


    $scope.addNewTag = function(){
        $http({
            url: '/tags',
            method: "POST",
            params: {
                Tag_name: $scope.tagname
            }
        }).then(function(){
            $window.location.reload();
        });
    };

    $scope.choose = function (tag) {
        $scope.tag = tag;
      };


}]);
