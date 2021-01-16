const {chai} = require("chai");
const {expect} = require("chai").expect;
const request = require("supertest");
const {app} = require("../api/app");

describe('app.js integration test', () => {
   it('test for 500 status in resources', () => {
       // given I am a valid user
            
       // when I call app.js
            const response = request(app).get("/api/resources")
       // then I expect a 500 status
            expect(response.status).to.equal(500)
   });
});

