'use strict';

var path = require('path');
var helpers = require('yeoman-generator').test;
var assert = require('yeoman-generator').assert;
var del = require('del');

describe('gulp', function() {
  before(function (done) {
    helpers.run(path.join(__dirname, '../app'))
      .inDir(path.join(__dirname, './tmp'))
      .withPrompts({deps: false})
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
      assert.fileContent('gulpfile.babel.js/index.js',
                         'gulp.task(\'' + task);
    });
  });
});

describe('no-input', function() {
  before(function (done) {
    helpers.run(path.join(__dirname, '../app'))
      .inDir(path.join(__dirname, './tmp'))
      .withPrompts({deps: false})
      .on('end', done);
  });
  after(function (done) {
    del(path.join(__dirname, './tmp'), {force: true}, done);
  });
  
  it('should use Unknown for name in AppxManifest.xml', function() {
    assert.fileContent('src/AppxManifest.xml', '<DisplayName>Unknown</DisplayName>');
    assert.fileContent('src/AppxManifest.xml', 'DisplayName="Unknown"');
  });

  it('should use Uknown for author name in Appxmanifest.xml', function() {
    assert.fileContent('src/AppxManifest.xml', '<PublisherDisplayName>Unknown</PublisherDisplayName>');
    assert.fileContent('src/AppxManifest.xml', 'Publisher="CN=Unknown"');
  });

});

describe('params', function() {
  before(function(done) {
    helpers.run(path.join(__dirname, '../app'))
      .inDir(path.join(__dirname, './tmp'))
      .withPrompts({deps: false, name: 'UPPER CASE WITH SPACES', author: 'Author Name'})
      .on('end', done);
  });
  after(function(done) {
    del(path.join(__dirname, './tmp'), {force: true}, done);
  });

  it('should update the name properly in package.json', function() {
    assert.fileContent('package.json', '"name": "upper-case-with-spaces"');
  });

  it('should update the author name in package.json', function() {
    assert.fileContent('package.json', '"author": "Author Name"');
  });

  it('should update the name in AppxManifest.xml', function() {
    assert.fileContent('src/AppxManifest.xml', '<DisplayName>UPPER CASE WITH SPACES</DisplayName>');
    assert.fileContent('src/AppxManifest.xml', 'DisplayName="UPPER CASE WITH SPACES"');
  });

  it('should update the author name in Appxmanifest.xml', function() {
    assert.fileContent('src/AppxManifest.xml', '<PublisherDisplayName>Author Name</PublisherDisplayName>');
    assert.fileContent('src/AppxManifest.xml', 'Publisher="CN=Author Name"');
  });

});