// This ensures TypeScript knows about the custom commands
import '../support/commands';

describe('Pet Profile Management', () => {
  // Simplified test data
  const editedPetData = {
    name: 'Whiskers Updated',
    weight: '6.5',
    weightUnit: 'lb',
    allergies: 'Chicken, Dairy',
    medicationName: 'Vitamins',
    medicationDirections: '1 pill daily'
  };

  beforeEach(() => {
    // Configure longer timeouts for all commands
    Cypress.config('defaultCommandTimeout', 15000);
    
    // Visit the pet profile page
    cy.visit('/', { timeout: 120000 });
  });

  it('should successfully edit pet profile with valid data', () => {
    // Capture initial name for comparison
    let initialName = '';
    cy.get('h1.heading-1').then($el => {
      initialName = $el.text().trim();
    });
    
    // 1. Open the edit form
    cy.get('button.responsive-icon').click();
    cy.get('form').should('be.visible');
    
    // 2. Edit form fields
    cy.get('form app-custom-input').first().find('input')
      .clear().type(editedPetData.name);
    
    cy.contains('label', 'Weight').parent().find('input')
      .clear().type(editedPetData.weight);
    
    cy.get('mat-button-toggle-group[formControlName="weight_unit"]')
      .find(`mat-button-toggle[value="${editedPetData.weightUnit}"]`)
      .click();
    
    cy.contains('label', 'Allergies').parent().find('input')
      .clear().type(editedPetData.allergies);
    
    // Edit medications
    cy.get('.form__medications__content__item').then($items => {
      // Add medication if none exists
      if ($items.length === 0) {
        cy.get('button.form__medications__btn').click();
      }
      
      // Edit first medication
      cy.get('.form__medications__content__item').first().within(() => {
        cy.contains('label', 'Medicine Name').parent().find('input')
          .clear().type(editedPetData.medicationName);
        cy.contains('label', 'Directions').parent().find('input')
          .clear().type(editedPetData.medicationDirections);
      });
    });
    
    // 3. Submit the form by swiping down the panel instead of clicking a button
    cy.swipeDownPanel();
    
    // 4. Verify form submission was successful - check name changed
    cy.get('h1.heading-1', { timeout: 10000 })
      .should('not.have.text', initialName)
      .should('contain', editedPetData.name);
    
    // 5. Verify all edited values appear in the UI
    // Weight verification
    cy.contains('Weight :').parent().should('contain', editedPetData.weight);
    
    // Allergies verification
    cy.get('.pet-profile-2__allergies p').should('contain', editedPetData.allergies);
    
    // Medications verification
    cy.get('.pet-profile-2__medications ul li')
      .should('contain', editedPetData.medicationName)
      .and('contain', editedPetData.medicationDirections);
  });

  it('should enforce validation on required fields', () => {
    // 1. Open the edit form
    cy.get('button.responsive-icon').click();
    cy.get('form').should('be.visible');
    
    // 2. Clear the required name field
    cy.get('form app-custom-input').first().find('input').clear();
    
    // 3. Try to submit by swiping down - should fail validation and panel should remain open
    cy.swipeDownPanel();
    
    // 4. Form should still be visible (not submitted due to validation)
    cy.get('form').should('be.visible');
    
    // 5. Enter valid data in the required field
    cy.get('form app-custom-input').first().find('input')
      .type('Valid Name');
    
    // 6. Submit again by swiping down - should work this time
    cy.swipeDownPanel();
    
    // 7. Form should be submitted and panel should close
    // cy.get('form').should('not.exist', { timeout: 10000 });
  });
});
