describe('Filter: puntjesfilter', function(){

    var filter;

    beforeEach(function(){
        module('testApp.filter');
        inject(function($filter){
            filter = $filter('puntjesFilter');
        });
    });

    it("should add dots until the length less than 20", function(){
        var input = "Hallo Wereld!"; //13 chars
        var output = "Hallo Wereld!......."; //20 chars

        expect(filter(input)).toBe(output);
    });

    it("should not add dots when length is 20", function(){
        var input = "Goedemorgen Wereld!!"; //20 chars
        var output = "Goedemorgen Wereld!!"; //20 chars

        expect(filter(input)).toBe(output);
    });

    it("should return 20 dots when the string is undefined", function(){
        var input = undefined; //20 chars
        var output = "...................."; //20 chars

        expect(filter(input)).toBe(output);
    });

});