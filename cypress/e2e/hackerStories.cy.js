const chance = require('chance').Chance()

describe('Hacker Stories', () => {
  beforeEach(() => {
    // cy.intercept('GET', '**/search?query=React&page=0').as('query')
    // cy.visit('/')
    // cy.wait('@query')

    // Exercício extra 1
    cy.intercept({
      method: 'GET',
      pathname: '**/search',
      query: {
        query: 'React',
        page: '0'
      }
    }).as('getStories')
    cy.visit('/')
    cy.wait('@getStories');
  })

  it('shows the footer', () => {
    cy.get('footer')
      .should('be.visible')
      .and('contain', 'Icons made by Freepik from www.flaticon.com')
  })

  context('List of stories', () => {
    // Since the API is external,
    // I can't control what it will provide to the frontend,
    // and so, how can I assert on the data?
    // This is why this test is being skipped.
    // TODO: Find a way to test it out.
    it.skip('shows the right data for all rendered stories', () => {})

    it('shows 20 stories, then the next 20 after clicking "More"', () => {
      cy.intercept({
        method: 'GET',
        pathname: '**/search',
        query: {
          query: 'React',
          page: '1'
        }
      }).as('getNextStories')
      cy.get('.item').should('have.length', 20)

      cy.contains('More').click()
      cy.wait('@getNextStories')
      
      
      cy.get('.item').should('have.length', 40)
    })

    it('shows only nineteen stories after dimissing the first story', () => {
      cy.get('.button-small')
        .first()
        .click()

      cy.get('.item').should('have.length', 19)
    })

    // Since the API is external,
    // I can't control what it will provide to the frontend,
    // and so, how can I test ordering?
    // This is why these tests are being skipped.
    // TODO: Find a way to test them out.
    context.skip('Order by', () => {
      it('orders by title', () => {})

      it('orders by author', () => {})

      it('orders by comments', () => {})

      it('orders by points', () => {})
    })
  })

  context('Search', () => {
    const initialTerm = 'React'
    const newTerm = 'Cypress'

    beforeEach(() => {
      cy.get('#search')
        .clear()

      cy.intercept('GET', `**/search?query=${newTerm}&page=0`)
      .as('newStories')
    })

    it('types and hits ENTER', () => {
      cy.get('#search')
        .type(`${newTerm}{enter}`)

      cy.wait('@newStories')

      cy.get('.item').should('have.length', 20)
      cy.get('.item')
        .first()
        .should('contain', newTerm)
      cy.get(`button:contains(${initialTerm})`)
        .should('be.visible')
    })

    it('types and clicks the submit button', () => {
      cy.get('#search')
        .type(newTerm)
      cy.contains('Submit')
        .click()

      cy.wait('@newStories')

      cy.get('.item').should('have.length', 20)
      cy.get('.item')
        .first()
        .should('contain', newTerm)
      cy.get(`button:contains(${initialTerm})`)
        .should('be.visible')
    })

    // Somente para ilustração da alterantiva do submit()
    it.skip('types and submitis the form directly', () => {
      cy.get('#search')
      .type(newTerm)

      cy.get('form').submit();

      cy.wait('@newStories')

      cy.get('.item').should('have.length', 20)
    })

    context('Last searches', () => {
      it('searches via the last searched term', () => {
        cy.get('#search')
          .type(`${newTerm}{enter}`)

        cy.wait('@newStories')

        cy.get(`button:contains(${initialTerm})`)
          .should('be.visible')
          .click()

        cy.wait('@getStories')

        cy.get('.item').should('have.length', 20)
        cy.get('.item')
          .first()
          .should('contain', initialTerm)
        cy.get(`button:contains(${newTerm})`)
          .should('be.visible')
      })

      it('shows a max of 5 buttons for the last searched terms', () => {
        cy.intercept(
          'GET',
          '**/search**'
        ).as('getRandomStories')

        Cypress._.times(6, () => {
          cy.get('#search')
            .clear()
            .type(`${chance.word()}{enter}`)
          cy.wait('@getRandomStories')
        })

        cy.get('.last-searches button')
          .should('have.length', 5)
      })
    })
  })
})



    // Hrm, how would I simulate such errors?
    // Since I still don't know, the tests are being skipped.
    // TODO: Find a way to test them out.
context.only('Errors', () => {
  const errorTerm = "http500"
  const errorMsg = "Something went wrong ..."
  beforeEach(() => {
    cy.visit('/');
    cy.get('#search')
      .clear()
  })
  it('shows "Something went wrong ..." in case of a server error', () => {
    cy.intercept(
      'GET',
      `search?query=${errorTerm}&page=0`,
      { statusCode: 500 }
    ).as('getServerFailure')

    cy.get('#search')
    .type(`${errorTerm}{enter}`)
    cy.wait('@getServerFailure')

    cy.contains(errorMsg).should('be.visible')
  })

  it('shows "Something went wrong ..." in case of a network error', () => {
    cy.intercept(
      'GET',
      `search**`,
      { forceNetworkError: true}
    ).as('getNetworkError')

    cy.get('#search')
    .type(`${errorTerm}{enter}`)
    cy.wait('@getNetworkError')

    cy.contains(errorMsg).should('be.visible')
  })
})
