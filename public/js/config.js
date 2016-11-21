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
            controller : 'IndexController',
            templateUrl: 'views/index.html'
        })
        .state('companies',{
            url: '/companies',
            controller: 'CompaniesController',
            templateUrl: 'views/companies/list.html'
        })
        .state('addCompany',{
            url: '/companies/create',
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
        .state('addContact',{
            url : '/contacts/create',
            controller : 'ContactsController',
            templateUrl: 'views/contacts/create.html'
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