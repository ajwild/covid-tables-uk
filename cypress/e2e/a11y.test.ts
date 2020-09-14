describe('Accessibility checks', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.injectAxe();
  });

  describe('Home page', () => {
    it('Has no detectable a11y violations on load', () => {
      cy.findByRole('main');
      cy.checkA11y();
    });
  });

  describe('Location page', () => {
    it('Navigates to location page and checks for accessibility violations', () => {
      cy.findByText(/^england$/i).click();
      cy.url().should('match', /\/england/i);
      cy.checkA11y();
    });
  });
});
