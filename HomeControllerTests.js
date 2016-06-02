describe('HomeController', function() {

	var localStorageService,
	store,
	HomeController,
	stateMock,
	intervalSpy;


	beforeEach(module('pmApp.HomeCtrl', 'LocalStorageModule'));


		beforeEach(inject(function($controller, $q, _localStorageService_, $rootScope, $interval) {


			deferredcheckLoginOrigin = $q.defer();
			deferredFindFbUser = $q.defer();
			deferredFbConnectPlugin = $q.defer();

			loginOriginMock = {
				checkLoginOrigin : jasmine.createSpy('checkLoginOrigin spy')
											.and.returnValue(deferredcheckLoginOrigin.promise)
			};

			postDataMock = {
				findFbUser : jasmine.createSpy('findFbUser spy')
											.and.returnValue(deferredFindFbUser.promise)
			};

			facebookConnectPlugin = {
				api : jasmine.createSpy('api spy'),
											
				logout : jasmine.createSpy('logout spy')

			};

			intervalSpy = jasmine.createSpy('$interval', $interval).and.callThrough();;

			spyOn(intervalSpy, 'cancel');

			store = [];

			localStorageService = _localStorageService_;

			scope = $rootScope.$new();


			spyOn(localStorageService, 'get').and.callFake(function(key) {
				return store[key];
			});

			spyOn(localStorageService, 'set').and.callFake(function(key, value) {
				store[key] = value;
			});



			stateMock = jasmine.createSpyObj('$state spy', ['go']);


			HomeController = $controller('HomeController', {
				'loginOrigin' : loginOriginMock,
				'postData' : postDataMock,
				'$state' : stateMock,
				$interval : intervalSpy,
				localStorageService : localStorageService,
				$scope : scope
			});


		}));



		describe('veryfing user login origin and data', function() {

			beforeEach(function() {
				localStorageService.set('username', 'testUsername');
				HomeController.getUserInfo();
			});


			it('should call getUserInfo and wait for response', function() {

				expect(scope.userDetails).toBe(undefined);

				expect(loginOriginMock.checkLoginOrigin).toHaveBeenCalled();


			});


			it('should choose JWT as login service', function() {

				deferredcheckLoginOrigin.resolve('jwt');

				scope.$digest();

				expect(localStorageService.set).toHaveBeenCalledWith('username', 'testUsername');

			});



			it('should choose FB as login service and set data', function() {

				deferredcheckLoginOrigin.resolve('fb');

				scope.$digest();

				expect(localStorageService.get).toHaveBeenCalledWith('user.id');
				expect(localStorageService.get).toHaveBeenCalledWith('user.authToken');
				expect(facebookConnectPlugin.api).toHaveBeenCalled();


			})



		});

		describe('user LOGOUT button go to back to login screen', function() {

			beforeEach(function() {

				HomeController.logout();

				expect(localStorageService.get).toHaveBeenCalledWith('loginService');
			});


			it('should cancel friend list interval', function() {	

				expect(intervalSpy.cancel).toHaveBeenCalled();

			});


			it('should go back to app.login state', function() {
				expect(stateMock.go).toHaveBeenCalledWith('app.login');
			});


		})



})