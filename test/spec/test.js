describe('The countInput filter', function(){
    var $filter;

    beforeEach(function(){
        module('movieApp');

        inject(function(_$filter_){
            $filter = _$filter_;
        });
    });

    it('Should give an output when the length of the input is <= 3', function(){

        var input = 'tes';

        result = $filter('countInputFilter')(input);

        expect(result).toBe("This password is not long enough");
    });

    it('Should not give an output when the length of the input is > 3', function(){

        var input = 'test';

        result = $filter('countInputFilter')(input);

        expect(result).toBeUndefined();
    });
});

describe('The username filter', function(){

    var $filter, registerService;

    beforeEach(function(){
        module('movieApp');

        inject(function(_$filter_, _registerService_){
            $filter = _$filter_;
            registerService = _registerService_;
        });
    });

    it('Should give an output when length of the username is <= 5', function(){

        var input = 'user';

        result = $filter('usernameFilter')(input);

        expect(result).toBe('This username is not long enough');
    });

    it('Should give an output when the username is already being used', function(){
   
        spyOn(registerService, 'uniqueUsername').and.returnValue(true);
        
        var input = 'username';

        result = $filter('usernameFilter')(input);

        expect(result).toBe('This username is already being used');
    });

    it('Should not give an output when the length of the username is > 5 and is unique', function(){

        spyOn(registerService, 'uniqueUsername').and.returnValue(false);

        var input = 'username';

        result = $filter('usernameFilter')(input);

        expect(result).toBeUndefined();

        
    });
});

describe('The email filter', function(){

    var $filter, registerService;

    beforeEach(function(){
        module('movieApp');

        inject(function(_$filter_, _registerService_){
            $filter = _$filter_;
            registerService = _registerService_;
        });
    });

    it('Should give an output when the email syntax is wrong', function(){

        var input = 'wrongEmailSyntax';

        result = $filter('emailFilter')(input);

        expect(result).toBe('Please enter a valid email address');
    });

    it('Should give an output when the email is already being used', function(){
   
        spyOn(registerService, 'uniqueEmail').and.returnValue(true);
        
        var input = 'email@hotmail.com';

        result = $filter('emailFilter')(input);

        expect(result).toBe('This email address is already being used');
    });

    it('Should not give an output when the email has a good syntax and is unique', function(){

        spyOn(registerService, 'uniqueEmail').and.returnValue(false);

        var input = 'email@hotmail.com';

        result = $filter('emailFilter')(input);

        expect(result).toBeUndefined();

        
    });
});
