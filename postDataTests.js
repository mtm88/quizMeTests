describe('SERVICE: PostData tests', function() {


	var postData,
	httpBackend,
	serverConstant,
	SERVER;

	SERVER = {
		url : 'http://192.168.0.4:5000'
	};

	beforeEach(module('pmApp.postDataServices', 'ionic', function($provide) {
		$provide.constant('SERVER', SERVER);
	}));
	

	beforeEach(inject(function($httpBackend, $q, $ionicLoading, $timeout,
	 $ionicPopup, _postData_) {
		
			postData = _postData_;
			httpBackend = $httpBackend;				

	}));


	afterEach(function() {
		httpBackend.verifyNoOutstandingExpectation();
		httpBackend.verifyNoOutstandingRequest();
	});



		it('should have an registerUser, findJwtUser, findFbUser functions',
		 function() {
			expect(angular.isFunction(postData.registerUser)).toBe(true);
			expect(angular.isFunction(postData.findJwtUser)).toBe(true);
			expect(angular.isFunction(postData.findFbUser)).toBe(true);
		});


		it('should answer with userData when called findJwtUser', function() {

			var possibleAnswersArray = [ true, false ];

			for( i = 0 ; i < 2 ; i++ ) {

			httpBackend.expectPOST(SERVER.url + '/api/jwtUserLogin').respond({ userExists : possibleAnswersArray[i]});

			expect(postData.findJwtUser).toBeDefined();

			var returnedPromise = postData.findJwtUser
			({ 'username' : 'testUser', 'password' : 'testPassword' });

			var findJwtUserResult;

			returnedPromise.then(function(response) {
				findJwtUserResult = response;
			});

			httpBackend.flush();

			expect(findJwtUserResult).toEqual({ userExists : possibleAnswersArray[i] });

			}

		});


		it('should answer with info wheter the user got registered', function() {

			httpBackend.expectPOST(SERVER.url + '/api/registerNewUser')
			.respond({ username : 'testUser', userToken : '12345', success : true });


			expect(postData.registerUser).toBeDefined();

			var returnedPromise = postData.registerUser
			({ username : 'testUser', password : 'testPassword' });

			var registerUserResult;

			returnedPromise.then(function(response) {
				registerUserResult = response;
			});

			httpBackend.flush();

			expect(registerUserResult).toEqual
			({ username : 'testUser', userToken : '12345', success : true })


		});


		it('should answer with FB userdata and if it\'s a new user', function() {

			httpBackend.expectPOST(SERVER.url + '/api/fbUserData')
				.respond({ correctUser : true, _id : null });

			expect(postData.findFbUser).toBeDefined();

			spyOn(console, 'log');

			var returnedPromise = postData.findFbUser(
				{ data : {
				 	userData : {
				 		username : 'testUser',
				 		password : 'testPassword'
					},
					token_fb : 'fbtoken12345',
					FBverified : true,
					userOrigin: 'fb'
					}
				}
			);

			var findFbUserResult;

			returnedPromise.then(function(response) {
				findFbUserResult = response;
			});

			httpBackend.flush();

			expect(console.log).toHaveBeenCalledWith('New user');
			expect(findFbUserResult).toEqual({ correctUser : true, _id : null });

		});


});