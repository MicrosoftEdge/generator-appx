var gulp = require('gulp');
var config = require('../config').clean;
var del = require('del');

gulp.task('clean', function() {
  del.sync([config.src]);
});
