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
  
   it('Checks resource type is json when valid resource is entered', async () => {
    const response = await request(app)
      .get('/api/resources/5')

       expect(response.status).to.equal(200)
       expect(response).to.be.json;
       // expect(response.body).to.equal('"id":5,"name":"Hot Desk","resourceTypeName":"hot-desk"');
       expect(response.body).to.have.property("id");
       expect(response.body.id).to.equal(5);
       expect(response.body).to.have.property("name");
       expect(response.body.name).to.equal("Hot Desk");
       expect(response.body).to.have.property("resourceTypeName");
       expect(response.body.resourceTypeName).to.equal("hot-desk");

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
