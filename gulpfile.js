"use strict";

var gulp = require('gulp');
var connect = require('gulp-connect'); //Runs a local web server
var open = require('gulp-open'); //Open a URL in Web Browser
var browserify = require('browserify'); // Bundles JS
var reactify = require('reactify'); // transform React JSX to JS
var source = require('vinyl-source-stream'); // Use conventional text stream with gulp
var concat = require('gulp-concat'); //Concat Files
var lint = require('gulp-eslint'); //Lint JS files including JSX


var config = {

	port: 9005,
	devBaseUrl: 'http://localhost',
	paths: {
		html: './src/*.html',
		js: './src/**/*.js',
		images: './src/images/*',
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

//Lint Task
gulp.task('lint',function(){

	return gulp.src(config.paths.js)
		.pipe(lint({config: 'eslint.config.json'}))
		.pipe(lint.format());

});

//Images Task
gulp.task('images', function(){

	gulp.src(config.paths.images)
		.pipe(gulp.dest(config.paths.dist+ '/images'))
		.pipe(connect.reload());

		//Publish favicon
		gulp.src('./src/favicon.ico')
			.pipe(gulp.dest(config.paths.dist));

});

//Watch task
gulp.task('watch', function(){
	gulp.watch(config.paths.html,['html']);
	gulp.watch(config.paths.js,['js','lint']);
})

gulp.task('default',['html', 'js','css','images','lint','open','watch']);

