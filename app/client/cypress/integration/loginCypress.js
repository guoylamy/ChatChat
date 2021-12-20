describe('Tests the login page', () => {
  it('Enter Username and passwords successfully', () => {
    cy.visit('http://localhost:3000/');
    cy.get('#NameInput').should('exist');
    cy.get('#NameInput').type('123').should('have.value', '123');
    cy.get('#pwdInput').should('exist');
    cy.get('#pwdInput').type('123').should('have.value', '123');
    cy.get('#sign').should('exist');
    cy.get('#sign').click();
    cy.get('#navbar').should('exist');
  })
})