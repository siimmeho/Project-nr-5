describe('Time tracking', () => {

  const title = 'Fresh story'
  const number = 10
  const newNumber = 20
  const timeSpent = 2
  const timeRemaining = 5

  beforeEach(() => {
    cy.visit('/');
    cy.url().should('eq', `${Cypress.env('baseUrl')}project/board`).then((url) => {
      //System will already open issue creating modal in beforeEach block  
      cy.visit(url + '/board?modal-issue-create=true');


    });


  });

  it('User can add, update and remove estimation time DONE', () => {

    // First create a new issue so you have blank space to work on
    cy.get('[data-testid="modal:issue-create"]').within(() => {

      //open issue type dropdown and choose Story
      cy.get('[data-testid="select:type"]').click();
      cy.get('[data-testid="select-option:Story"]')
        .trigger('click');

      //Type value to description input field
      cy.get('.ql-editor').type('TEST_DESCRIPTION');

      //Type value to title input field
      //Order of filling in the fields is first description, then title on purpose
      //Otherwise filling title first sometimes doesn't work due to web page implementation
      cy.get('input[name="title"]').type(title);

      //Select Lord Gaben from reporter dropdown
      cy.get('[data-testid="select:userIds"]').click();
      cy.get('[data-testid="select-option:Lord Gaben"]').click();

      //Click on button "Create issue"
      cy.get('button[type="submit"]').click();
    });

    //Assert that modal window is closed and successful message is visible
    cy.get('[data-testid="modal:issue-create"]').should('not.exist');
    cy.contains('Issue has been successfully created.').should('be.visible');

    //Reload the page to be able to see recently created issue
    //Assert that successful message has dissappeared after the reload
    cy.reload();
    cy.contains('Issue has been successfully created.').should('not.exist');


    // Open the new created issue
    cy.get('[data-testid="list-issue"]').first().contains(title).click();
    cy.get('textarea[placeholder="Short summary"]').contains(title).click();
    cy.get('[data-testid="modal:issue-details"]').should('be.visible');

    // Assure that estimated time is empty and there is no time logged
    cy.get('input[placeholder="Number"]').should('be.empty');
    cy.contains('No time logged').should('be.visible');

    // User adds value 10 to "Original estimate field"
    cy.get('input[placeholder="Number"]').type(number).should('have.value', number);
    cy.get('textarea[placeholder="Short summary"]').contains(title).click();

    // Close the issue detail modal
    cy.get('[data-testid="icon:close"]').first().click();

    // Wait so that the value is added
    cy.wait(5000);

    // Reopen the same issue and check that the original estimation is saved
    cy.get('[data-testid="list-issue"]').first().contains(title).click();
    cy.get('input[placeholder="Number"]').should('have.value', number);

    // User changes the value to 20 and checks that the original value is saved
    cy.get('input[placeholder="Number"]').clear().type(newNumber).should('have.value', newNumber);
    cy.get('textarea[placeholder="Short summary"]').contains(title).click();
    cy.get('[data-testid="icon:close"]').first().click();

    cy.wait(5000);

    cy.get('[data-testid="list-issue"]').first().contains(title).click();
    cy.get('input[placeholder="Number"]').should('have.value', newNumber);

    // User removes value from the field "Original estimate"
    cy.get('input[placeholder="Number"]').clear();
    cy.get('textarea[placeholder="Short summary"]').contains(title).click();
    cy.get('[data-testid="icon:close"]').first().click();

    cy.wait(5000);

    // User reopens the modal and checks that the original estimation is saved
    cy.get('[data-testid="list-issue"]').first().contains(title).click();
    cy.get('input[placeholder="Number"]').should('be.empty').should('be.visible');
    cy.contains('No time logged').should('be.visible');


  });

  it('User logs spent time to recently created issue and then removes it', () => {

    // First create a new issue so you have blank space to work on
    cy.get('[data-testid="modal:issue-create"]').within(() => {

      //open issue type dropdown and choose Story
      cy.get('[data-testid="select:type"]').click();
      cy.get('[data-testid="select-option:Story"]')
        .trigger('click');

      //Type value to description input field
      cy.get('.ql-editor').type('TEST_DESCRIPTION');

      //Type value to title input field
      //Order of filling in the fields is first description, then title on purpose
      //Otherwise filling title first sometimes doesn't work due to web page implementation
      cy.get('input[name="title"]').type(title);

      //Select Lord Gaben from reporter dropdown
      cy.get('[data-testid="select:userIds"]').click();
      cy.get('[data-testid="select-option:Lord Gaben"]').click();

      //Click on button "Create issue"
      cy.get('button[type="submit"]').click();
    });

    //Assert that modal window is closed and successful message is visible
    cy.get('[data-testid="modal:issue-create"]').should('not.exist');
    cy.contains('Issue has been successfully created.').should('be.visible');

    //Reload the page to be able to see recently created issue
    //Assert that successful message has dissappeared after the reload
    cy.reload();
    cy.contains('Issue has been successfully created.').should('not.exist');


    // Open the new created issue
    cy.get('[data-testid="list-issue"]').first().contains(title).click();
    cy.get('textarea[placeholder="Short summary"]').contains(title).click();
    cy.get('[data-testid="modal:issue-details"]').should('be.visible');

    // User clicks on time tracking section, Check that time tracking pop-up dialogue is opened
    cy.get('[data-testid="icon:stopwatch"]').next().click();
    cy.get('[data-testid="modal:tracking"]').should('be.visible');


    // User enters value 2 to the field “Time spent” and value 5 to the field "Time remaining"
    cy.get('input[placeholder="Number"]').eq(1).type(timeSpent).should('have.value', timeSpent);
    cy.contains('Time tracking').click();
    cy.get('input[placeholder="Number"]').eq(2).type(timeRemaining).should('have.value', timeRemaining);
    cy.contains('button', 'Done')
      .click()
      .should('not.exist');

    // Close the issue detail modal
    cy.get('[data-testid="icon:close"]').first().click();

    // Wait so that the value is added
    cy.wait(5000);

    // Reopen the same issue and check that the original estimation is saved
    cy.get('[data-testid="list-issue"]').first().contains(title).click();
    cy.get('[data-testid="modal:issue-details"]').should('be.visible');

    cy.contains('2h logged').should('be.visible');
    cy.contains('5h remaining').should('be.visible');

    // User deletes value 2 from the field “Time spent” and value 5 from the field "Time remaining"
    cy.get('[data-testid="icon:stopwatch"]').next().click();
    cy.get('[data-testid="modal:tracking"]').should('be.visible');

    cy.get('input[placeholder="Number"]').eq(1).clear().should('have.value', '');
    cy.contains('Time tracking').click();
    cy.get('input[placeholder="Number"]').eq(2).clear().should('have.value', '');
    cy.contains('button', 'Done')
      .click()
      .should('not.exist');

    cy.wait(5000);

    // User reopens the issue details module
    cy.get('[data-testid="icon:close"]').first().click();
    cy.get('[data-testid="list-issue"]').first().contains(title).click();
    
    // User checks that spent time number is removed from the time tracking section, User sees original estimation in the time tracking section and added time remaining value is removed
    cy.get('[data-testid="icon:stopwatch"]').next().contains('No time logged');

  });


});

