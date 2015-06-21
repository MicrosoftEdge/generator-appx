var dest = './dist';
var src = './src';
var port = 3000;

module.exports = {
  browserSync: {
    server: {
      // Serve up our build folder
      baseDir: dest,
      port: port
    }
  },
  sass: {
    src: src + '/css/*.{sass,scss,css}',
    dest: dest + '/css',
    settings: {
      sourceComments: 'map',
      imagePath: '/img' // Used by the image-url helper
    }
  },
  lint: {
    src: [src + '/bundles/**/*.js', src + '/js/**/*.js']
  },
  images: {
    src: src + '/img/**',
    dest: dest + '/img'
  },
  markup: {
    src: [src + '/html/**/*.html', '!**/templates/**'],
    watch: src + '/html/**/*.html',
    dest: dest,
    swig: {
      defaults: {cache: false}
    }
  },
  misc: {
    src: src + '/misc/**',
    dest: dest
  },
  js: {
    src: src + '/js/**',
    dest: dest + '/js'
  },
  ngrok: {
    port: port
  },
  appx: {
    src: src + '/appxmanifest.xml',
    dest: dest + '/appxmanifest.xml'
  },
  browserify: {
    // A separate bundle will be generated for each
    // bundle config in the list below
    bundleConfigs: [{
      entries: src + '/bundles/bundle.js',
      dest: dest + '/bundles',
      outputName: 'bundle.js'
    }]
  },
  production: {
    cssSrc: dest + '/**/*.css',
    jsSrc: dest + '/**/*.js',
    dest: dest
  },
  clean: {
    src: dest
  },
  deploy: {
    src: dest + '/**/*'
  }
};
