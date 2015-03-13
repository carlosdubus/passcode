module.exports = function(module) {
    /**
     * stateFilters
     */
    module.factory("stateFilters", function($state, Auth, AdminSession) {
	return {
	    'guest': function(event) {
		if (Auth.loggedIn) {
		    event.preventDefault();
		    $state.go('my-tickets');
		    return false;
		}
	    },
	    'auth': function(event, toState, toParams) {
		if (!Auth.loggedIn) {
		    var redirect = $state.href(toState, toParams).replace("#!", "");
		    event.preventDefault();
		    $state.go('login', {redirect: redirect, needToLogin: true});
		    return false;
		}
	    },
	    'admin': function(event) {
		if (!Auth.isAdmin()) {
		    event.preventDefault();
		    $state.go('error', {msg: "Permission denied."});
		    return false;
		}
	    },
	    'eventKey': function(event, toState, toParams) {
		if (!AdminSession['event-key']) {
		    var redirect = $state.href(toState, toParams).replace("#!", "");
		    event.preventDefault();
		    $state.go('admin/select-event', {
			redirect: redirect,
			needEventKey: true
		    });
		    return false;
		}
	    }
	};
    })
    /**
     * Events
     * @param {type} Restangular
     */
    .factory('Events', function(Restangular) {
	return Restangular.service('events');
    })
    /**
     * 
     * @param {type} Restangular
     * @param {type} Auth
     * @returns {Function}
     */
    .factory('Tickets', function(Restangular, Auth) {
	return function() {
	    var user = Auth.user;
	    var userId = user ? user.id : 0;
	    return Restangular.service('users/' + userId + '/tickets');
	};
    })
    /**
     * 
     * @param {type} Restangular
     * @returns {unresolved}
     */
    .service("Users",function(Restangular){
	return Restangular.service('users');
    })
    /**
     * To create modals easily
     * @param {type} $modal
     * @returns {module.exports._L65.modal}
     */
    .factory('modal', function($modal) {
	var modal = {};

	modal.open = function(url, scope, callback) {
	    var modalInstance = $modal.open({
		templateUrl: '' + url + '.html',
		controller: function($scope, $modalInstance) {

		    if (scope) {
			for (var k in scope) {
			    $scope[k] = scope[k];
			}
		    }

		    $scope.modal = $modalInstance;

		}
	    });

	    if (callback) {
		modalInstance.result.then(callback);
	    }
	};

	modal.confirmEmail = function(email) {
	    modal.open('modal/confirm-email', {email: email})
	};

	modal.login = function(scope) {
	    if (!scope) {
		scope = {};
	    }

	    scope.switchToSignUp = function() {
		this.modal.close();
		modal.signup();
	    };

	    this.open('modal/login', scope);
	};

	modal.signup = function() {
	    this.open('modal/signup', {
		switchToLogin: function() {
		    this.modal.close();
		    modal.login();
		}
	    });
	};


	return modal;
    })
    .service('Auth', function() {
	this.loggedIn = false;
	this.user = null;
	this.isAdmin = function() {
	    return this.user && this.user.role === "admin";
	};

	this.set = function(data) {
	    for (var i in data) {
		this[i] = data[i];
	    }
	};

    })
    .service('AdminSession', function(Restangular) {

	this.set = function(name, value) {
	    var self = this;
	    return Restangular.one('admin/session', name).customPUT({
		value: value
	    })
		    .then(function() {
			self[name] = value;
		    });
	};

	this.init = function(data) {
	    for (var i in data) {
		this[i] = data[i];
	    }
	};
    });
};