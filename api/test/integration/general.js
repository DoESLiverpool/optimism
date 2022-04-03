/* eslint-disable no-undef */
const expect = require('chai').expect;
const request = require('supertest');
const app = require('../../app');
const knex = require('../../db');
const { getIdTestDataForGet, getPostTestData, getPutTestData, getIdTestDataForDelete } = require('../helpers');

/*
  These are *basic* endpoint tests for each of the routes that are based on a ModelItemsBase-derived
  model class. They rely on test data from ../helpers.

  They test the following:
    Parameter validation:
      > check for correct HTTP response codes when passed incorrect ids values
      > check for correct HTTP response codes when passed invalid items for either PUT ot POST requests
    GET, PUT, POST and DELETE endpoints:
      > check that GET requests return correct data
      > check that POST requests result in creation of the item
      > check that PUT requests update an existing item
      > check that DELETE requests result in deletion of the requested item

  NOTE: They don't check all functionality for all endpoints. For example, DELETE requests on resources cause
  the side-effect of nulling the resourceId property of any bookings for that resource. Specific tests for
  this and other endpoints have to be provided separately.
*/

describe('Basic tests to check GET, POST, PUT and DELETE endpoints as well as parameter validation', function () {
  beforeEach(async function () {
    // These commands ensure there is a consistent database
    // to work against for each test.
    await knex.migrate.latest();
    await knex.migrate.rollback();
    await knex.migrate.latest();
    await knex.seed.run();
  });
  // This array specifies the endpoints that the tests run against.
  // Ex: 'resources' tests the /api/resources endpoints.
  // If new endpoints get added, add them here and update the testData object in ../helpers.js.
  const endpoints = [
    'resources',
    'slots',
    'resource-types',
    'bookings'
  ];
  endpoints.forEach(itemsName => {
    describe(`${itemsName.toUpperCase()}`, () => {
      describe(`GET /api/${itemsName}/id`, () => {
        // Test that valid, invalid and non-existing ids return appropriate HTTP status codes.
        getIdTestDataForGet(itemsName).forEach((input) => {
          it(`returns an HTTP ${input.httpStatusCode} status with ${input.description}`, async () => {
            const response = await request(app).get(`/api/${itemsName}/${input.id}`);
            expect(response.status).to.equal(input.httpStatusCode);
          });
        });
      });

      describe(`POST /api/${itemsName}`, () => {
        const testData = getPostTestData(itemsName);
        // Check that trying to create a new item returns the correct HTTP status code
        // according to the validity of the supplied data to the POST request.
        testData.tests.forEach((input) => {
          it(`returns an HTTP ${input.httpStatusCode} status with ${input.description}`, async () => {
            const response = await request(app).post(`/api/${itemsName}`).send(input.body);
            expect(response.status).to.equal(input.httpStatusCode);
          });
        });

        // Check that a valid POST request results in an item being created containing
        // the correct properties.
        it(`inserts the correct ${itemsName} item in the database`, async () => {
          const response = await request(app).post(`/api/${itemsName}`).send(testData.example);
          expect(response.status).to.equal(201);
          const newId = response.body[0];
          const newItem = await request(app).get(`/api/${itemsName}/${newId}`);
          expect(newItem.status).to.equal(200);
          expect(newItem.body).includes(testData.example);
        });
      });

      describe(`PUT /api/${itemsName}/id`, () => {
        const data = getPutTestData(itemsName);
        data.forEach((input) => {
          it(`returns an HTTP ${input.httpStatusCode} status with ${input.description}`, async () => {
            const response = await request(app).put(`/api/${itemsName}/${input.id}`).send(input.body);
            expect(response.status).to.equal(input.httpStatusCode);
          });
        });
        it(`updates an existing ${itemsName} item correctly`, async () => {
          const item = await request(app).get(`/api/${itemsName}/1`);
          item.body.name = 'Updated in test method';
          const response = await request(app).put(`/api/${itemsName}/1`).send(item.body);
          expect(response.status).to.equal(200);
          const updatedItem = await request(app).get(`/api/${itemsName}/1`);
          expect(updatedItem.body.name).equals('Updated in test method');
        });
      });

      describe(`DELETE api/${itemsName}/id`, () => {
        getIdTestDataForDelete(itemsName).forEach((input) => {
          it(`returns an HTTP ${input.httpStatusCode} status with ${input.description}`, async () => {
            const response = await request(app).delete(`/api/${itemsName}/${input.id}`);
            expect(response.status).to.equal(input.httpStatusCode);
          });
        });
      });
    });
  });
});
