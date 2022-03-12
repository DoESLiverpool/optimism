const { chai } = require("chai");
const expect = require("chai").expect;
const request = require("supertest");

const app = require("../app");

describe('Optimism api endpoint tests', () => {

  it('Returns a 404 status on invalid /resource endpoint', async () => {
    const response = await request(app).get('/api/resources/nothing');
    expect(response.status).to.equal(404);
    expect(response.error.text).to.equal("No such resource");
  });

  it('Returns a 200 status on valid /resource endpoint', async () => {
    const response = await request(app).get('/api/resources/');
    expect(response.status).to.equal(200);
  });

  it('Returns a 404 status on invalid /calendar endpoint', async () => {
    const response = await request(app).get('/api/calendar/nothing');
    expect(response.status).to.equal(404);
  });

  it('Returns a 200 status on valid /calendar endpoint', async () => {
    const response = await request(app).get('/api/calendar/2021-04-06/2021-04-14/1');
    expect(response.status).to.equal(200);
  });
});
