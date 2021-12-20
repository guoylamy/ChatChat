describe('Tests the register players page', () => {
  it('Enter Username and passwords successfully', () => {
    cy.visit('http://localhost:3000/');
    cy.get('#registerButton').should('exist');
    const randomUserName = (Math.random() + 1).toString(36).substring(7);
    cy.get('#registerButton').click();
    cy.get('#registerInput').should('exist');
    cy.get('#registerInput').type(randomUserName);
    cy.get('#pwdInput').should('exist');
    cy.get('#pwdInput').type('12345').should('have.value', '12345');
    cy.get('#createButton').should('exist');
    cy.get('#createButton').click();
  })
})