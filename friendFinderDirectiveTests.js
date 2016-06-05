describe('DIRECTIVE: friend finder live search', function () {

    var scope,
        friendfinderElement,
        friendfinderNgModel,

        SERVER;

    SERVER = {
        url: 'http://192.168.0.4:5000'
    };


beforeEach(module('pmApp.friendFinderDirectives', 'LocalStorageModule', function ($provide) {
    $provide.constant('SERVER', SERVER);
}));


beforeEach(inject(function ($compile, $rootScope) {

    scope = $rootScope.$new();

    $rootScope.friend_ctrl = { friendList : undefined };

    searchDbForFriendMock = jasmine.createSpy('search for Friend spy');

    friendfinderElement = $compile('<form name="friendfinderForm">' +
        '<input type="text" name="userfield"' +
        'ng-model="friendfinder.userfield" friend-finder>' +
        '</form>')(scope);

    scope.$digest();

}));

    it('should trigger the directive on text input', inject(function($timeout, $httpBackend) {

        formdata = scope.friendfinderForm;

        scope.friendfinder = { userfield : null };

        formdata.userfield.$setViewValue('testFriend');

        expect(formdata.userfield.$modelValue).toEqual('testFriend');
        expect(scope.friendfinder.userfield).toEqual('testFriend');

        expect(formdata.userfield.$invalid).toBe(true);

        $httpBackend.expectPOST(SERVER.url + '/api/friendFinder')
            .respond({ friendExists : 'yes'});

        $timeout.flush();

        expect(scope.loadingData).toBe(true);

        $httpBackend.flush();

        expect(scope.loadingData).toBe(false);

        expect(scope.friendData.friendExists).toBe(true);


        //expect(searchDbForFriendMock).toHaveBeenCalled();
        



        afterEach(function() {
            $httpBackend.verifyNoOutstandingExpectation();
            $httpBackend.verifyNoOutstandingRequest();
        });


    }));





});