describe('E2E : Log in as an Administrator', function(){

    beforeEach(function(){
        browser.get('http://localhost:8080');
    });

    it('Should log in as an administrator', function(){

        var alreadyAccount = browser.findElement(by.className('navbar-text'));

        expect(alreadyAccount.getText()).toBe("Already have an account?");

        var loginDropdown = browser.findElement(by.className('dropdown'));
        loginDropdown.click();
        browser.waitForAngular();

        expect(element(by.css('[href="#!/admin"]')).isDisplayed()).toBeFalsy();

        var loginButton = browser.findElement(by.className('btn btn-primary btn-block'));
        expect(loginButton.getText()).toBe("Sign in");

        var email = browser.findElement(by.model('email'));
        var password = browser.findElement(by.model('password'));

        email.sendKeys("admin@gmail.com");
        password.sendKeys("pass");

        loginButton.click();
        browser.waitForAngular();

        var adminButton = browser.findElement(by.css('[href="#!/admin"]'));
        expect(adminButton.getText()).toBe("Admin");
        expect(element(by.css('[href="#!/admin"]')).isDisplayed()).toBeTruthy();
    });
});

describe('E2E : Find a movie with the search box', function(){

    beforeEach(function(){
        browser.get('http://localhost:8080');
    });

    it('Should find the given movie', function(){

        var searchBox = browser.findElement(by.className('search'));

        expect((searchBox).isDisplayed()).toBeTruthy();

        searchBox.sendKeys('The Matrix');
        searchBox.sendKeys(protractor.Key.ENTER);
        browser.waitForAngular();

        var movieTitle = browser.findElement(by.className('movie-title'));
        expect(movieTitle.getText()).toBe('The Matrix');

        var duration = element(by.className('movie-meta')).all(by.tagName('li')).get(0);
        var release = element(by.className('movie-meta')).all(by.tagName('li')).get(1);
        var categorie = element(by.className('movie-meta')).all(by.tagName('li')).get(2);
        expect(duration.getText()).toBe('Length: 136 min');
        expect(release.getText()).toBe('Premiere: Mar 30, 1999');
        expect(categorie.getText()).toBe('Category: Action, Science Fiction');

    });
});