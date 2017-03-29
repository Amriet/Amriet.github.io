var movieApp = angular.module('movieApp', ['ngRoute']);

movieApp.config(function ($routeProvider){
    
    $routeProvider

    .when('/', {
        templateUrl: 'movie-spa/views/main.html',
        controller: 'mainController'
    })

    .when('/register', {
        templateUrl: 'views/register.html',
        controller: 'registerController'
    })

    .when('/movie/:movieTitle', {
        templateUrl: 'views/movie.html',
        controller: 'movieController'
    })

    .when('/admin', {
        templateUrl: 'views/admin.html',
        controller: 'adminController'
    })

    .when('/loginFailed', {
        templateUrl: 'views/loginFailed.html',
        controller: 'loginController'
    })

    .when('/movie/:movieTitle/reviews/:reviewID', {
        templateUrl: 'views/review.html',
        controller: 'reviewController'
    })

    .when('/myCollections', {
        templateUrl: 'views/collection.html',
        controller: 'createCollectionController'
    })

    .when('/myProfile', {
        templateUrl: 'views/myProfile.html',
        controller: 'myProfileController'
    })

    .otherwise({
        redirectTo: '/'
    })

});



