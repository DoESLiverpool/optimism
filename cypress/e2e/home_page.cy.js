describe('The Home Page', () => {
  it('successfully loads', () => {
    cy.visit('/');
  });
  it('contains the text DoES Liverpool', () => {
    cy.visit('/');
    cy.get('h1', { timeout: 100 }).should('contain', 'Booking resources at DoES Liverpool');
  });
  it('goes to select a resource if hero button clicked', () => {
    cy.visit('/');
    cy.get('.jumbotron a').click();
    cy.url().should('eq', 'http://localhost:3000/select-a-resource');
  });
});
