module.exports = function(module) {
    module.run(function($rootScope, Auth, $state, stateFilters) {
	$rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
	    // everytime the state is changing, apply the stateFilters, if any filter returns false, cancel the change of state
	    if (toState.beforeFilter) {
		var filters = toState.beforeFilter.split('|');
		for (var i = 0; i < filters.length; i++) {
		    var filter = filters[i];
		    var callback = stateFilters[filter];

		    if (callback) {
			var result = callback.apply(this, arguments);
			if (result === false) {
			    return;
			}
		    }
		}
	    }

	    $rootScope.stateLoading = true;
	})
	$rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
	    $rootScope.stateLoading = false;
	})
    });
};