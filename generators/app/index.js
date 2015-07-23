var generators = require('yeoman-generator');
var path = require('path');
module.exports = generators.Base.extend({
  promptProjectType: function() {
    var that = this;
    var done = this.async();

    this.prompt([{
      type: 'confirm',
      name: 'win10',
      message: 'Developing on Windows 10?',
      default: true
    }, {
      type: 'confirm',
      name: 'deps',
      message: 'Automatically install dependencies?',
      default: true
    }], function (answers) {
      that._win10 = answers.win10;
      that._deps = answers.deps;
      done();
    });
  },

  copyTemplate: function() {
    var gulpDir = path.join(require.resolve('appx-starter/package.json'), '../');
    if (this._win10) {
      this.fs.copy(this.templatePath(gulpDir) + '/**/{*,.*}', this.destinationPath(), {dot: true});
    } else {
      this.fs.copy(this.templatePath(gulpDir) + '/{,*,.*,gulpfile.js/*,gulpfile.js/tasks/**/*,gulpfile.js/util/**/*,src/**/*,src/**/.*}', this.destinationPath() + '/', {dot: true});
    }
    this.fs.move(this.destinationPath('.npmignore'), this.destinationPath('.gitignore'));
  },

  install: function() {
    if (this._deps) {
      this.installDependencies({bower: false});
    }
  }
});
