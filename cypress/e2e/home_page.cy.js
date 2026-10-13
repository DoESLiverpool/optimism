/* eslint-env mocha */
/* global cy, expect */

const bookingPath = '/select-a-resource';
const doesLiverpoolUrl = 'https://doesliverpool.com/';
const mobileViewport = { width: 375, height: 667 };
const publicPages = ['/', bookingPath];

/** Checks the shared public navigation destinations. */
function checkNavigation () {
  cy.get('nav').within(() => {
    cy.contains('a.nav-link', 'Home').should('have.attr', 'href', '/');
    cy.contains('a.nav-link', 'DoES Liverpool').should('have.attr', 'href', doesLiverpoolUrl);
    cy.contains('a', 'Make a booking').should('have.attr', 'href', bookingPath);
    cy.get('.sr-only').should('not.exist');
  });
}

describe('The Home Page', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('contains the booking heading and introduction', () => {
    cy.get('h1').should('contain', 'Booking resources at DoES Liverpool');
    cy.get('.jumbotron').should('contain', 'Choose a resource, select an available time, and enter your details to make a booking.');
  });

  it('goes to select a resource if the hero button is clicked', () => {
    cy.get('.jumbotron a').click();
    cy.location('pathname').should('eq', bookingPath);
  });

  it('contains no placeholder copy or links', () => {
    const placeholderCopy = /This is a template|Some pages|That might be|Of interest|View details|Fusce dapibus|Donec sed odio|Qualche parole|E ancora/;
    const allowedDestinations = ['/', bookingPath, doesLiverpoolUrl];

    cy.get('body').invoke('text').should('not.match', placeholderCopy);
    cy.get('a[href="#"]').should('not.exist');
    cy.get('a').each(($link) => {
      expect($link.attr('href')).to.be.oneOf(allowedDestinations);
    });
    cy.get('nav .nav-link').should('have.length', 2);
  });

  it('explains how to book and links to resource selection', () => {
    cy.contains('h2', 'Make a booking').parent().within(() => {
      cy.contains('p', 'Choose a resource, select an available time, and enter your details.');
      cy.contains('a', 'Start your booking').click();
    });
    cy.location('pathname').should('eq', bookingPath);
  });

  it('explains where to find the token-specific cancellation link', () => {
    cy.contains('h2', 'Cancel a booking').parent().within(() => {
      cy.contains('p', 'confirmation page');
      cy.contains('p', 'confirmation email');
      cy.get('a').should('not.exist');
    });
    cy.get('a[href="/cancel-booking"]').should('not.exist');
  });

  it('links to the DoES Liverpool website', () => {
    cy.contains('h2', 'About DoES Liverpool').parent().within(() => {
      cy.contains('a', 'Visit DoES Liverpool').should('have.attr', 'href', doesLiverpoolUrl);
    });
  });
});

describe('Public navigation', () => {
  publicPages.forEach((page) => {
    it(`has working desktop navigation on ${page}`, () => {
      cy.visit(page);
      checkNavigation();
      cy.get('nav .navbar-toggler').should('not.be.visible');
      cy.get('nav .navbar-collapse').should('be.visible');
      cy.contains('nav a', 'Make a booking').click();
      cy.location('pathname').should('eq', bookingPath);
      cy.contains('nav a.nav-link', 'Home').click();
      cy.location('pathname').should('eq', '/');
    });

    it(`expands and collapses mobile navigation on ${page}`, () => {
      cy.viewport(mobileViewport.width, mobileViewport.height);
      cy.visit(page);
      checkNavigation();
      cy.get('nav .navbar-collapse').should('not.be.visible');
      cy.get('nav .navbar-toggler').click().should('have.attr', 'aria-expanded', 'true');
      // Bootstrap ignores toggle clicks until the opening transition finishes.
      cy.get('nav .navbar-collapse').should('have.class', 'show').and('be.visible');
      cy.get('nav .navbar-toggler').click().should('have.attr', 'aria-expanded', 'false');
      cy.get('nav .navbar-collapse').should('not.have.class', 'collapsing').and('not.be.visible');
    });
  });
});
