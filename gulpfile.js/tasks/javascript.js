var changed    = require('gulp-changed');
var gulp       = require('gulp');
var config     = require('../config').js;
var browserSync  = require('browser-sync');

gulp.task('js', function() {
  return gulp.src(config.src)
    .pipe(changed(config.dest)) // Ignore unchanged files
    .pipe(gulp.dest(config.dest))
    .pipe(browserSync.reload({stream:true}));
});
