"use strict";

var gulp = require('gulp');
var connect = require('gulp-connect'); //Runs a local web server
var open = require('gulp-open'); //Open a URL in Web Browser
var browserify = require('browserify'); // Bundles JS
var reactify = require('reactify'); // transform React JSX to JS
var source = require('vinyl-source-stream'); // Use conventional text stream with gulp
var concat = require('gulp-concat'); //Concat Files


var config = {

	port: 9005,
	devBaseUrl: 'http://localhost',
	paths: {
		html: './src/*.html',
		js: './src/**/*.js',
		css: [
			'node_modules/bootstrap/dist/css/bootstrap.min.css',
			'node_modules/bootstrap/dist/css/bootstrap-theme.min.css'
		],
		dist: './dist',
		mainJs: './src/main.js'
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

//JS Task
gulp.task('js', function(){

	browserify(config.paths.mainJs)
		.transform(reactify)
		.bundle()
		.on('error', console.error.bind(console))
		.pipe(source('bundle.js'))
		.pipe(gulp.dest(config.paths.dist + '/scripts'))
		.pipe(connect.reload())

});

//CSS Task
gulp.task('css', function(){

	gulp.src(config.paths.css)
		.pipe(concat('bundle.css'))
		.pipe(gulp.dest(config.paths.dist + '/css'));

});

//Watch task
gulp.task('watch', function(){
	gulp.watch(config.paths.html,['html']);
	gulp.watch(config.paths.js,['js']);
})

gulp.task('default',['html', 'js','css','open','watch']);

