'use strict';

var path = require('path');
var helpers = require('yeoman-generator').test;
var assert = require('yeoman-generator').assert;
var del = require('del');

describe('general', function() {
  before(function (done) {
    helpers.run(path.join(__dirname, '../generators/app'))
      .inDir(path.join(__dirname, './tmp'))
      .withPrompts({win10: true, deps: false})
      .on('end', done);
  });

  after(function(done) {
    del(path.join(__dirname, './tmp'), {force: true}, done);
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
      'gulpfile.js/tasks/webpack.js',
      'gulpfile.js/tasks/clean.js',
      'gulpfile.js/tasks/deploy.js',
      'gulpfile.js/tasks/manifest.js',
      'gulpfile.js/tasks/minify.js',
      'gulpfile.js/tasks/copy.js',
      'gulpfile.js/util/handleErrors.js',
      'LICENSE',
      'package.json',
      'README.md',
      '.jshintrc',
      'src/AppxManifest.xml',
      'src/bundles/bundle.js',
      'src/css/app.scss',
      'src/index.html',
      'src/img/logo.png',
      'src/img/smalllogo.png',
      'src/img/splashscreen.png',
      'src/img/storelogo.png',
      'src/js/main.js',
      'src/web.config'
    ]);
  });

});
