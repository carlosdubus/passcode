module.exports = function(module) {
    /**
     * uniqueEmail
     * @param {type} Users
     * @returns {_L48.Anonym$3}
     */
    module.directive('uniqueEmail', function($http) {
	return {
	    require: 'ngModel',
	    restrict: 'A',
	    link: function(scope, el, attrs, ctrl) {

		ctrl.$parsers.push(function(viewValue) {
		    var email = ctrl.$modelValue;

		    if (email) {
			$http.post("/auth/email-exists", {email: viewValue})
				.success(function(result, status, headers, config) {
				    ctrl.$setValidity('uniqueEmail', !result.exists);
				});
		    }
		    return viewValue;
		});
	    }
	};
    })
    /**
     * validate emails are equal
     */
    .directive('sameEmail', function($http) {
	return {
	    require: 'ngModel',
	    restrict: 'A',
	    scope: {
		sameEmail: '='
	    },
	    link: function(scope, el, attrs, ctrl) {


		//console.log(scope.sameEmail);
		ctrl.$parsers.push(function(viewValue) {

		    if (viewValue) {

			ctrl.$setValidity('sameEmail', viewValue == scope.sameEmail);

			return viewValue;
		    }
		});
	    }
	};
    })

    .directive('preventDefault', function() {
	return {
	    restrict: 'A',
	    link: function(scope, el, attrs, ctrl) {

		el.bind('click', function(e) {
		    e.preventDefault();
		})
	    }
	};
    })
    .directive('toggle', function() {
	return {
	    restrict: 'A',
	    scope: {
		toggle: '@'
	    },
	    link: function(scope, el, attrs, ctrl) {

		if (scope.toggle == 'tooltip') {
		    el.tooltip();
		}
	    }
	};
    })
    .directive('authInit', function(Auth, $rootScope) {
	return {
	    restrict: 'A',
	    scope: {
		authInit: '='
	    },
	    link: function(scope, el, attrs, ctrl) {

		Auth.set(scope.authInit);
		$rootScope.auth = Auth;
	    }
	};
    })
    .directive('adminInit', function(AdminSession) {
	return {
	    restrict: 'A',
	    scope: {
		adminInit: '='
	    },
	    link: function(scope, el, attrs, ctrl) {
		AdminSession.init(scope.adminInit);
	    }
	};
    })
    .directive('formGroup', function() {
	return {
	    restrict: 'E',
	    templateUrl: 'form/form-group.html',
	    scope: {
		label: '@',
	    },
	    transclude: true,
	    link: function(scope, el, attrs, ctrl) {

		var form = scope.$parent.form;

		var name = el.find('input').attr('name');

		//scope.data = scope.$parent.data;
		scope.name = name;
		scope.form = form;
		scope.feedbackStyle = {};
		if (!scope.label) {
		    scope.feedbackStyle.top = '1px';
		}
	    }
	};
    });
};