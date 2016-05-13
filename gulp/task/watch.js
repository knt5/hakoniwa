var gulp = require('gulp');
var config = require('../config/config');

gulp.task('watch', function() {
	// built
	gulp.watch(config.lint.targets.built.html, ['htmlhint:built']);
	gulp.watch(config.lint.targets.built.js, ['eslint:built']);
	
	// src
	gulp.watch(config.lint.targets.scss, ['scsslint']);
	gulp.watch(config.lint.targets.js, ['eslint']);
	
	// build
	gulp.watch(config.build.watchTargets, ['build']);
});
