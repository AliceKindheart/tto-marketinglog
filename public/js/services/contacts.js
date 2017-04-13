'use strict';

//Contacts service used for contacts REST endpoint
	angular.module('mean.contacts').factory("Contacts", ['$resource', function($resource){ 
    
    return $resource('contacts/:id', {
        id: '@id'
    }, {
        update: {
            method: 'PUT'
        }
    });

  //  return $resource('/searchforcontacts', {
    //	searchcontacts: {
    //		method: "GET",
    //		params: {contactname: $scope.contactname}
	//	}
		
    //});


    //this.searchContacts = function(){
    //	return $http({
      //      method: 'GET',
        //    url: '/searchforcontacts',
          //  params: {contactname: $scope.contactname}
        //});
      //};
    

}]);