describe('App', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('Renders home page', () => {
    cy.get('[data-testid="website-title"]').should('exist');
    cy.findByRole('main')
      .findByRole('heading')
      .invoke('text')
      .should('match', /all locations/i);
  });

  it('Allows navigation to location page', () => {
    cy.findByText(/^england$/i).click();
    cy.url().should('match', /\/england/i);
    cy.findByRole('main')
      .findByRole(
        (role, element) =>
          role === 'heading' && /england/i.test(element.textContent)
      )
      .should('exist');
  });
});
