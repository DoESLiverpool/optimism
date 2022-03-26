/* eslint-disable no-undef */
const expect = require('chai').expect;
const request = require('supertest');
const app = require('../app');
const knex = require('../db');

describe('API', function () {
  before(function () {
    return knex.migrate.latest();
  });
  beforeEach(async function () {
    await knex.migrate.rollback();
    await knex.migrate.latest();
    await knex.seed.run();
  });
  describe('GET /api/resources/{id}', () => {
    const inputs = [
      { description: 'valid resource id', resourceId: 1, httpStatusCode: 200 },
      { description: 'invalid resource id', resourceId: -1, httpStatusCode: 400 },
      { description: 'non-existant resource id', resourceId: 4000, httpStatusCode: 404 }
    ];
    inputs.forEach((input) => {
      it(`returns an HTTP ${input.httpStatusCode} status with ${input.description}`, async () => {
        const response = await request(app).get(`/api/resources/${input.resourceId}`);
        expect(response.status).to.equal(input.httpStatusCode);
      });
    });
  });
  describe('POST /api/resources', () => {
    const inputs = [
      {
        description: 'valid resource item',
        httpStatusCode: 200,
        body: { resourceTypeId: 1, name: 'Test', capacity: 123, minimumBookingTime: 30, maximumBookingTime: 60 }
      },
      {
        description: 'missing field in supplied resource item',
        httpStatusCode: 400,
        body: { name: 'Test', capacity: 123, minimumBookingTime: 30, maximumBookingTime: 60 }
      }
    ];
    inputs.forEach((input) => {
      it(`returns an HTTP ${input.httpStatusCode} status with ${input.description}`, async () => {
        const response = await request(app).post('/api/resources').send(input.body);
        expect(response.status).to.equal(input.httpStatusCode);
      });
    });
    it('inserts the correct resource in the database', async () => {
      const resource = {
        resourceTypeId: 1,
        name: 'post-test',
        capacity: 123,
        minimumBookingTime: 45,
        maximumBookingTime: 67
      };
      const response = await request(app).post('/api/resources').send(resource);
      const newId = response.body[0];
      const newResource = await request(app).get(`/api/resources/${newId}`);
      resource.id = newId;
      expect(newResource.body).includes(resource);
    });
  });
  describe('/api/calendar', () => {
    const inputs = [
      { description: 'valid dates and resource id', startDate: '2022-03-17', endDate: '2022-03-18', resourceId: 1, httpStatusCode: 200 },
      { description: 'invalid start date', startDate: '2022-17-03', endDate: '2022-17-04', resourceId: 1, httpStatusCode: 400 },
      { description: 'invalid end date', startDate: '2022-03-17', endDate: '2022-', resourceId: 1, httpStatusCode: 400 },
      { description: 'invalid resource id', startDate: '2022-03-17', endDate: '2022-03-18', resourceId: -1, httpStatusCode: 400 },
      { description: 'start date > end date', startDate: '2022-03-18', endDate: '2022-03-17', resourceId: -1, httpStatusCode: 400 },
      { description: 'non-existent resource id', startDate: '2022-03-17', endDate: '2022-03-18', resourceId: 4000, httpStatusCode: 404 }
    ];
    inputs.forEach((input) => {
      it(`returns an HTTP ${input.httpStatusCode} status with ${input.description}`, async () => {
        const response = await request(app).get(`/api/calendar/${input.startDate}/${input.endDate}/${input.resourceId}`);
        expect(response.status).to.equal(input.httpStatusCode);
      });
    });
  });
});
