module.exports = function(module) {
    /**
     * RestangularProvider
     */
    module.config(function(RestangularProvider) {
	RestangularProvider.setBaseUrl('/api');
    })
    /**
     * Config states
     */
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
	    controller: "IndexCtrl"
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
	    controller: 'EventsCtrl'
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
	    controller: 'SelectEventCtrl'
	})
	.state("admin/use-ticket", {
	    url: "/admin/use-ticket/:ticketToken",
	    templateUrl: "admin/use-ticket.html",
	    beforeFilter: "auth|admin|eventKey",
	    controller: "UseTicketCtrl"
	});
    }]);
};