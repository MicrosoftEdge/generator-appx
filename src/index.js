import {Base} from 'yeoman-generator';
import * as path from 'path';

module.exports = Base.extend({
  promptProjectType() {
    const that = this;
    const done = this.async();

    this.prompt([{
        type: 'confirm',
        name: 'deps',
        message: 'Automatically install dependencies?',
        default: true
      }], answers => {
        that._win10 = answers.win10;
        that._deps = answers.deps;
        done();
      });
  },

  promptProjectInfo() {
    const that = this;
    const done = this.async();

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
      }], answers => {
        that._name = answers.name;
        that._author = answers.author;
        done();
      });
  },

  copyTemplate() {
    const gulpDir = path.join(require.resolve('appx-starter/package.json'), '../');
    this.fs.copy(this.templatePath(gulpDir) + '/**/{*,.*}', this.destinationPath(), { dot: true });

    this.fs.move(this.destinationPath('.npmignore'), this.destinationPath('.gitignore'));

    const jsonContent = this.fs.readJSON(this.destinationPath('package.json'));
    jsonContent.version = '0.0.1';
    const unusedFields = [
      'gitHead',
      'readme',
      'readmeFilename',
      ...Object.keys(jsonContent).filter(field => field.charAt(0) === '_')
    ];
    unusedFields.forEach(entry => {
      jsonContent[entry] = 'x';
      delete jsonContent[entry];
    });

    const projectName = this._name.trim().toLowerCase().replace(/ /g, '-');
    jsonContent.name = projectName;
    jsonContent.author = this._author.trim();
    this.fs.writeJSON(this.destinationPath('package.json'), jsonContent);

    let manifestContent = this.fs.read(this.destinationPath('src/AppxManifest.xml'));

    const manifestAuthor = this._author ? this._author.trim() : 'Unknown';
    const manifestName = this._name ? this._name.trim() : 'Unknown';

    const pubString = `<PublisherDisplayName>${manifestAuthor}</PublisherDisplayName>`;
    const vDisplayName = `DisplayName="${manifestName}"`;
    const displayName = `<DisplayName>${manifestName}</DisplayName>`;

    manifestContent = manifestContent.replace(/(\bPublisher="CN=)([^"])*(?=")/, '$1' + manifestAuthor)
      .replace(/<PublisherDisplayName>[\S\s]+?<\/PublisherDisplayName>/, pubString)
      .replace(/DisplayName="[\S\s]+?"/, vDisplayName)
      .replace(/<DisplayName>[\S\s]+?<\/DisplayName>/, displayName);

    this.fs.write(this.destinationPath('src/AppxManifest.xml'), manifestContent);
  },

  install() {
    if (this._deps) {
      this.installDependencies({ bower: false });
    }
  }
});
