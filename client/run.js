module.exports = function(module){
    module.run(function($rootScope,Auth,$state,stateFilters){
	$rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams){ 

	    // hotfix for navbar
	    // on mobile, navbar was not closing when chaging states, so I added this jquery code, I know this is not the place bla bla...
	    $('.navbar-collapse').removeClass('in');

	    if(toState.beforeFilter){
		var filters = toState.beforeFilter.split('|');
		for(var i = 0;i < filters.length;i++){
		    var filter = filters[i];
		    var callback = stateFilters[filter];

		    if(callback){
			var result = callback.apply(this,arguments);
			if(result === false){
			    return;
			}
		    }
		}
	    }

	    $rootScope.stateLoading = true;
	})
	$rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams){ 
	    $rootScope.stateLoading = false;
	})
    });
};