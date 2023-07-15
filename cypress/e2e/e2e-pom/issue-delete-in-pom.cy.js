/**
 * This is an example file and approach for POM in Cypress
 */
import IssueModal from "../../pages/IssueModal";

describe('Issue delete', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.url().should('eq', `${Cypress.env('baseUrl')}project/board`).then((url) => {
      //open issue detail modal with title from line 16
      cy.contains(issueTitle).click();
    });
  });

  //issue title, that we are testing with, saved into variable
  const issueTitle = 'This is an issue of type: Task.';

  it('Should delete issue successfully', () => {
    //add steps to delete issue
    IssueModal.clickDeleteButton();
    IssueModal.confirmDeletion();

    cy.reload();

    // assert, that the issue is deleted
    IssueModal.ensureIssueIsNotVisibleOnBoard(issueTitle);

  });

  it('Should cancel deletion process successfully', () => {
    //add steps to start deletion process but cancel it
    IssueModal.clickDeleteButton();
    IssueModal.cancelDeletion();

    // need to close the issue detail modal
    IssueModal.closeDetailModal();
    
    cy.reload();

    // assert, that the issue is not deleted
    IssueModal.ensureIssueIsVisibleOnBoard(issueTitle);
  });
});
