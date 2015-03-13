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
	  browserify: {
		  dist: {
		    files: {
		      'tmp/passcode.js': ['client/passcode.js'],
		    }
		  }
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
	      "tmp/passcode.js"],
	      dest: 'server/public/build/app.js',
	    },
	    css:{
	    	src:["bower_components/bootstrap/dist/css/bootstrap.min.css",
	    	"client/css/master.css",
	    	"client/css/events-list.css",
	    	"client/css/login-box.css"
	    	],
	    	dest: 'server/public/build/app.css'
	    }
	  },
	  copy: {
		  main: {
		  	flatten:true,
		  	expand:true,
		    src: 'bower_components/bootstrap/fonts/*',
		    dest: 'server/public/fonts/',
		  },
		}
  });

  // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks('grunt-html2js');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-browserify');

  // Default task(s).
  grunt.registerTask('default', ['html2js','browserify','concat','copy']);

};