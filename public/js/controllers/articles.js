'use strict';

angular.module('mean.articles').controller('ArticlesController', ['$scope', '$stateParams', 'Global', 'Articles', '$state', function ($scope, $stateParams, Global, Articles, $state) {
    $scope.global = Global;

    $scope.create = function() {
        var article = new Articles({
            title: this.title,
            content: this.content
        });

        article.$save(function(response) {
            $state.go('viewArticle',{articleId : response.id});
        });

        this.title = "";
        this.content = "";
    };

    $scope.remove = function(article) {
        console.log("remove an article was called");
        console.log($scope.articles);
        if (article) {
            console.log("there once was an article");
            article.$remove();  

            for (var i in $scope.articles) {
                console.log("$scope.articles");
                console.log($scope.articles);
                if ($scope.articles[i] === article) {
                    $scope.articles.splice(i, 1);
                }
            }
        }
        else {
            $scope.article.$remove();
            $state.go('articles');
        }
    };

    $scope.update = function() {
        var article = $scope.article;
        console.log($scope.article);
        console.log(article.updated);
        if (!article.updated) {
            console.log("article didn't updated");
            article.updated = [];
        }
        article.updated.push(new Date().getTime());
        article.$update(function() {
        $state.go('viewArticle',{articleId : article.id});

        });
    };



    $scope.findOne = function() {
        Articles.get({
            articleId: $stateParams.articleId
        }, function(article) {
            //console.log("fineOneArticle ran");
            $scope.article = article;
            console.log(article);
        });
    };
    $scope.find = function() {
        Articles.query(function(articles) {
            $scope.articles = articles;
            console.log("articles.find got called!!");
            console.log(articles);
        });
    };



}]);