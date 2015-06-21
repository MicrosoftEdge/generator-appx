var gulp = require('gulp');
var config = require('../config').markup
var browserSync  = require('browser-sync');
var swig = require('gulp-swig');

gulp.task('markup', function() {
  return gulp.src(config.src)
    .pipe(swig(config.swig))
    .pipe(gulp.dest(config.dest))
    .pipe(browserSync.reload({stream:true}));
});
