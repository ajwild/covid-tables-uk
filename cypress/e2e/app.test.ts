describe('App', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('Renders home page', () => {
    cy.findByRole('navigation').findByRole('heading').should('exist');
    cy.findByRole('main')
      .findByRole('heading')
      .invoke('text')
      .should('match', /all locations/i);
  });

  it('Allows navigation to location page', () => {
    // Click forced because Cypress can't access link behind header
    cy.findByText(/^england$/i).click({ force: true });
    cy.url().should('match', /\/england/i);
    cy.findByRole('main')
      .findByRole(
        (role, element) =>
          role === 'heading' && /england/i.test(element.textContent)
      )
      .should('exist');
  });
});
