var glob = require('glob');
var path = require('path');
var fs = require('fs');
var gulp = require('gulp');
var rename = require('gulp-rename');
var plumber = require('gulp-plumber');
var mustache = require('gulp-mustache');
var uglify = require('gulp-uglify');
var sass = require('gulp-ruby-sass');
var htmlmin = require('gulp-htmlmin');

// Get build targets base name
function getBaseNames() {
	var baseNames = [];
	
	for (var name of glob.sync('src/html/*.html')) {
		baseNames.push(path.basename(name, '.html'));
	}
	
	return baseNames;
}

// JavaScript merge task (with mustache)
gulp.task('build:merge:js', function(callback) {
	var baseNames = getBaseNames();
	var doneCount = 0;
	
	for (var baseName of baseNames) {
		var params = {};
		
		for (var fileName of glob.sync('src/js/' + baseName + '/*.js')) {
			var name = path.basename(fileName, '.js');
			params[name] = fs.readFileSync(fileName).toString();
		}
		
		gulp.src('src/js/' + baseName + '/' + baseName + '.js.mustache')
		.pipe(plumber())
		.pipe(mustache(params))
		.pipe(rename(baseName + '.js'))
		.pipe(gulp.dest('gulp/work/js/merged/'))
		.on('end', function() {
			doneCount ++;
			if (doneCount >= baseNames.length) {
				callback();
			}
		});
	}
});

// JavaScript build task
gulp.task('build:js', ['build:merge:js'], function() {
	return gulp.src('gulp/work/js/merged/*.js')
	.pipe(plumber())
	.pipe(uglify())
	.pipe(gulp.dest('gulp/work/js/minified/'));
});

// CSS build task
gulp.task('build:css', function() {
	return sass('src/scss/**/*.scss', { style: 'compressed' })
	.on('error', sass.logError)
	.pipe(rename({ dirname: '' }))
	.pipe(gulp.dest('gulp/work/css/built/'));
});

// HTML build task
gulp.task('build:html', ['build:js', 'build:css'], function(callback) {
	var baseNames = getBaseNames();
	var doneCount = 0;
	
	for (var baseName of baseNames) {
		var partials = {};
		
		for (var name of glob.sync('src/html/parts/*.html')) {
			partials[path.basename(name, '.html')] = fs.readFileSync(name).toString();
		}
		
		gulp.src('src/html/' + baseName + '.html')
		.pipe(plumber())
		.pipe(mustache({
			css: fs.readFileSync('gulp/work/css/built/' + baseName + '.css').toString(),
			javascript: fs.readFileSync('gulp/work/js/minified/' + baseName + '.js').toString()
		}, {}, partials))
		.pipe(gulp.dest('gulp/work/html/merged/'))
		.on('end', (function(baseName) {
			return function() {
				gulp.src('gulp/work/html/merged/' + baseName + '.html')
				.pipe(plumber())
				.pipe(htmlmin({
					collapseWhitespace: true,
					removeComments: true
				}))
				.pipe(gulp.dest('./'))
				.on('end', function() {
					doneCount ++;
					if (doneCount >= baseNames.length) {
						callback();
					}
				});
			};
		})(baseName));
	}
});

// Build all
gulp.task('build', ['build:html'], function() {
});
