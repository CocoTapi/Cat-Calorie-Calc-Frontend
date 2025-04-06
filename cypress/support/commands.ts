// ***********************************************
// This example namespace declaration will help
// with Intellisense and code completion in your
// IDE or Text Editor.
// ***********************************************
// declare namespace Cypress {
//   interface Chainable<Subject = any> {
//     customCommand(param: any): typeof customCommand;
//   }
// }
//
// function customCommand(param: any): void {
//   console.warn(param);
// }
//
// NOTE: You can use it like so:
// Cypress.Commands.add('customCommand', customCommand);
//
// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })

// Make this file a proper ES module
export {};

// Extend Cypress commands
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Cypress {
    interface Chainable {
      /**
       * Custom command to simulate swiping down the slide panel to close it
       */
      swipeDownPanel(): Chainable
    }
  }
}

// Custom command to simulate swipe down to close panel
Cypress.Commands.add('swipeDownPanel', () => {
  cy.log('Attempting to swipe down panel to close it');
  
  // Wait a moment before trying to close the panel
  cy.wait(500);
  
  // Get the drag handle or header area of the panel
  cy.get('.panel__header').then($header => {
    // Get the coordinates of the header
    const headerRect = $header[0].getBoundingClientRect();
    const startX = headerRect.left + headerRect.width / 2;
    const startY = headerRect.top + headerRect.height / 2;
    
    // Calculate a larger swipe distance (90% of the window height)
    const windowHeight = Cypress.config('viewportHeight');
    const endY = startY + (windowHeight * 0.9);
    
    cy.log(`Swipe coordinates: (${startX}, ${startY}) -> (${startX}, ${endY})`);
    
    // First, click to focus the panel header
    cy.get('.panel__header')
      .click({ force: true })
      .wait(100);
    
    // Then perform a more pronounced swipe down gesture
    cy.get('.panel__header')
      .trigger('mousedown', { clientX: startX, clientY: startY, force: true })
      .wait(100) // Wait a bit before moving to simulate a real gesture
      .trigger('mousemove', { clientX: startX, clientY: startY + 100, force: true })
      .wait(50)
      .trigger('mousemove', { clientX: startX, clientY: startY + 300, force: true })
      .wait(50)
      .trigger('mousemove', { clientX: startX, clientY: endY, force: true })
      .wait(100)
      .trigger('mouseup', { force: true });
    
    cy.log('Swipe down gesture completed');
    
    // Wait for animation to complete
    cy.wait(800);
  });
});
