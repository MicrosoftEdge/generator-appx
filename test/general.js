'use strict';

var path = require('path');
var helpers = require('yeoman-generator').test;
var assert = require('yeoman-generator').assert;
var del = require('del');

describe('general', function () {
  before(function (done) {
    helpers.run(path.join(__dirname, '../app'))
      .inDir(path.join(__dirname, './tmp'))
      .withPrompts({ win10: true, deps: false })
      .on('end', done);
  });

  after(function (done) {
    del(path.join(__dirname, './tmp'), { force: true }, done);
  });

  it('generator can be required without throwing an error', function () {
    require('../app');
  });

  it('creates expected files', function () {
    assert.file([
      '.gitignore',
      'gulpfile.babel.js/config.js',
      'gulpfile.babel.js/index.js',
      'gulpfile.babel.js/tasks/appx.js',
      'gulpfile.babel.js/tasks/bundle.js',
      'gulpfile.babel.js/tasks/browserSync.js',
      'gulpfile.babel.js/tasks/clean.js',
      'gulpfile.babel.js/tasks/deploy.js',
      'gulpfile.babel.js/tasks/minify.js',
      'gulpfile.babel.js/tasks/copy.js',
      'gulpfile.babel.js/util/handleErrors.js',
      'LICENSE',
      'package.json',
      'README.md',
      '.eslintrc',
      '.babelrc',
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
