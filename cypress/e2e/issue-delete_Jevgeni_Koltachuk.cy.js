describe('Issue delete', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.url().should('eq', `${Cypress.env('baseUrl')}project`).then((url) => {
      cy.visit(url + '/board');
      // Assign alias to the first issues text and open the issue
      cy.get('[data-testid="list-issue"]')
        .first()
        .invoke('text')
        .as('firstIssueText')
      cy.get('[data-testid="list-issue"]')
        .first()
        .click()
    });
  });

  it('Test 1 - Should delete an issue and assert', () => {
    
    // Test execution
    cy.get('[data-testid="icon:trash"]').click()
    cy.contains('button', 'Delete issue').click()

    // Assertion
    cy.contains('Are you sure you want to delete this issue?')
      .should('not.exist');
    cy.reload()
    cy.get('@firstIssueText').then((firstIssueText) => {
      cy.get('[data-testid="list-issue"]').should('not.contain', firstIssueText);
    })
  });

  it('Test 2 - Should cancel the delete sequence and assert', () => {

    // Test execution
    cy.get('[data-testid="icon:trash"]').click()
    cy.contains('button', 'Cancel').click()

    // Assertion
    cy.contains('Are you sure you want to delete this issue?')
      .should('not.exist');
    cy.reload()
    cy.get('@firstIssueText').then((firstIssueText) => {
      cy.get('[data-testid="list-issue"]').should('contain', firstIssueText);
    })
  })
})
