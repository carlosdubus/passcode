module.exports = function(module) {
    /**
     * IndexCtrl
     */
    module.controller('IndexCtrl',function($scope, $stateParams, modal, $http, $modal, Events) {
	if ($stateParams.confirmSent) {
	    modal.confirmEmail($stateParams.confirmSent);
	}

	$scope.events = Events.getList().$object;
    })
    /**
     * ViewEventController
     */
    .controller('ViewEventController', function($scope, event, Auth, Tickets, $state) {
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
    /**
     * MyTicketsController
     */
    .controller('MyTicketsController', function($scope, $state, tickets, Auth) {
	if (!Auth.user) {
	    return $state.go('index');
	}
	$scope.tickets = tickets;
    })
    /**
     * MyTicketsViewController
     */
    .controller('MyTicketsViewController', function($scope, ticket) {
	$scope.ticket = ticket;
    })
    /**
     * MainCtrl
     */
    .controller('MainCtrl', function() {

    })
    /**
     * LoginCtrl
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
	};
    })
    /**
     * SignUpCtrl
     */
    .controller('SignUpCtrl', function($scope, $http, modal, Users, $state) {

	$scope.data = {};
	$scope.hasError = false;

	$scope.dirty = function(form, name) {
	    return form.$submitted || form[name].$dirty;
	};

	$scope.invalid = function(form, name) {
	    return $scope.dirty(form, name) && form[name].$invalid;
	};

	$scope.error = function(name, error) {
	    return $scope.dirty($scope.form, name) && $scope.form[name].$error[error];
	};

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
    })
    /**
     * SelectEventCtrl
     */
    .controller('SelectEventCtrl', function($scope, $stateParams, AdminSession, $location, events) {
	$scope.needEventKey = $stateParams.needEventKey;

	$scope.events = events;
	$scope.currentEventKey = AdminSession['event-key'];

	$scope.selectEvent = function(eventKey) {
	    $scope.saved = false;
	    $scope.error = false;

	    if (eventKey) {
		$scope.saving = true;
		AdminSession.set('event-key', eventKey).then(function() {
		    $scope.saved = true;
		    $scope.saving = false;
		    $scope.currentEventKey = eventKey;
		    if ($stateParams.redirect) {
			$location.url($stateParams.redirect);
		    }
		}, function(response) {
		    $scope.saving = false;
		    $scope.error = response.data.error;
		});
	    }
	    else {
		$scope.error = {
		    message: "Event has no key."
		};
	    }
	};
    })
    /**
     * UseTicketCtrl
     */
    .controller('UseTicketCtrl', function(AdminSession, $stateParams, Restangular, $scope, $state) {
	$scope.error = false;
	$scope.success = false;

	$scope.changeEvent = function() {
	    var redirect = $state.href($state.current.name, $stateParams).replace('#!', '');

	    $state.go('admin/select-event', {
		redirect: redirect
	    });
	};

	Restangular.one('tickets', $stateParams.ticketToken).customPUT({
	    used: true,
	    eventKey: AdminSession['event-key']
	})
	.then(function() {
	    $scope.success = true;
	}, function(response) {
	    $scope.error = response.data.error;
	});
    })
    /**
     * EventsCtrl
     */
    .controller("EventsCtrl",function($scope, $stateParams, modal, $http, $modal, Events) {
	if ($stateParams.confirmed) {
	    modal.open('confirmed');
	}

	$scope.events = Events.getList().$object;
    })
};