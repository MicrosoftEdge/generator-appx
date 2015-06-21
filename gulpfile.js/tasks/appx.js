var gulp = require('gulp');
var run = require('gulp-run');
var os = require('os');
var xml2js = require('xml2js');
var parser = new xml2js.Parser();
var fs = require('fs');
var config = require('../config').appx;
var util = require('util');

gulp.task('appxregister', function() {

  var buffer = fs.readFileSync(config.src, 'utf-8');
  parser.parseString(buffer, function(err, result) {
    var guid = result.Package.Identity[0]['$'].Name;

    if (os.platform() !== 'darwin') {
      var cwd = process.cwd();

      run('start-process powershell -verb runas -ArgumentList "-noexit", "' + cwd + '\\gulpfile.js\\AppxUtilities\\Start.ps1 ' + cwd + ' ' + guid + '"', {
        usePowerShell: true
      }).exec();
    }

  });

});

gulp.task('appx', ['manifest'], function() {
  gulp.start('appxregister');
});
