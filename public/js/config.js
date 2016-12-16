'use strict';
//Setting up route
angular.module('mean').config(['$stateProvider','$urlRouterProvider', function($stateProvider,$urlRouterProvider) {

    $urlRouterProvider.otherwise(function($injector, $location){
        $injector.invoke(['$state', function($state) {
            $state.go('404');
        }]);
    });
    $stateProvider
        .state('home',{
            url : '/',
            controller : 'EventController',
            templateUrl: 'views/index.html'
        })
        .state('companies',{
            url: '/companies',
            controller: 'CompaniesController',
            templateUrl: 'views/companies/list.html'
        })
        .state('addCompany',{
            url: '/createcompany',
            controller: 'CompaniesController',
            templateUrl: 'views/companies/create.html'
        })
        .state('editCompany',{
            url : '/companies/{id}/edit',
            controller : 'CompaniesController',
            templateUrl: 'views/companies/edit.html'
        })
        .state('viewCompany',{
            url : '/companies/{id}',
            controller : 'CompaniesController',
            templateUrl: 'views/companies/view.html'
        })
        .state('SignIn',{
            url : '/signin',
            templateUrl: 'views/users/signin.html'
        })
        .state('SignUp',{
            url : '/signup',
            templateUrl: 'views/users/signup.html'
        })
        .state('articles',{
            url : '/articles',
            controller : 'ArticlesController',
            templateUrl: 'views/articles/list.html'
        })
        .state('createArticle',{
            url : '/articles/create',
            controller : 'ArticlesController',
            templateUrl: 'views/articles/create.html'
        })
        .state('editArticles',{
            url : '/articles/{articleId}/edit',
            controller : 'ArticlesController',
            templateUrl: 'views/articles/edit.html'
        })
        .state('viewArticle',{
            url : '/articles/{articleId}',
            controller : 'ArticlesController',
            templateUrl: 'views/articles/view.html'
        })
        .state('contacts',{
            url: '/contacts',
            controller: 'ContactsController',
            templateUrl: 'views/contacts/list.html'
        })
        .state('addContact',{
            url : '/contacts/create',
            controller : 'ContactsController',
            templateUrl: 'views/contacts/create.html'
        })
        .state('viewContact',{
            url : '/contacts/{id}',
            controller : 'ContactsController',
            templateUrl: 'views/contacts/view.html'
        })
        .state('editContact',{
            url : '/contacts/{id}/edit',
            controller : 'ContactsController',
            templateUrl: 'views/contacts/edit.html'
        })
        .state('techs',{
            url: '/technologies',
            controller: 'TechController',
            templateUrl: 'views/technologies/list.html'
        })
        .state('addTech',{
            url: '/technologies/create',
            controller: 'TechController',
            templateUrl: 'views/technologies/create.html'
        })
        .state('viewTech',{
            url: '/technologies/{id}',
            controller: 'TechController',
            templateUrl: 'views/technologies/view.html'
        })
        .state('editTech',{
            url: '/technologies/{id}/edit',
            controller: 'TechController',
            templateUrl: 'views/technologies/edit.html'
        })
        .state('events',{
            url: '/events',
            controller: 'EventController',
            templateUrl: 'views/events/list.html'
        })
        .state('addEvent',{
            url: '/events/create',
            controller: 'EventController',
            templateUrl: 'views/events/create.html'
        })
        .state('viewEvent',{
            url: '/events/{id}',
            controller: 'EventController',
            templateUrl: 'views/events/view.html'
        })
        .state('editEvent',{
            url: '/events/{id}/edit',
            controller: 'EventController',
            templateUrl: 'views/events/edit.html'
        })
        .state('404',{
            templateUrl: 'views/404.html'
        });
}
]);

//Setting HTML5 Location Mode
angular.module('mean').config(['$locationProvider', function ($locationProvider) {
    $locationProvider.html5Mode(true);

}]);