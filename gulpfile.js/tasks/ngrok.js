var gulp = require('gulp');
var ngrok = require('ngrok');
var config = require('../config').ngrok;

gulp.task('ngrok', function() {
  ngrok.connect(config, function(err, url) {
    if (err) {
      console.log(err);
    } else {
      console.log('external URL: ' + url);
    }
  });
});
