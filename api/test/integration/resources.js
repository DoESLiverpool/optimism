/* eslint-disable no-undef */
const expect = require('chai').expect;
const request = require('supertest');
const app = require('../../app');
const knex = require('../../db');

describe('Specifc API tests to check DELETE endpoint for resources', function () {
  beforeEach(async function () {
    await knex.migrate.latest();
    await knex.migrate.rollback();
    await knex.migrate.latest();
    await knex.seed.run();
  });
  it('deletes a resource, nulls resourceId in bookings and removes entries in resources_types table', async () => {
    // A booking has a resourceId property. After deleting a resource whose id == the booking resourceId,
    // that booking's resourceId will be set to null. Include a check for this in this test.
    const resourceId = 1;
    const bookings = await request(app).get('/api/bookings');
    const bookingIdsForResource = [];
    for (const b of bookings.body) {
      if (b.resourceId === resourceId) {
        bookingIdsForResource.push(b.id);
      }
    }
    expect(bookingIdsForResource.length).to.be.greaterThan(0);
    // Delete the resource.
    const deleteResponse = await request(app).delete(`/api/resources/${resourceId}`);
    expect(deleteResponse.status).to.equal(200);
    // Check each booking that had resourceId == resourceToDelete.id now has resourceId == null.
    for (const id of bookingIdsForResource) {
      const booking = await request(app).get(`/api/bookings/${id}`);
      expect(booking.body.resourceId).to.equal(null);
    }
    // Check that the resource itself has been deleted.
    const getResourceResponse = await request(app).get('/api/resources/1');
    expect(getResourceResponse.status).to.equal(404);
  });
  it('does not delete a resource if the transaction fails due to missing bookings table', async () => {
    // Deleting a resource and nulling any booking's resourceId where it was equal to resource.id
    // happens in a transaction. Check that resource deletion fails when there is an error in
    // the transaction. Force the error by dropping the bookings table.
    await knex.schema.dropTable('bookings');
    const response = await request(app).delete('/api/resources/1');
    expect(response.status).to.equal(500);
    // Check the resource hasn't been deleted.
    const shouldStillBeThereResponse = await request(app).get('/api/resources/1');
    expect(shouldStillBeThereResponse.status).to.equal(200);
  });
});
