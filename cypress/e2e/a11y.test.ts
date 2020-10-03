describe('Accessibility checks', () => {
  describe('Home page', () => {
    it('Has no detectable a11y violations on load', () => {
      cy.visit('/');
      cy.injectAxe();
      cy.findByRole('main');
      cy.checkA11y();
    });
  });

  describe('Location page', () => {
    it('Navigates to location page and checks for accessibility violations', () => {
      cy.visit('/nation/england/');
      cy.injectAxe();
      cy.findByRole('main');
      cy.checkA11y();
    });
  });
});
