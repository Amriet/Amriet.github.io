
movieApp.filter('countInputFilter', [function(){
    return function(input) {
        input = input || '';

        if(input.length <= 3 )
        {
           return "This password is not long enough";
        }
    };
}]);

movieApp.filter('usernameFilter', ['registerService',function(registerService){
    return function(input){
        input = input || '';

        if(input.length <= 5){
            return 'This username is not long enough';
        }
        else if(registerService.uniqueUsername(input)){
            return 'This username is already being used';
        }

    };
}]);

movieApp.filter('emailFilter', ['registerService', function(registerService){
    return function(input){
        input = input || '';
        var emailSyntax = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

        if(!emailSyntax.test(input)){
            return 'Please enter a valid email address';
        }
        else if(registerService.uniqueEmail(input)){
            return 'This email address is already being used';
        }

    };
}]);