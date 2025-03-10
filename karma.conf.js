module.exports = function (config) {
  var isCI = process.env.CI === 'true';

  config.set({
    basePath: '',
    frameworks: ['jasmine', '@angular-devkit/build-angular'],
    plugins: [
      require('karma-jasmine'),
      require('karma-firefox-launcher'),
      require('karma-chrome-launcher'),
      require('karma-jasmine-html-reporter'),
      require('karma-coverage'),
      require('@angular-devkit/build-angular/plugins/karma')
    ],
    client: {
      clearContext: false
    },
    coverageReporter: {
      dir: require('path').join(__dirname, './coverage'),
      subdir: '.',
      reporters: [
        { type: 'html' },
        { type: 'lcov' },
        { type: 'text-summary' },
        { type: 'json-summary', subdir: '.', file: 'coverage-summary.json' }
      ],
      check: {
        global: {
          statements: 90,
          branches: 90,
          functions: 90,
          lines: 90
        }
      }
    },
    reporters: ['progress', 'kjhtml'],
    browsers: isCI ? ['ChromeHeadless'] : ['Firefox'],
    restartOnFileChange: true
  });
};
