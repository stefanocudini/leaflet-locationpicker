'use strict';

module.exports = function(grunt) {

grunt.loadNpmTasks('grunt-contrib-clean');
grunt.loadNpmTasks('grunt-contrib-jshint');
grunt.loadNpmTasks('grunt-contrib-watch');
grunt.loadNpmTasks('grunt-contrib-concat');
grunt.loadNpmTasks('grunt-contrib-uglify');
grunt.loadNpmTasks('grunt-markdown');

grunt.initConfig({
	pkg: grunt.file.readJSON('package.json'),
	meta: {
		banner:
		'/* \n'+
		' * Leaflet Location Picker v<%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd") %> \n'+
		' * \n'+
		' * Copyright <%= grunt.template.today("yyyy") %> <%= pkg.author.name %> \n'+
		' * <%= pkg.author.email %> \n'+
		' * <%= pkg.author.url %> \n'+
		' * \n'+
		' * Licensed under the <%= pkg.license %> license. \n'+
		' * \n'+
		' * Demo: \n'+
		' * <%= pkg.homepage %> \n'+
		' * \n'+
		' * Source: \n'+
		' * <%= pkg.repository.url %> \n'+
		' * \n'+
		' */\n',
		features: [
			"Custom location format, lat,lon separator and precision",
			"Pick Location Latidute,Longitude clicking on map",
			"Bind multiple events or single picker callback",
			"Load picker map from preselected location",
			"Bind callback on location picked",
			"Enable disable location marker",			
			"Custom map baselayer"			
		],
		sources: [
			{name: "Github.com", url: 'https://github.com/stefanocudini/<%= pkg.name %>' },
			{name: "Node Packaged Module", url: 'https://npmjs.org/package/<%= pkg.name %>' },
			//{name: "Bitbuket", url: 'https://bitbucket.org/zakis_/<%= pkg.name %>' },
			//{name: "Atmosphere", url: 'http://atmospherejs.com/package/<%= pkg.name %>' }
		]
	},	
	clean: {
		homepage: {
			src: ['index.html']
		},
		dist: {
			src: ['dist/*']
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
		files: "src/<%= pkg.name %>.js"
	},
	concat: {
		//TODO cut out SearchMarker
		options: {
			banner: '<%= meta.banner %>'
		},
		dist: {
			files: {
				'dist/<%= pkg.name %>.src.js': ['src/<%= pkg.name %>.js'],
				'dist/<%= pkg.name %>.src.css': ['src/<%= pkg.name %>.css']
			}
		}
	},
	uglify: {
		options: {
			banner: '<%= meta.banner %>'
		},
		dist: {
			files: {
				'dist/<%= pkg.name %>.min.js': ['dist/<%= pkg.name %>.src.js']
			}
		}
	},
	markdown: {
		readme: {
			files: {
				'index.html': ['README.md']
			},
			options: {
				template: 'index.tmpl',
				templateContext: function() {
					var cfg = grunt.config();
					
					cfg.title = cfg.pkg.name.replace(/-/g,' ');
					
					cfg.ribbonurl = 'http://ghbtns.com/github-btn.html?user=stefanocudini&amp;repo='+cfg.pkg.name+'&amp;type=watch&amp;count=true';				
					
					cfg.examples = grunt.file.expand('examples/*.html');

					cfg.features = cfg.meta.features;
					cfg.sources = cfg.meta.sources;
					cfg.giturl = cfg.meta.sources[0].url;
					
					cfg.image = grunt.file.expand('images/'+cfg.pkg.name+'.png');
					
					return cfg;
				},
				markdownOptions: {
					gfm: true,
					highlight: 'manual',
					codeLines: {
						before: '<div>',
						after: '</div>'
					}
				}
			}			
		}
	},
	watch: {
		dist: {
			options: { livereload: true },
			files: ['src/*'],
			tasks: ['clean','concat','jshint']
		}		
	}	
});

grunt.registerTask('default', [
	'clean',
	'concat',
	'jshint',
	'uglify',
	'markdown'
]);

};