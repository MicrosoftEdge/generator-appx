var gulp = require('gulp');

gulp.task('default', ['clean','sass', 'lint', 'images', 'markup', 'misc','js', 'watch']);

gulp.task('appx:dev', ['clean', 'sass', 'lint', 'images', 'markup', 'misc', 'js', 'watchappx']);

gulp.task('ext', ['clean', 'sass', 'lint', 'images', 'markup', 'misc', 'js', 'watchext']);

gulp.task('appx:ext', ['appx']);
