import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:4200', // Adjust this to match your dev server
    specPattern: 'cypress/e2e/**/*.cy.ts',
    video: false, // Disable video recording in CI to save time
    
  },
  component: {
    devServer: {
      framework: 'angular',
      bundler: 'webpack',
    },
    specPattern: 'cypress/component/**/*.cy.ts',
  },
});
