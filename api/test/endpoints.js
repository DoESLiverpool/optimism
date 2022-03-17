const { chai } = require("chai");
const expect = require("chai").expect;
const request = require("supertest");

const app = require("../app");

describe('API', function () {
  describe('/api/resources', () => {
    it('returns an HTTP 400 status if an invalid resource id is provided', async () => {
      const response = await request(app).get('/api/resources/not-an-integer');
      expect(response.status).to.equal(400);
      expect(response.error.text).to.equal("Resource id is not valid.");
    });
    it('returns an HTTP 200 status if no resource id is provided', async () => {
      const response = await request(app).get('/api/resources/');
      expect(response.status).to.equal(200);
    });
  });
  describe('/api/calendar', () => {
    it('Returns a 404 status on invalid /calendar endpoint', async () => {
      const response = await request(app).get('/api/calendar/nothing');
      expect(response.status).to.equal(404);
    });
    it('Returns a 200 status on valid /calendar endpoint', async () => {
      const response = await request(app).get('/api/calendar/2021-04-06/2021-04-14/1');
      expect(response.status).to.equal(200);
    });
  });
})
