'use strict';

angular.module('mean.system').controller('HeaderController', ['$scope', 'Global', 'SignOut', '$state', '$http', function ($scope, Global, SignOut, $state, $http) {
    $scope.global = Global;

    $scope.menu = [{
        "title": "Campaigns",
        "state": "techs"
    },{
        "title": "Companies",
        "state": "companies"
    }, {
        "title": "Contacts",
        "state": "contacts"
    }];
    
    $scope.isCollapsed = false;

//    $scope.isAdmin = function(){
  //      console.log("user.admin", user.admin);
    //    var x = user.id;
//        console.log("x", x);
      //  $http({
        //    url: '/isadmin',
          //  method: "GET",
            //params: {id: x}
//        }).then(function(user){
  //          console.log("user", user);
    //        if (user.admin){
      //          $scope.admin = true;
        //    } else {
          //      $scope.admin = false;
            //}
//            console.log("$scope.admin", $scope.admin);
  //      });
    //};

   // $scope.isAdmin = function(){
     //   if (global.user.admin){
       //     $scope.admin = true;
    //    } 
    //};

    $scope.SignOut = function(){
        SignOut.get(function(response){
            if(response.status === 'success'){
                $scope.global = null;
                $state.go('home');
            }
        });
    };

    $scope.Addtags = function(){
        $state.go('addtags');
    };

    $scope.addUser = function(){
        $state.go('adduser');
    };


}]);