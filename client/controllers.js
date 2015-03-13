module.exports = function(module) {
    
    module.controller('ViewEventController', function($scope, event, Auth, Tickets, $state) {
	$scope.event = event;

	$scope.buyTicket = function() {

	    $scope.buying = true;
	    $scope.hasError = false;
	    Tickets().post({
		eventId: event.id
	    })
		    .then(function(res) {
			$state.go('my-tickets:view', {
			    ticketToken: res.token
			});
		    }, function() {
			$scope.hasError = true;
			$scope.buying = false;
		    });


	};
    })
    .controller('MyTicketsController', function($scope, $state, tickets, Auth) {

	if (!Auth.user) {
	    return $state.go('index');
	}

	$scope.tickets = tickets;


    })
    .controller('MyTicketsViewController', function($scope, ticket) {
	$scope.ticket = ticket;
    })
    /**
     * MainCtrl
     * @param {type} loginModal
     * @returns {undefined}
     */
    .controller('MainCtrl', function() {

    })

    /**
     * LoginCtrl
     * @returns {undefined}
     */
    .controller('LoginCtrl', function($scope, $http, $window, $state, $stateParams, Auth, $location) {

	$scope.needToLogin = $stateParams.needToLogin;

	$scope.submit = function(form, $event) {
	    if ($event) {
		$event.preventDefault();
	    }


	    form.$submitted = true;
	    form.$setValidity('validCredentials', true);

	    if (form.$valid) {
		form.$submitting = true;
		$http({
		    url: "/auth/login",
		    method: "POST",
		    data: $scope.data
		}).success(function(data, status, headers, config) {
		    form.$submitting = data.loggedIn;
		    form.$setValidity('validCredentials', data.loggedIn);

		    if (form.$valid) {
			Auth.set(data);

			var redirect = '/my-tickets';
			if ($stateParams.redirect) {
			    redirect = $stateParams.redirect;
			}



			$location.url(redirect);
		    }

		}).error(function(data, status, headers, config) {

		});
	    }
	}
    })
    .controller('SignUpCtrl', function($scope, $http, modal, Users, $state) {

	$scope.data = {};
	$scope.hasError = false;

	$scope.dirty = function(form, name) {
	    return form.$submitted || form[name].$dirty;
	};

	$scope.invalid = function(form, name) {
	    return $scope.dirty(form, name) && form[name].$invalid;
	}

	$scope.error = function(name, error) {
	    return $scope.dirty($scope.form, name) && $scope.form[name].$error[error];
	}

	$scope.submit = function(form, $event) {
	    if ($event) {
		$event.preventDefault();
	    }


	    form.$submitted = true;

	    if (form.$valid) {

		form.$submitting = true;

		Users
			.post($scope.data)
			.then(function(res) {
			    form.$submitting = false;
			    $state.go('index', {
				confirmSent: $scope.data.email
			    });
			}, function(res) {
			    form.$submitting = false;
			    $scope.hasError = true;
			});
	    }
	};
    });
};