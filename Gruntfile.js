'use strict';

module.exports = function(grunt) {

grunt.initConfig({
	pkg: grunt.file.readJSON('package.json'),
	clean: {
		dist: {
			src: ['index.html']
		}
	},
	jshint: {
		options: {
			globals: {
				console: true,
				module: true
			},
			"-W099": true,	//ignora tabs e space warning
			"-W033": true,
			"-W044": true	//ignore regexp
		},
		files: ["<%= pkg.name %>.js"]
	},
	markdown: {
		readme: {
			files: {
				'index.html': ['README.md']
			}
		}
	}
});

grunt.registerTask('default', [
	'clean',
	'jshint',
	'markdown'
]);

grunt.loadNpmTasks('grunt-contrib-clean');
grunt.loadNpmTasks('grunt-contrib-jshint');
grunt.loadNpmTasks('grunt-markdown');
};