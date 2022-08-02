/* eslint-disable no-undef */
const expect = require('chai').expect;
const request = require('supertest');
const app = require('../../app');
const knex = require('../../db');

describe('Specifc API tests to check DELETE endpoint for slots', function () {
  beforeEach(async function () {
    await knex.migrate.latest();
    await knex.migrate.rollback();
    await knex.migrate.latest();
    await knex.seed.run();
  });
  it('deletes a slot and removes entries in resources_types table', async () => {
    // A slot may have entries in the resources_slots table to associate it with
    // specific resources. Include a check for this deletion in this test.
    const slotId = 1;
    const getSlotResponse = await request(app).get(`/api/slots/${slotId}`);
    expect(getSlotResponse.status).to.equal(200);
    const resourcesSlots = await knex.select('resource_id', 'slot_id').from('resources_slots').where({ slot_id: slotId });
    expect(resourcesSlots.length).to.be.greaterThan(0);
    const deleteResponse = await request(app).delete(`/api/slots/${slotId}`);
    expect(deleteResponse.status).to.equal(200);
    const resourcesSlotsAfterDeletion = await knex.select('resource_id', 'slot_id').from('resources_slots').where({ slot_id: slotId });
    expect(resourcesSlotsAfterDeletion.length).to.equal(0);
    const getSlotResponseAfterDeletion = await request(app).get(`/api/slots/${slotId}`);
    expect(getSlotResponseAfterDeletion.status).to.equal(404);
  });
  it('does not delete a slot if the transaction fails due to missing resources_slots table', async () => {
    await knex.schema.dropTable('resources_slots');
    const response = await request(app).delete('/api/slots/1');
    expect(response.status).to.equal(500);
    // Check the slot hasn't been deleted.
    const shouldStillBeThereResponse = await request(app).get('/api/slots/1');
    expect(shouldStillBeThereResponse.status).to.equal(200);
  });
});
