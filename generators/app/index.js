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

  promptProjectInfo: function() {
    var that = this;
    var done = this.async();

    this.prompt([{
      type: 'input',
      name: 'name',
      message: 'Project name?',
      default: 'demo-app'
    }, {
      type: 'input',
      name: 'author',
      message: 'Author name?',
      store: true,
      default: ''
    }], function (answers) {
      that._name = answers.name;
      that._author = answers.author;
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

    var jsonContent = this.fs.readJSON(this.destinationPath('package.json'));
    ['gitHead', 'readme', 'readmeFilename', '_id', '_shasum', '_from', '_resolved'].forEach(function(entry) {
      if (jsonContent[entry]) {
        delete jsonContent[entry];
      }
    });
    var projectName = this._name.toLowerCase().replace(/ /g, '-');
    jsonContent.name = projectName;
    jsonContent.author - this._author;
    this.fs.writeJSON(this.destinationPath('package.json'), jsonContent);

  },

  install: function() {
    if (this._deps) {
      this.installDependencies({bower: false});
    }
  }
});
