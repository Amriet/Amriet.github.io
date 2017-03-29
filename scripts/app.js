var movieApp = angular.module('movieApp', ['ngRoute']);

movieApp.config(function ($routeProvider){
    
    $routeProvider

    .when('/', {
        templateUrl: 'movie-spa/views/main.html',
        controller: 'mainController'
    })

    .when('/register', {
        templateUrl: 'movie-spa/views/register.html',
        controller: 'registerController'
    })

    .when('/movie/:movieTitle', {
        templateUrl: 'movie-spa/views/movie.html',
        controller: 'movieController'
    })

    .when('/admin', {
        templateUrl: 'movie-spa/views/admin.html',
        controller: 'adminController'
    })

    .when('/loginFailed', {
        templateUrl: 'movie-spa/views/loginFailed.html',
        controller: 'loginController'
    })

    .when('/movie/:movieTitle/reviews/:reviewID', {
        templateUrl: 'movie-spa/views/review.html',
        controller: 'reviewController'
    })

    .when('/myCollections', {
        templateUrl: 'movie-spa/views/collection.html',
        controller: 'createCollectionController'
    })

    .when('/myProfile', {
        templateUrl: 'movie-spa/views/myProfile.html',
        controller: 'myProfileController'
    })

    .otherwise({
        redirectTo: '/'
    })

});



