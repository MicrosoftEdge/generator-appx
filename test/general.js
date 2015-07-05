'use strict';

var path = require('path');
var helpers = require('yeoman-generator').test;
var assert = require('yeoman-generator').assert;

describe('general', function() {
  before(function (done) {
    helpers.run(path.join(__dirname, '../generators/app'))
      .inDir(path.join(__dirname, './tmp'))
      .withPrompts({win10: true, deps: false})
      .on('end', done);
  });

  it('generator can be required without throwing an error', function() {
    require('../generators/app');
  });

  it('creates expected files', function() {
    assert.file([
      '.gitignore',
      'gulpfile.js/AppxUtilities/Add-AppxPackageExt.ps1',
      'gulpfile.js/AppxUtilities/Debug-AppxPackage.ps1',
      'gulpfile.js/AppxUtilities/ExtractFromAppx.exe',
      'gulpfile.js/AppxUtilities/Get-AppxPackageExt.ps1',
      'gulpfile.js/AppxUtilities/Get-AppxPackageFile.ps1',
      'gulpfile.js/AppxUtilities/Get-ProcessAppxPackage.ps1',
      'gulpfile.js/AppxUtilities/Launch-AppxPackage.ps1',
      'gulpfile.js/AppxUtilities/Launch-AppxPackageBackgroundTask.ps1',
      'gulpfile.js/AppxUtilities/LaunchAppxPackage.exe',
      'gulpfile.js/AppxUtilities/LaunchAppxPackageBackgroundTask.exe',
      'gulpfile.js/AppxUtilities/PackageExecutionState.exe',
      'gulpfile.js/AppxUtilities/plmdebug.exe',
      'gulpfile.js/AppxUtilities/ProcessIdToPackageId.exe',
      'gulpfile.js/AppxUtilities/Resume-AppxPackage.ps1',
      'gulpfile.js/AppxUtilities/Start.ps1',
      'gulpfile.js/AppxUtilities/Suspend-AppxPackage.ps1',
      'gulpfile.js/AppxUtilities/Terminate-AppxPackage.ps1',
      'gulpfile.js/config.js',
      'gulpfile.js/index.js',
      'gulpfile.js/tasks/appx.js',
      'gulpfile.js/tasks/browserify.js',
      'gulpfile.js/tasks/browserSync.js',
      'gulpfile.js/tasks/clean.js',
      'gulpfile.js/tasks/default.js',
      'gulpfile.js/tasks/deploy.js',
      'gulpfile.js/tasks/edgeLoopback.js',
      'gulpfile.js/tasks/images.js',
      'gulpfile.js/tasks/javascript.js',
      'gulpfile.js/tasks/jshint.js',
      'gulpfile.js/tasks/manifest.js',
      'gulpfile.js/tasks/markup.js',
      'gulpfile.js/tasks/minifyCss.js',
      'gulpfile.js/tasks/misc.js',
      'gulpfile.js/tasks/ngrok.js',
      'gulpfile.js/tasks/nodeCopy.js',
      'gulpfile.js/tasks/production.js',
      'gulpfile.js/tasks/sass.js',
      'gulpfile.js/tasks/uglifyJs.js',
      'gulpfile.js/tasks/watch.js',
      'gulpfile.js/tasks/watchify.js',
      'gulpfile.js/util/bundleLogger.js',
      'gulpfile.js/util/handleErrors.js',
      'LICENSE',
      'package.json',
      'README.md',
      'src/.jshintrc',
      'src/AppxManifest.xml',
      'src/bundles/bundle.js',
      'src/bundles/vendor/plugin.js',
      'src/css/app.scss',
      'src/html/index.html',
      'src/html/swig.html',
      'src/html/templates/layout.html',
      'src/img/logo.png',
      'src/img/smalllogo.png',
      'src/img/splashscreen.png',
      'src/img/storelogo.png',
      'src/js/main.js',
      'src/misc/web.config'
    ]);
  });

});
