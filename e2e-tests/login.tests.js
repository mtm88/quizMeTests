describe('Clicking on the login with JWT button', function() {
	var loginButton;


	beforeEach(function() {
		browser.get('/app/login');
		loginButton = element.(by.linkText('Login with User / Password'));
	});

	it('should click on the button to go through to JWT login', function() {


		loginButton.click();

	});

})