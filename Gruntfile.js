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
	    js: {
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
	      dest: 'server/public/build/app.js',
	    },
	    css:{
	    	src:["bower_components/bootstrap/dist/css/bootstrap.min.css",
	    	"bower_components/font-awesome/index.css",
	    	"client/css/master.css",
	    	"client/css/events-list.css",
	    	"client/css/login-box.css"
	    	],
	    	dest: 'server/public/build/app.css'
	    }
	  }
  });

  // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks('grunt-html2js');
  grunt.loadNpmTasks('grunt-contrib-concat');

  // Default task(s).
  grunt.registerTask('default', ['html2js','concat']);

};