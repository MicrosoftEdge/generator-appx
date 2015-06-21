/* Notes:
   - gulp/tasks/browserify.js handles js recompiling with watchify
   - gulp/tasks/browserSync.js watches and reloads compiled files
*/

var gulp     = require('gulp');
var config   = require('../config');
var watchify = require('./browserify')
var watch = require('gulp-watch');

function standardTasks() {
  //gulp.start() will be deprecated in 4.0. Make sure to revisit
  watch(config.sass.src, function() { gulp.start('sass'); });
  watch(config.lint.src, function() { gulp.start('lint'); });
  watch(config.images.src, function() { gulp.start('images'); });
  watch(config.markup.watch, function() { gulp.start('markup'); });
  watch(config.misc.src, function() { gulp.start('misc'); });
  watch(config.js.src, function() { gulp.start('js'); });
  // Watchify will watch and recompile our JS, so no need to gulp.watch it
}

gulp.task('watch', ['watchify','browserSync'], function(callback) {
  standardTasks();
});

gulp.task('watchappx', ['watchify','browserSync'], function(callback) {
  standardTasks();
  gulp.start('appx');
});

gulp.task('watchext', ['watchify','browserSync'], function(callback) {
  gulp.start('ngrok');
  standardTasks();
});
