movieApp.service('databaseService',[ function(){

    this.users = [];
    this.movies = [];
    this.reviews = [];
    this.comments = [];
    this.collections = [];


    this.get = function(type){
         this[type] = JSON.parse(localStorage.getItem(type));
         return this[type];
    };

    this.save = function(data, type){
        this.get(type);
        if(this[type] == null){
            this[type] = [];
        }
        this[type].push(data);
        localStorage.setItem(type, JSON.stringify(this[type]));
    };

    this.delete = function(username, type){
        this.get(type);
        var deleteIndex = -1;

        this[type].forEach(function(e, i){
            if(e.username === username){
                deleteIndex = i;
            }
        });

        this[type].splice(deleteIndex, 1);

		localStorage.setItem(type, JSON.stringify(this[type]));
    };
}]);

movieApp.service('firstStartupService',['databaseService', function(databaseService){

    this.loadAdmin = function(){
        if(databaseService.get('users') == null){
            databaseService.save({firstname: 'admin', lastname: 'admin', username: 'administrator', mail: 'admin@gmail.com', pass: 'pass', type: 'Admin'}, 'users');
        }
    };
}]);


movieApp.service('loggedService',[ function(){
    
    this.saveCurrentUser = function(user){
        localStorage.setItem('currentUser', JSON.stringify(user));
    };

    this.getCurrentUser = function(){
        return JSON.parse(localStorage.getItem('currentUser'));
    };

    this.deleteCurrentUser = function(){
        localStorage.removeItem('currentUser');
    };

}]);

movieApp.service('loginService',['databaseService', 'loggedService', function(databaseService, loggedService){
    
    this.users;

    this.login = function(email, password){
        this.users = databaseService.get('users');
        var loggedInUser;

        this.users.forEach(function(e, i) {
            if(e.mail == email && e.pass == password){
                loggedInUser = e;     
                loggedService.saveCurrentUser(loggedInUser);
            }
        })
        return loggedInUser;
    };

    this.logOut = function(){
        var loggedInUser = loggedService.getCurrentUser();

        if(loggedInUser) loggedService.deleteCurrentUser(); 
    };

}]);

movieApp.service('registerService',['databaseService', function(databaseService){
    
    this.uniqueUsername = function(username){
        var exists = false;

        users = databaseService.get("users");

        if(users != null){

            users.forEach(function(e, i){
                if(e.username == username){
                    exists = true;
                }
            })
            return exists;
        };
    }

    this.uniqueEmail = function(email){
        var exists = false;

        users = databaseService.get("users");

        if(users != null){

            users.forEach(function(e, i){
                if(e.mail == email){
                    exists = true;
                }
            })
            return exists;
        };
    }

}]);

movieApp.service('movieService',['$http', function($http){
    
    var movies;
    
    function foundMovies(){
        return movies;
    };

    this.getMovies = function(name){

        return $http({
            method : "GET",
            url : "https://api.themoviedb.org/3/search/movie?api_key=ae36d2d591f1ca93a9e7dca55857410c&query=" + name       
        }).then(function(response) {
           movies = response.data;
           return response.data;
        });

    };

    this.getMovieDetails = function(id){
        
         return $http({
            method : "GET",
            url : "https://api.themoviedb.org/3/movie/" + id + "?api_key=ae36d2d591f1ca93a9e7dca55857410c&language=en-US"        
        }).then(function(response) {
           movies = response.data;
           return response.data;
        });

    };

    this.getMoviePoster = function(url){
        return "http://image.tmdb.org/t/p/w500/" + url;
    };

    this.getMovieGenres = function(){

        return $http({
            method : "GET",
            url : "https://api.themoviedb.org/3/genre/movie/list?api_key=ae36d2d591f1ca93a9e7dca55857410c&language=en-US"        
        }).then(function(response) {
           movies = response.data;
           return response.data;
        });
    };

    this.getMovieCast = function(movieID){

         return $http({
            method : "GET",
            url : "https://api.themoviedb.org/3/movie/" + movieID + "/credits?api_key=ae36d2d591f1ca93a9e7dca55857410c"      
        }).then(function(response) {
           movies = response.data;
           return response.data;
        });
    };

    this.getMoviesNowPlaying = function(){

         return $http({
            method : "GET",
            url : "https://api.themoviedb.org/3/movie/now_playing?api_key=ae36d2d591f1ca93a9e7dca55857410c&language=en-US&page=1"   
        }).then(function(response) {
           movies = response.data;
           return response.data;
        });
    };



}]);

movieApp.service('reviewService',['databaseService', function(databaseService){
    

    this.getHighestID = function(type){

        var id;
        reviewsOrComments = databaseService.get(type) || [];

        if(reviewsOrComments.length != 0 && reviewsOrComments != null){
            if(type === 'reviews'){
                id = Math.max.apply(Math, reviewsOrComments.map(function(o){return o.reviewID;})) + 1;
            } else if(type === 'comments'){
                id = Math.max.apply(Math, reviewsOrComments.map(function(o){return o.commentID;})) + 1;
            } 
        }
        else{
            id = 0;
        }
        return id;
    };


    this.canEditOrSave = function(movieID, username){

        var isAllowed = true;

        this.getReviewsOrComments(movieID, 'reviews').forEach(function(e, i){
            if(e.movieID === movieID && e.username === username){
                isAllowed = false;
            }
        });

        if(username == null){ isAllowed = false};
        return isAllowed;
    };

    this.getReview = function(reviewID){

        var review;

        databaseService.get('reviews').forEach(function(e, i){
            if(e.reviewID == reviewID){
                review = e;
            }
        });

        return review;
    };
    
    this.getReviewsOrComments = function(id, type){

        var reviewsOrComments = [];

        if(databaseService.get(type) != null){
            databaseService.get(type).forEach(function(e, i){
            if(type === 'reviews' && e.movieID === id ){
                reviewsOrComments.push(e);
            }
            else if(type === 'comments' && e.reviewID === id){
                reviewsOrComments.push(e);
            }
        });
        }

        return reviewsOrComments;
    };


    this.deleteReviewOrComment = function(id, username, type){

        var reviewsOrComments = databaseService.get(type);

        var deleteIndex = -1;

        reviewsOrComments.forEach(function(e, i){
            if(type === 'reviews' && e.movieID === id && e.username === username){
                    deleteIndex = i;
            }
            else if(type === 'comments' && e.commentID === id && e.username === username){
                    deleteIndex = i;
            }
        });

        reviewsOrComments.splice(deleteIndex, 1);
		localStorage.setItem( type , JSON.stringify(reviewsOrComments));
    };

    this.deleteComments = function(id){

        var comments = databaseService.get('comments');
        var deleteIndex = -1;

        if(comments != null){
                    var i = comments.length;
        while(i--){
            if(comments[i].reviewID == id){
                comments.splice(i, 1);
            }
        }
        };
       localStorage.setItem('comments', JSON.stringify(comments));


    };

}]);

