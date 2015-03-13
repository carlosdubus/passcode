$(function(){
	$(document).click(function(){
	    // hotfix for navbar
	    // on mobile, navbar was not closing when chaging states, so I added this jquery code, I know this is not the place bla bla...
	    $('.navbar-collapse').removeClass('in');
	});
});