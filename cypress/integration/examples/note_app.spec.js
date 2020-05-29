describe('Blog ', function() {  // funktio voitaisiin korvata nuolifunktiolla mutta sen käyttöä ei suositella

  beforeEach(function() {
    cy.request('POST', 'http://localhost:3001/api/testing/reset')
    const user = {
      name: 'pekkala',
      username: 'pekkala',
      password: 'pekkala'
    }
    cy.request('POST', 'http://localhost:3001/api/users/', user)
    cy.visit('http://localhost:3000')
  })

  it('front page can be opened', function() {
    cy.contains('Blog site')
    cy.contains('log in')
  })

  it('login form can be opened', function() {
    cy.contains('log in').click()
    cy.get('#username').type('pekkala')
    cy.get('#password').type('pekkala')
    cy.get('#login-button').click()

    cy.contains('pekkala logged in')
  })

  describe('when logged in', function() {
    /*
    beforeEach(function() {
      cy.contains('log in').click()
      cy.get('input:first').type('pekkala')
      cy.get('input:last').type('pekkala')
      cy.get('#login-button').click()
    })
    */

    beforeEach(function() {
      cy.login({ username: 'pekkala', password: 'pekkala' })
      cy.createBlog({
        author: 'another note cypress',
        title: 'title',
        url: 'osoite',
        likes: '100'
      })
    })

    it('a new note can be created', function() {
      cy.contains('Add new blog').click()
      cy.get('.author').type('author created by cypress pekkala')
      cy.get('.title').type('title created by cypress')
      cy.get('.url').type('url created by cypress')
      cy.get('.likes').type('123')
      cy.contains('save').click()
      cy.contains('New blog added')
    })

    it('more details can be shown and likes work', function() {
      /* vanha tapa
      cy.contains('Add new blog').click()
      cy.get('.author').type('author created by cypress pekkala')
      cy.get('.title').type('title created by cypress')
      cy.get('.url').type('url created by cypress')
      cy.get('.likes').type('123')
      cy.contains('save').click()
      */

      cy.contains('Show more details').click()
      cy.contains('url created by cypress')
      cy.contains('123')
      cy.contains('like').click()
      cy.contains('124')
    })
  })
  it.only('login fails with wrong password', function() {
    cy.contains('log in').click()
    cy.get('#username').type('pekkala')
    cy.get('#password').type('wrong')
    cy.get('#login-button').click()

    // kolme eri tapaa tehdä
    cy.get('.error').contains('wrong credentials')
    cy.contains('wrong credentials')
    cy.get('.error')
      .should('contain', 'wrong credentials')
      .and('have.css', 'color', 'rgb(255, 0, 0)')
      .and('have.css', 'border-style', 'solid')

    cy.get('html').should('not.contain', 'pekkala logged in')
  })


})