module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    html2js: {
	    options: {
	      base:"client/templates/"
	    },
	    main: {
	      src: ['client/templates/**/*.html'],
	      dest: 'tmp/templates.js'
	    },
	  },
	  concat: {
	    options: {
	      
	    },
	    dist: {
	      src: ["bower_components/jquery/dist/jquery.min.js",
	      "bower_components/bootstrap/dist/js/bootstrap.min.js",
	      "bower_components/angular/angular.min.js",
	      "bower_components/lodash/dist/lodash.min.js",
	      "bower_components/restangular/dist/restangular.min.js",
	      "bower_components/angular-bootstrap/ui-bootstrap.min.js",
	      "bower_components/angular-bootstrap/ui-bootstrap-tpls.min.js",
	      "bower_components/angular-ui-router/release/angular-ui-router.min.js",
	      "tmp/templates.js",
	      "client/passcode.js"],
	      dest: 'server/public/js/app.js',
	    },
	  }
  });

  // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks('grunt-html2js');
  grunt.loadNpmTasks('grunt-contrib-concat');

  // Default task(s).
  grunt.registerTask('default', ['html2js','concat']);

};