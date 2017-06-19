var gulp = require('gulp'),
watch = require('gulp-watch'),
postcss = require('gulp-postcss'),
autoprefixer = require('autoprefixer'),
cssvars = require('postcss-simple-vars'),
nested = require('postcss-nested'),
cssImport = require('postcss-import'),
mixins = require('postcss-mixins'),
browserSync = require('browser-sync').create();
webpack = require('webpack');

gulp.task('cssInject', ['styles'], function() {
	return gulp.src('./css/input/style.css')
		.pipe(browserSync.stream());
});

gulp.task('styles', function() {
	return gulp.src('./css/input/style.css')
		.pipe(postcss([cssImport, mixins, cssvars, nested, autoprefixer]))
		.pipe(gulp.dest('./css/output'));
});

gulp.task('scriptRefresh', ['scripts'], function() {
	browserSync.reload();
});

gulp.task('scripts', function(callback) {
	webpack(require('./webpack.config.js'), function(err, stats) {
		if(err)
			console.log(err.toString());

		console.log(stats.toString());
		callback();
	});
});

gulp.task('watch', function() {

	browserSync.init({
		notify: false,
		server: {
			baseDir: "./"
		}
	});

	watch('./*.html', function() {
		browserSync.reload();
	});

	watch('./css/input/*.css', function() {
		gulp.start('cssInject');
	});

	watch('./js/input/*.js', function() {
		gulp.start('scriptRefresh');
	});
});