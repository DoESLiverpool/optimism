/* eslint-disable no-undef */
const expect = require('chai').expect;
const request = require('supertest');
const app = require('../../app');
const knex = require('../../db');

describe('Basic parameter validation on calendar endpoint API', function () {
  beforeEach(async function () {
    await knex.migrate.latest();
    await knex.migrate.rollback();
    await knex.migrate.latest();
    await knex.seed.run();
  });
  describe('GET api/calendar', () => {
    const inputs = [
      { description: 'valid dates and resource id', startDate: '2022-03-17', endDate: '2022-03-18', resourceId: 1, httpStatusCode: 200 },
      { description: 'invalid start date', startDate: '2022-17-03', endDate: '2022-17-04', resourceId: 1, httpStatusCode: 400 },
      { description: 'invalid end date', startDate: '2022-03-17', endDate: '2022-', resourceId: 1, httpStatusCode: 400 },
      { description: 'invalid resource id', startDate: '2022-03-17', endDate: '2022-03-18', resourceId: -1, httpStatusCode: 400 },
      { description: 'start date > end date', startDate: '2022-03-18', endDate: '2022-03-17', resourceId: -1, httpStatusCode: 400 },
      { description: 'deliberately failing test', startDate: '2022-03-18', endDate: '2022-03-17', resourceId: -1, httpStatusCode: 200 },
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
