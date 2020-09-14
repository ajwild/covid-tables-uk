describe('app', () => {
  it('should render page', () => {
    cy.visit('/').get('[data-testid="website-title"]').should('exist');
  });
});
