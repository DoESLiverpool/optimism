/* eslint-disable no-undef */
const expect = require('chai').expect;
const request = require('supertest');
const app = require('../../app');
const knex = require('../../db');
const emailService = require('../../services/emailService');

const cancellationToken = 'cancellation-test-token';
const originalCancellationNotifier = emailService.sendBookingCancellationNotificationEmail;
let cancellationNotificationCount = 0;

// Cancellation email delivery is deliberately asynchronous. Stub it here so
// these tests exercise the booking endpoint without contacting an SMTP server.
before(function () {
  emailService.sendBookingCancellationNotificationEmail = function () {
    cancellationNotificationCount++;
    return Promise.resolve({ messageId: 'test-message-id' });
  };
});

after(function () {
  emailService.sendBookingCancellationNotificationEmail = originalCancellationNotifier;
});

beforeEach(async function () {
  cancellationNotificationCount = 0;
  await knex.migrate.latest();
  await knex.migrate.rollback();
  await knex.migrate.latest();
  await knex.seed.run();
  await knex('bookings').where({ id: 1 }).update({
    token: cancellationToken,
    cancelled: false
  });
});

describe('booking cancellation flow', function () {
  it('does not cancel a booking when its cancellation link is opened', async function () {
    const response = await request(app).get(`/api/bookings/cancel/${cancellationToken}`);

    expect(response.status).to.equal(200);
    expect(response.body.token).to.equal(cancellationToken);
    expect(Boolean(response.body.cancelled)).to.equal(false);
    expect(cancellationNotificationCount).to.equal(0);

    const booking = await knex('bookings').where({ id: 1 }).first();
    expect(Boolean(booking.cancelled)).to.equal(false);
  });

  it('cancels the booking when cancellation is confirmed with POST', async function () {
    const response = await request(app).post(`/api/bookings/cancel/${cancellationToken}`);

    expect(response.status).to.equal(200);
    expect(Boolean(response.body.booking.cancelled)).to.equal(true);
    expect(cancellationNotificationCount).to.equal(1);

    const booking = await knex('bookings').where({ id: 1 }).first();
    expect(Boolean(booking.cancelled)).to.equal(true);
  });
});
