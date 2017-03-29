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
        //beforeEach(module('registerService'));
    var $filter, registerService;

    beforeEach(function(){
        module('movieApp');

        inject(function(_$filter_, _registerService_){
            $filter = _$filter_;
            registerService = _registerService_;
        });
    });

    it('Should give an output when the username is already being used', function(){
   
        spyOn(registerService, 'uniqueUsername').and.returnValue(true);
        
        var input = 'username';

        result = $filter('usernameFilter')(input);

        expect(result).toBe('This username is already being used');
    });
});