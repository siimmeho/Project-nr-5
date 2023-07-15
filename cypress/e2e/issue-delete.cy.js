import { faker } from '@faker-js/faker';
describe('Issue delete', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.url().should('eq', `${Cypress.env('baseUrl')}project`).then((url) => {
      cy.visit(url + '/board');
      cy.contains('This is an issue of type: Task.').click();

      //assert, that issue detail view modal is visible
      cy.get('[data-testid="modal:issue-details"]').should('be.visible');
    });
  });

  it('Should delete an issue', () => {

    // find the delete button in the issue modal
    cy.get('[data-testid="icon:trash"]').click();

    // find issue delete modal and confirm the deleting
    cy.get('[data-testid="modal:confirm"').should('be.visible');
    cy.get('[data-testid="modal:confirm"]').contains('button', 'Delete issue').click();

    // Assert, that deletion confirmation dialogue is not visible.
    cy.get('[data-testid="modal:confirm"').should('not.exist');

    cy.reload();

    // Assert, that issue is deleted and not displayed on the Jira board anymore.
    cy.get('[data-testid="list-issue"]')
      .should('not.have.text', 'This is an issue of type: Task.');

  })

  it('Starting the deleting issue process, but cancelling this action', () => {

    // Assert, that issue detail view modal is visible.
    cy.get('[data-testid="modal:issue-details"]').should('be.visible');

    // find the delete button in the issue modal
    cy.get('[data-testid="icon:trash"]').click();

    // find issue delete modal and cancel the deleting process
    cy.get('[data-testid="modal:confirm"').should('be.visible');
    cy.get('[data-testid="modal:confirm"]').contains('button', 'Cancel').click();

    // Assert, that deletion confirmation dialogue is not visible.
    cy.get('[data-testid="modal:confirm"').should('not.exist');

    // Need to close the issue details modal
    cy.get('[data-testid="icon:close"]').first().click();

    cy.reload();

    // Assert, that issue isnot deleted and is displayed on the Jira board.
    cy.get('[data-testid="list-issue"]').first().should('have.text', 'This is an issue of type: Task.');

  })

});






