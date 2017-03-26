movieApp.controller('movieController', ['$scope', '$location', 'databaseService','movieService', 'reviewService', 'loggedService', '$routeParams', function($scope, $location, databaseService, movieService, reviewService, loggedService, $routeParams){
    
    $scope.currentUser = loggedService.getCurrentUser();
    $scope.movieName = $routeParams.movieTitle;
    $scope.movie;
    $scope.reviews;
    $scope.poster;
    $scope.isAllowed;
    $scope.genres = [];
    $scope.cast;

    this.selectedMovie = function(){
             movieService.getMovies($routeParams.movieTitle).then(function(data){
                 var id = data.results[0].id;
                 getMovieCast(id);
                 $scope.isAllowed = reviewService.canEditOrSave(id, $scope.currentUser);
                 movieService.getMovieDetails(id).then(function(data){
                    $scope.movie = data;
                    getReviews(id, 'reviews');
                    $scope.poster = movieService.getMoviePoster($scope.movie.poster_path);
                    $scope.genres = getMovieGenres();
                 });
        });
    };

    var getReviews = function(movieID, type){
        $scope.reviews = reviewService.getReviewsOrComments(movieID, type);
    };

    var getMovieCast = function(movieID){

        movieService.getMovieCast(movieID).then(function(data){
            $scope.cast = data.cast;
        });
    }

    var getMovieGenres = function(){

        var genres;
        var movieGenres = [];

        movieService.getMovieGenres().then(function(data){
            genres = data;
            angular.forEach($scope.movie.genres, function(item1) {
                angular.forEach(genres.genres, function(item2) {
                    if(item1.id === item2.id) {
                         movieGenres.push(item2);
                    }
                });
               
            });
        });
         return movieGenres;
    };
     
    $scope.editReview = function(review){
        reviewService.deleteReview(review.movieID, review.username);
        $scope.isAllowed = true;
        $scope.review = review.review;
        getReviews($scope.movie.id, 'reviews');
    };

     $scope.saveReview = function(){
        databaseService.save({'movieID' : $scope.movie.id,'reviewID' : reviewService.getHighestID('reviews'), 'username' : $scope.currentUser.username, 'review' : $scope.review},'reviews');
        $scope.isAllowed = false;
        getReviews($scope.movie.id, 'reviews');
    };

    $scope.deleteReview = function(review){
        reviewService.deleteComments(review.reviewID);
        reviewService.deleteReviewOrComment(review.movieID, review.username, 'reviews');
        $scope.isAllowed = true;
        getReviews($scope.movie.id, 'reviews');
        $scope.review = '';
    };

    $scope.reviewPage = function(reviewID){
        $location.path('/movie/' + $routeParams.movieTitle + '/reviews/' + reviewID);
    }

    this.selectedMovie();
}]);

movieApp.controller('reviewController', ['$scope', 'databaseService', 'movieService', 'loggedService', 'reviewService', '$routeParams', function($scope, databaseService, movieService, loggedService, reviewService, $routeParams){

$scope.movieTitle;
$scope.review;
$scope.comments;
$scope.comment;
$scope.currentUser = loggedService.getCurrentUser();

    var getReview = function(){
        $scope.review = reviewService.getReview($routeParams.reviewID);
        movieService.getMovieDetails($scope.review.movieID).then(function(data){
            $scope.movieTitle = data.original_title;
        });
        getComments($scope.review.reviewID);
        console.log($scope.comments);
    };

    var getComments = function(reviewID){
        $scope.comments = reviewService.getReviewsOrComments(reviewID, 'comments');
    };

    $scope.editComment = function(comment){
        reviewService.deleteReviewOrComment(comment.commentID, comment.username, 'comments');
        $scope.comment = comment.comment;
        getComments($scope.review.reviewID);
    };

    $scope.saveComment = function(){
        databaseService.save({'reviewID' : $scope.review.reviewID, 'commentID' : reviewService.getHighestID('comments'), 'username' : $scope.currentUser.username , 'comment' : $scope.comment}, 'comments');
        getComments($scope.review.reviewID);
        $scope.comment = '';
    }

    $scope.deleteComment = function(comment){
        reviewService.deleteReviewOrComment(comment.commentID, comment.username, 'comments');
        getComments($scope.review.reviewID);
    };

    getReview();
}]);

movieApp.controller('adminController', ['$scope', 'databaseService', function($scope, databaseService){

    $scope.users = databaseService.get('users');

    $scope.removeUser = function(username){
        databaseService.delete(username, 'users');
    }

}]);

movieApp.controller('loginController', ['$scope', '$location', 'loginService', 'loggedService', 'movieService', function($scope, $location, loginService, loggedService, movieService){
    $scope.test = loggedService.getCurrentUser() != null;

    $scope.login = function(){
        if(loginService.login($scope.email, $scope.password)){
            $location.path('/');
        }
        else{
            $location.path('/loginFailed');
        }
    };

    $scope.logOut = function(){
        loginService.logOut();
    };
    
    $scope.go = function () {
        $location.path('/register');
    };

        $scope.movies;

    $scope.loadMovie = function(val){
        movieService.getMovies(val).then(function(data){
            $scope.movies = data;
            console.log($scope.movies);
        });
    };

    $scope.relocate = function(movieTitle){
        $location.path('/movie/' + movieTitle);
        console.log('hoi');
    };

    $scope.movie = function(){
        $location.path('/movie');
    };

}]);

movieApp.controller('mainController', ['$scope', 'movieService', '$location', function($scope, movieService, $location){

    $scope.movies = [];

    this.load = function(){
         movieService.getMoviesNowPlaying().then(function(data){
            $scope.movies = data;
         });
    }

    this.load();

}]);

movieApp.controller('registerController', ['$scope', 'databaseService', 'registerService', '$filter', function($scope, databaseService, registerService, $filter){
  
  $scope.save = function(){
        if(!registerService.uniqueUsername($scope.username) && !registerService.uniqueEmail($scope.email)){
            databaseService.save({firstname: $scope.firstname, lastname: $scope.lastname, username: $scope.username, mail: $scope.email, pass: $scope.password, type: 'User'}, 'users');
            console.log('save')
        }
  }


}]);

movieApp.controller('myProfileController', ['$scope', '$location', 'databaseService' , 'loggedService', function($scope, $location, databaseService, loggedService){

    $scope.currentUser = loggedService.getCurrentUser();
    var oldInformationUser = angular.copy($scope.currentUser);

    $scope.save = function(){
        loggedService.deleteCurrentUser();
        databaseService.delete(oldInformationUser.username, 'users');
        databaseService.save($scope.currentUser, 'users');
        loggedService.saveCurrentUser($scope.currentUser);
        $location.path('/');
    };

    this.repeat = function(){
        console.log(oldInformationUser);
    };

    this.repeat();
}]);