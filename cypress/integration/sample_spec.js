describe('My First Test', () => {
  it('finds the content "type"', () => {
    cy.visit('https://example.cypress.io')

    cy.pause()

    cy.contains('type').click()
    // should be on a new URL which contains 'commands/actions'
    cy.url().should('include', '/commands/actions')

    cy.get('.action-email')
      .type('fake@email.com')
      .should('have.value', 'fake@email.com')
  })
})
