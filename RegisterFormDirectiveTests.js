describe('DIRECTIVE: Register form live validation', function () {

	var usernameElement,
	usernameNgModel,
	repassElement,
	repassNgModel,
	scope,
	element,

	SERVER;

	SERVER = {
		url : 'http://192.168.0.4:5000'
	};


	beforeEach(module('pmApp.registerFormDirectives', function($provide) {
		$provide.constant('SERVER', SERVER);
	}));

	beforeEach(inject(function($compile, $rootScope, $controller) {	
		scope = $rootScope.$new();
		usernameElement = $compile('<input type="text" name="username" ng-model="register_ctrl.username" user-availability-validator/>')(scope);
		usernameNgModel = usernameElement.controller('ngModel');

		passElement = $compile('<input type="password" name="password" ng-model="register_ctrl.password" ng-minlength="3" ng-maxlength="20" required clear-re-password/>')(scope);
		passNgModel = passElement.controller('ngModel');

		repassElement = $compile('<input type="password" name="RePassword" ng-model="register_ctrl.RePassword" ng-maxlength="20" password-validation required />')(scope);
		repassNgModel = repassElement.controller('ngModel');

		scope.$digest();
		

		}));


	it('should verify availbility of the username', inject(function($timeout, $httpBackend) {

		usernameNgModel.$setViewValue('1');

		expect(scope.isSearching).toBe(undefined);

		usernameNgModel.$setViewValue('12345');

		expect(scope.isSearching).toBe(true);

		expect(usernameElement.hasClass('ng-invalid-record-loading')).toBeTruthy();
		expect(usernameElement.hasClass('ng-invalid-record-available')).toBeFalsy();


		expect(scope.register_ctrl.username).toBe('12345');

		$httpBackend.expectPOST(SERVER.url + '/api/checkUsernameAvailability')
			.respond(
				{ 
					exists : false
				}
		);

		$timeout.flush();

		
		expect(usernameElement.hasClass('ng-valid-record-available')).toBeTruthy();
		expect(usernameElement.hasClass('ng-valid-record-loading')).toBeFalsy();

		$httpBackend.flush();


		afterEach(function() {
		$httpBackend.verifyNoOutstandingExpectation();
		$httpBackend.verifyNoOutstandingRequest();
		});
		

	}));


	beforeEach(function() {

		scope.registerForm = {
			password : {
				$valid : true
			}
		};

		scope.register_ctrl = {
			password : 'test123'
		};

	});


	it('should check if directive checks for matching passwords - valid test', function() {
		

		repassNgModel.$setViewValue('test123');

		expect(repassElement.hasClass('ng-valid-check-if-match')).toBeTruthy();
			

	});	


	it('should check if directive checks for matching passwords - invalid test', function() {
		

		repassNgModel.$setViewValue('test321');

		expect(repassElement.hasClass('ng-valid-check-if-match')).toBeFalsy();
			

	});	



	it('should check if directives clear rePass if new pass is inserted', function() {


		scope.registerForm = {
			RePassword : repassNgModel,
			password : passNgModel
		};

				
		passNgModel.$setViewValue('test1');

		repassNgModel.$setViewValue('test1');

		expect(scope.registerForm.RePassword.$viewValue).toBe('test1');

		passNgModel.$setViewValue('test2');

		expect(scope.registerForm.RePassword.$viewValue).toBe(null);



	})

























});