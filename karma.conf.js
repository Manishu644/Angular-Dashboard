// Karma configuration file, see link for more information
// https://karma-runner.github.io/1.0/config/configuration-file.html

const { type } = require('os');

module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine', '@angular-devkit/build-angular'],
    plugins: [
      require('karma-jasmine'),
      require('karma-edge-launcher'),
      require('karma-jasmine-html-reporter'),
      require('karma-coverage'),
      require('@angular-devkit/build-angular/plugins/karma')
    ],
    client: {
      jasmine: {
        // you can add configuration options for Jasmine here
        // the possible options are listed at https://jasmine.github.io/api/edge/Configuration.html
        // for example, you can disable the random execution with `random: false`
        // or set a specific seed with `seed: 4321`
      },
    },
    jasmineHtmlReporter: {
      suppressAll: true // removes the duplicated traces
    },
    junitReporter: {
      outputDir: 'test-results', // results will be saved as test-results/TESTS-results.xml
      outputFile: 'TESTS-results.xml',
      useBrowserName: false
    },
    
    coverageReporter: {
      type:'html',
      dir: require('path').join(__dirname, './coverage/interactive-dashboard'),
      subdir: '.',
      reporters: [
        { type: 'html' },
        { type: 'text-summary' },
       
      ]
    },
    reporters: ['progress', 'kjhtml','coverage'],
    browsers: ['EdgeCustom'],
    customLaunchers: {
      EdgeCustom: {
        base: 'Edge',
        flags: [],
        executablePath: process.env.EDGE_BIN
      }
    },
    restartOnFileChange: true
  });
};
