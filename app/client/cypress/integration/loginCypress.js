describe('Tests the login page', () => {
  it('Enter Username and passwords successfully', () => {
    cy.visit('http://localhost:8081/');
    cy.get('#NameInput').should('exist');
    cy.get('#NameInput').type('RoutesTestUser3').should('have.value', 'RoutesTestUser3');
    cy.get('#pwdInput').should('exist');
    cy.get('#pwdInput').type('test').should('have.value', 'test');
    cy.get('#sign').should('exist');
    cy.get('#sign').click();
    cy.get('#navbar').should('exist');
  })
})