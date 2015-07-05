'use strict';

var path = require('path');
var helpers = require('yeoman-generator').test;
var assert = require('yeoman-generator').assert;

describe('gulp', function() {
  before(function (done) {
    helpers.run(path.join(__dirname, '../generators/app'))
      .inDir(path.join(__dirname, './tmp'))
      .withPrompts({win10: true, deps: false})
      .on('end', done);
  });

  it('should contain expected gulp tasks', function() {
    [
      'core',
      'default',
      'appx:dev',
      'ext',
      'appx:ext'
    ].forEach(function (task) {
      assert.fileContent('gulpfile.js/tasks/default.js',
                         'gulp.task(\'' + task);
    });
  });
});