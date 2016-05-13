var gulp = require('gulp');
var plumber = require('gulp-plumber');
var htmlhint = require('gulp-htmlhint');
var scsslint = require('gulp-scss-lint');
var eslint = require('gulp-eslint');
var config = require('../config/config');

// HTML hint task
gulp.task('htmlhint:built', function() {
	return gulp.src(config.lint.targets.built.html)
	.pipe(plumber())
	.pipe(htmlhint())
	.pipe(htmlhint.reporter());
});

// SCSS lint task
gulp.task('scsslint', function() {
	return gulp.src(config.lint.targets.scss)
	.pipe(plumber())
	.pipe(scsslint({
		config: 'gulp/config/scsslint.yml'
	}));
});

// JavaScript lint task
gulp.task('eslint', function() {
	return gulp.src(config.lint.targets.js)
	.pipe(plumber())
	.pipe(eslint(config.eslint))
	.pipe(eslint.format())
	.pipe(eslint.failAfterError());
});

// Built JavaScript lint task
gulp.task('eslint:built', function() {
	return gulp.src(config.lint.targets.built.js)
	.pipe(plumber())
	.pipe(eslint(config.eslint))
	.pipe(eslint.format())
	.pipe(eslint.failAfterError());
});

// Lint all
gulp.task('lint', [
	'htmlhint:built',
	'scsslint',
	'eslint',
	'eslint:built'
]);
