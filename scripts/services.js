movieApp.service('databaseService',[ function(){

    this.users = [];
    this.movies = [];
    this.reviews = [];
    this.comments = [];


    this.get = function(type){
         this[type] = JSON.parse(localStorage.getItem(type));
         return this[type];
    };

    this.save = function(data, type){
        this.get();
        if(this[type] == null){
            this[type] = [];
        }
        this[type].push(data);
        console.log('save');
        localStorage.setItem(type, JSON.stringify(this[type]));
    };

    this.delete = function(username, type){
        this.get();

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

movieApp.service('loggedService',[ function(databaseService){
    
    this.saveCurrentUser = function(user){
        console.log(user);
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
        console.log('komt hier');

        if(loggedInUser) loggedService.deleteCurrentUser(); 
    };

}]);

movieApp.service('registerService',['databaseService', 'loggedService', function(databaseService, loggedService){
    
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

movieApp.service('movieService',['databaseService', 'loggedService', '$http', '$q', function(databaseService, loggedService, $http, $q){
    
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
           console.log(response.data);
           return response.data;
        });

    };

    this.getMovieDetails = function(id){
        
         return $http({
            method : "GET",
            url : "https://api.themoviedb.org/3/movie/" + id + "?api_key=ae36d2d591f1ca93a9e7dca55857410c&language=en-US"        
        }).then(function(response) {
           movies = response.data;
           console.log(response.data);
           return response.data;
        });

    };

    this.getMoviePoster = function(url){
        return "http://image.tmdb.org/t/p/w500/" + url;
    };


}]);

movieApp.service('reviewService',['databaseService', 'loggedService', function(databaseService, loggedService){
    

    this.getHighestID = function(type){

        var id;
        console.log(type);
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

        console.log(movieID);

        this.getReviewsOrComments(movieID, 'reviews').forEach(function(e, i){
            if(e.movieID === movieID || e.username === username){
                isAllowed = false;
            }
        });

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
                console.log('hier');
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
                    console.log(e.commentID);
                    deleteIndex = i;
            }
        });

        reviewsOrComments.splice(deleteIndex, 1);
        console.log(reviewsOrComments);
		localStorage.setItem( type , JSON.stringify(reviewsOrComments));
    };

}]);

