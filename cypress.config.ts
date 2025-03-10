import { defineConfig } from 'cypress';
import codeCoverageTask from '@cypress/code-coverage/task'; 

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:4200',
    specPattern: 'cypress/e2e/**/*.cy.ts',
    video: false,
    setupNodeEvents(on, config) {
      codeCoverageTask(on, config); 
      return config;
    },
  },
  component: {
    devServer: {
      framework: 'angular',
      bundler: 'webpack',
    },
    specPattern: 'cypress/component/**/*.cy.ts',
  },
});
