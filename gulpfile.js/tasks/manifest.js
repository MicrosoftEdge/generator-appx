var gulp = require('gulp');
var fs = require('fs');
var util = require('util');
var config = require('../config').appx;
var xml2js = require('xml2js');
var parser = new xml2js.Parser();
var builder = new xml2js.Builder();
var argv = require('yargs').argv;

function manifest() {
  var url = 'http://localhost:3000';
  if (argv.ngrok) {
    url = 'https://' + argv.ngrok + '.ngrok.com';
  } else if (argv.url) {
    url = argv.url;
  }
  var dest = argv.packaged ? config.dest : config.src;
  var buffer = fs.readFileSync(config.src, 'utf-8');
  var manifest = buffer.split('\n');
  var updated = [];
  var versionBump = '';
  manifest.forEach(function(line) {
    if (~line.indexOf('<!--Build ')) {
      versionBump = line.replace(/\d+/, function(n){ return ++n; });
    }
  });
  parser.parseString(buffer, function(err, result) {
    var urlSections = result.Package.Applications[0].Application[0];
    var startPage = urlSections['$'];
    var acur = urlSections['uap:ApplicationContentUriRules'][0]['uap:Rule'][0]['$'];
    acur.Match = url;
    startPage.StartPage = url;
    var xml = builder.buildObject(result);
    var xmlArray = xml.split('\n');
    xmlArray.push(versionBump);
    fs.writeFileSync(dest, xmlArray.join('\n'));
  });
}

gulp.task('manifest', manifest);
