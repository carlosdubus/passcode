module.exports = function(module) {
    module.config(function(RestangularProvider) {
	RestangularProvider.setBaseUrl('/api');
	//RestangularProvider.setRequestSuffix('.json');
    })
    .config(['$httpProvider', '$stateProvider', '$urlRouterProvider', '$locationProvider', function($httpProvider, $stateProvider, $urlRouterProvider, $locationProvider) {
	    $httpProvider.defaults.headers.common["X-Requested-With"] = 'XMLHttpRequest';

	    $locationProvider.hashPrefix('!');
	    // For any unmatched url, redirect to /state1
	    $urlRouterProvider.otherwise("/");

	    // Now set up the states
	    $stateProvider
	    .state('index', {
		url: "/?confirmSent",
		templateUrl: "index.html",
		controller: function($scope, $stateParams, modal, $http, $modal, Events) {

		    if ($stateParams.confirmSent) {
			modal.confirmEmail($stateParams.confirmSent);
		    }

		    $scope.events = Events.getList().$object;


		}
	    })
	    .state("login", {
		url: "/login?redirect&needToLogin",
		templateUrl: "login.html",
		controller: 'LoginCtrl',
		beforeFilter: 'guest'
	    })
	    .state("signup", {
		url: "/signup",
		templateUrl: "signup.html",
		beforeFilter: 'guest'
	    })
	    .state('events', {
		url: "/events?confirmed",
		templateUrl: "events.html",
		controller: function($scope, $stateParams, modal, $http, $modal, Events) {

		    if ($stateParams.confirmed) {
			modal.open('confirmed');
		    }

		    $scope.events = Events.getList().$object;


		}
	    })
	    .state("events:view", {
		url: "/events/:eventId",
		templateUrl: 'events/view.html',
		resolve: {
		    event: function(Events, $stateParams) {
			return Events.one($stateParams.eventId).get();
		    }
		},
		controller: 'ViewEventController'
	    })
	    .state('my-tickets', {
		url: "/my-tickets",
		templateUrl: "my-tickets.html",
		resolve: {
		    tickets: function(Tickets) {
			return Tickets().getList();
		    }
		},
		controller: 'MyTicketsController',
		beforeFilter: 'auth'
	    })
	    .state("my-tickets:view", {
		url: "/my-tickets/:ticketToken",
		templateUrl: "my-tickets/view.html",
		controller: 'MyTicketsViewController',
		beforeFilter: 'auth',
		resolve: {
		    ticket: function(Tickets, $stateParams) {
			return Tickets().one($stateParams.ticketToken).get();
		    }
		}
	    })
	    .state("error", {
		url: "/error?msg",
		templateUrl: "error.html",
		controller: function($scope, $stateParams) {
		    $scope.msg = $stateParams.msg;
		}
	    })
	    .state("admin/select-event", {
		url: "/admin/select-event?redirect&needEventKey",
		templateUrl: "admin/select-event.html",
		beforeFilter: "auth|admin",
		resolve: {
		    events: function(Restangular) {
			return Restangular.all('admin/events').getList();
		    }
		},
		controller: function($scope, $stateParams, AdminSession, $location, events) {
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
		}
	    })
	    .state("admin/use-ticket", {
		url: "/admin/use-ticket/:ticketToken",
		templateUrl: "admin/use-ticket.html",
		beforeFilter: "auth|admin|eventKey",
		controller: function(AdminSession, $stateParams, Restangular, $scope, $state) {

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
		}
	    })
	}])
};