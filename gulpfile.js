"use strict";

var gulp = require('gulp');
var connect = require('gulp-connect'); //Runs a local web server
var open = require('gulp-open'); //Open a URL in Web Browser

var config = {

	port: 9005,
	devBaseUrl: 'http://localhost',
	paths: {
		html: './src/*.html',
		dist: './dist'
	}
}

//Start a local development Server
gulp.task('connect', function(){

	connect.server({
		root: ['dist'],
		port: config.port,
		base: config.devBaseUrl,
		livereload: true
	});

});

//Open the Url
gulp.task('open', ['connect'], function(){

	gulp.src('dist/index.html')
		.pipe(open({uri: config.devBaseUrl + ":"+ config.port+'/'}));

});

// Move the HTML to Dist Folder
gulp.task('html',function(){

	gulp.src(config.paths.html)
		.pipe(gulp.dest(config.paths.dist))
		.pipe(connect.reload());
});


//Watch task
gulp.task('watch', function(){
	gulp.watch(config.paths.html,['html']);
})

gulp.task('default',['html','open','watch']);

