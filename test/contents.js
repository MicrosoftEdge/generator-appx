'use strict';

var path = require('path');
var helpers = require('yeoman-generator').test;
var assert = require('yeoman-generator').assert;
var del = require('del');

describe('gulp', function() {
  before(function (done) {
    helpers.run(path.join(__dirname, '../generators/app'))
      .inDir(path.join(__dirname, './tmp'))
      .withPrompts({win10: true, deps: false})
      .on('end', done);
  });
  after(function (done) {
    del(path.join(__dirname, './tmp'), {force: true}, done);
  });

  it('should contain expected gulp tasks', function() {
    [
      'core',
      'default',
      'appx:dev'
    ].forEach(function (task) {
      assert.fileContent('gulpfile.js/index.js',
                         'gulp.task(\'' + task);
    });
  });
});

describe('params', function() {
  before(function(done) {
    helpers.run(path.join(__dirname, '../generators/app'))
      .inDir(path.join(__dirname, './tmp'))
      .withPrompts({win10: false, deps: false, name: 'UPPER CASE WITH SPACES', author: 'Author Name'})
      .on('end', done);
  });
  after(function(done) {
    del(path.join(__dirname, './tmp'), {force: true}, done);
  });

  it('should update the name properly in package.json', function() {
    assert.fileContent('package.json', '"name": "upper-case-with-spaces"');
  });

  it('should update the name in AppxManifest.xml', function() {
  });

});