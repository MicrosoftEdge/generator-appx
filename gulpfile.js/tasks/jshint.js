var gulp = require('gulp');
var jshint = require('gulp-jshint');
var config = require('../config').lint;
var stylish = require('jshint-stylish');

gulp.task('lint', function() {
  return gulp.src(config.src)
    .pipe(jshint())
   	.pipe(jshint.reporter(stylish));
});
