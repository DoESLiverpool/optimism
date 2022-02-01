const {chai} = require("chai");
const expect = require("chai").expect;
const request = require("supertest");

var config = require('../knexfile.js')['testing'];
var knex = require('knex')(config);
const app = require("../app");


describe('app.js integration test', () => {
   before(function() {
    //  console.log('About to run migration');
    //  console.log(config);
    //  knex.migrate.latest();
    //  console.log('Finished running migration');
   });

   it('Returns a 404 status on invalid /resource endpoint...', async () => {
    console.log('About to run migration');
    console.log(config);
    knex.migrate.latest();
    console.log('Finished running migration');
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
   it('Returns a 404 status on invalid /calendar endpoint', async () => {
    const response = await request(app)
      .get('/api/calendar/nothing')

        console.log(response.error.text)

        expect(response.status).to.equal(404)
        //expect(response.error.text).to.equal("No such calendar")      
   });

   it('Returns a 200 status on valid /calendar endpoint', async () => {
    const response = await request(app)
      .get('/api/calendar/2021-04-06t00:00:00.000/2021-04-14t00:00:00.000/1')

        console.log(response.json())
        expect(response.status).to.equal(200)
   });
});
