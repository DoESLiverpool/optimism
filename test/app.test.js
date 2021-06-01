var chai = require("chai"), 
	chaiHttp = require('chai-http');
chai.use(chaiHttp);
 
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
  
   it('Returns resource values when valid resource is entered', async () => {
    const response = await request(app)
      .get('api/resources/5')

       expect(response).to.be.html;
   });

   it('Returns a 404 status on invalid /calendar endpoint', async () => {
    const response = await request(app)
      .get('/api/calendar/nothing')

        console.log(response.error.text)

        expect(response.status).to.equal(404)
        //expect(response.error.text).to.equal("No such calendar")      
   });

   it('Returns a 200 status on valid /calendar endpoint', async () => {
    const response = await request(app)
      .get('/api/calendar/2021-05-31/2021-06-01/5')

        expect(response.status).to.equal(200)
   });

});
