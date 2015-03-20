var gulp = require ('gulp'),
	uglify = require('gulp-uglify'),
	livereload = require('gulp-livereload'),
	source = require('vinyl-source-stream'),
	browserify = require('browserify');

gulp.task('scripts', function() {
	return browserify('./js/game.js')
			.bundle()
			.pipe(source('all.js'))
			.pipe(gulp.dest('build/'))
			.pipe(livereload());
});

gulp.task('watch', function() {

	gulp.watch('js/*.js', ['scripts']);

	livereload.listen();

	gulp.watch('*').on('change', livereload.changed);
	gulp.watch('*/*').on('change', livereload.changed);
});

gulp.task('default', ['scripts', 'watch']);