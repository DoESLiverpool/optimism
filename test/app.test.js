const {chai} = require("chai");
const expect = require("chai").expect;
const request = require("supertest");

const app = require("../api/app");

describe('app.js integration test', () => {
   it('Returns a 404 status on invalid /resource endpoint', async () => {
    const response = await request(app)
      .get('/api/resources/nothing')

        console.log(response.error.text)

        expect(response.status).to.equal(404)
        expect(response.error.text).to.equal("No such resource")      
   });

   it('Returns a 200 status on valid /resource endpoint', async () => {
    const response = await request(app)
      .get('/api/resources/')

        expect(response.status).to.equal(200)
   });
});