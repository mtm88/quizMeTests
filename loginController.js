describe('LoginController', function () {


    var LoginController,
        deferredJwtLogin,

        postDataMock,
        stateMock,

        scope,
        localStorageService,
        store;


    beforeEach(module('pmApp.LoginCtrl', 'LocalStorageModule'));


    beforeEach(inject(function ($controller, $q, _localStorageService_, $rootScope) {

        deferredJwtLogin = $q.defer();

        postDataMock = {
            findJwtUser: jasmine.createSpy('findJwtUser spy')
                .and.returnValue(deferredJwtLogin.promise)
        };

        friendListMock = {
            setOnlineStatus: jasmine.createSpy('setOnlineStatus spy')
        };

        stateMock = jasmine.createSpyObj('$state spy', ['go']);


        store = [];

        localStorageService = _localStorageService_;

        scope = $rootScope.$new();


        spyOn(localStorageService, 'get').and.callFake(function (key) {
            return store[key];
        });

        spyOn(localStorageService, 'set').and.callFake(function (key, value) {
            store[key] = value;
        });

        LoginController = $controller('LoginController', {
            '$state': stateMock,
            'postData': postDataMock,
            'friendList': friendListMock,
            localStorageService: localStorageService,
            $scope: scope
        });

    }));


    describe('jwt Login', function () {

        beforeEach(inject(function (_$rootScope_) {
            $rootScope = _$rootScope_;
            LoginController.username = 'gerion';
            LoginController.password = 'mtm';
            LoginController.jwtSignIn();
        }));

        it('should call login on postData', function () {

            expect(postDataMock.findJwtUser)
                .toHaveBeenCalledWith({'username': 'gerion', 'password': 'mtm'});
        });

        describe('when the login is executed', function () {

            it('if successful, should change state to home', function () {

                deferredJwtLogin.resolve({'wrongPassword': false});
                $rootScope.$digest();

                expect(friendListMock.setOnlineStatus).toHaveBeenCalledWith(undefined, undefined, true);

                expect(localStorageService.set).toHaveBeenCalledWith('loginService', 'jwt');
                expect(stateMock.go).toHaveBeenCalledWith('app.home');

            });

        });


    });

    describe('update login service status', function () {

        beforeEach(function () {

            localStorageService.set('loginService', 'jwt');

            LoginController.updateLoginStatus();

        });

        it('checks if JWT login services work and redirects to app.home',
            function () {

                expect(LoginController.logged_in).toEqual(true);

                expect(localStorageService.get).toHaveBeenCalledWith('loginService');
                expect(stateMock.go).toHaveBeenCalledWith('app.home');


            });

    });

});