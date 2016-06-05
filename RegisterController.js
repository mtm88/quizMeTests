describe('Register Controller', function () {


    var RegisterController,
        localStorageService,
        store;

    beforeEach(module('pmApp.RegisterCtrl', 'LocalStorageModule'));


    beforeEach(inject(function ($controller, $q, _localStorageService_) {

        deferredRegisterUser = $q.defer();

        postDataMock = {
            registerUser: jasmine.createSpy('registerUser spy')
                .and.returnValue(deferredRegisterUser.promise)
        };

        stateMock = jasmine.createSpyObj('$state spy', ['go']);

        friendListMock = {
            setOnlineStatus: jasmine.createSpy('setOnlineStatus spy')
        };

        localStorageService = _localStorageService_;

        spyOn(localStorageService, 'set').and.callFake(function (key, value) {
            store[key] = value;
        });


        RegisterController = $controller('RegisterController', {
            '$state': stateMock,
            'postData': postDataMock,
            'friendList': friendListMock,
            localStorageService: localStorageService
        });

    }));


    describe('check login services', function () {

        beforeEach(inject(function (_$rootScope_) {

            store = [];

            $rootScope = _$rootScope_;

            RegisterController.username = 'testUser';
            RegisterController.password = 'testPassword';

            RegisterController.register();


        }));


        it('should call register on postData', function () {
            expect(postDataMock.registerUser)
                .toHaveBeenCalledWith(
                    {username: 'testUser', password: 'testPassword'});
        });


        it('should call set on localStorageService', function () {

            deferredRegisterUser.resolve(
                {
                    newUser: {
                        username: 'testUser',
                        userToken: '12345'
                    }
                }
            );

            $rootScope.$digest();

            expect(friendListMock.setOnlineStatus).toHaveBeenCalledWith(undefined, undefined, true);

            expect(localStorageService.set).toHaveBeenCalled();

            expect(RegisterController.logged_in).toEqual(true);

            expect(stateMock.go).toHaveBeenCalledWith('app.home');

        });


    });

    describe('check HOME button', function () {

        beforeEach(function () {
            RegisterController.returnHome();
        });

        it('should go back to home screen', function () {
            expect(stateMock.go).toHaveBeenCalledWith('app.login');
        });

    })


});