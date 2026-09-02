const express = require('express');
const mainModel = require('../model');
const router = express.Router();
const { checkId, checkPostItemFields, checkPutItemFields } = require('../model/validation');
const emailService = require('../services/emailService');
const moment = require('moment');
module.exports = router;

router.get('/', async function (req, res) {
  try {
    const slots = await mainModel.bookings.getAll();
    res.json(slots);
  } catch (error) {
    console.log(`Error trying to GET bookings: ${error}`);
    res.status(500).send('Unexpected error trying to get all bookings.');
  }
});

router.get('/cancel/:token', async function (req, res) {
  const token = req.params.token;
  if (!token || token.trim() === '') {
    res.status(400).send('Token is required.');
    return;
  }
  try {
    const booking = await mainModel.bookings.getByToken(token);
    if (booking == null) {
      res.status(404).send('No booking found with this token.');
      return;
    }

    const resource = await mainModel.resources.getById(booking.resourceId);
    if (resource != null) {
      booking.resourceName = resource.name;
    }
    res.json(booking);
  } catch (error) {
    console.log(`Error trying to GET booking by cancellation token: ${error}`);
    res.status(500).send('Unexpected error trying to get a booking.');
  }
});

router.get('/:id', async function (req, res) {
  const id = checkId(req.params.id);
  if (id == null) {
    res.status(400).send('Booking id is not valid.');
    return;
  }
  try {
    const slot = await mainModel.bookings.getById(id);
    if (slot == null) {
      res.status(404).send('No such booking');
    } else {
      res.json(slot);
    }
  } catch (error) {
    console.log(`Error trying to GET booking: ${error}`);
    res.status(500).send('Unexpected error trying to get a booking.');
  }
});

router.post('/', async function (req, res) {
  const bookingtem = req.body;
  if (!checkPostItemFields(bookingtem, mainModel.bookings)) {
    res.status(400).send('Booking does not have required fields.');
    return;
  }
  try {
    // Validate booking doesn't conflict with existing bookings
    const resourceId = req.body.resourceId;
    if (!resourceId) {
      res.status(400).send('Resource ID is required.');
      return;
    }

    // Get resource to check capacity
    const resource = await mainModel.resources.getById(resourceId);
    if (resource == null) {
      res.status(404).send('Resource not found.');
      return;
    }

    // Check for overlapping bookings
    const bookingStarts = moment(req.body.starts);
    const bookingEnds = moment(req.body.ends);

    if (!bookingStarts.isValid() || !bookingEnds.isValid()) {
      res.status(400).send('Invalid start or end date.');
      return;
    }

    if (bookingEnds.isSameOrBefore(bookingStarts)) {
      res.status(400).send('End time must be after start time.');
      return;
    }

    // Get all non-cancelled bookings for this resource that might overlap
    // We need to check a date range that covers the booking time
    const startDate = bookingStarts.clone().startOf('day');
    const endDate = bookingEnds.clone().endOf('day');
    const existingBookings = await mainModel.bookings.getByDate(startDate, endDate, resourceId);

    // Count overlapping bookings
    let overlappingCount = 0;
    for (const existingBooking of existingBookings) {
      const existingStarts = moment(existingBooking.starts);
      const existingEnds = moment(existingBooking.ends);

      // Two ranges overlap if: existingStarts < bookingEnds AND existingEnds > bookingStarts
      if (existingStarts.isBefore(bookingEnds) && existingEnds.isAfter(bookingStarts)) {
        overlappingCount++;
      }
    }

    // Check if adding this booking would exceed capacity
    if (overlappingCount >= resource.capacity) {
      res.status(409).send('This time slot is already fully booked. Please select another time.');
      return;
    }

    // All validation passed, proceed with booking creation
    const result = await mainModel.bookings.insert(req.body);
    // Get the inserted booking with token
    const bookingId = result[0].id;
    const booking = await mainModel.bookings.getById(bookingId);

    // Get resource information for email (reuse resource we already fetched)
    if (resource) {
      booking.resourceName = resource.name;
    }

    // Send confirmation email (don't fail booking creation if email fails)
    const websiteBaseUrl = process.env.OPTIMISM_WEBSITE_BASE_URL;
    const cancellationUrl = `${websiteBaseUrl}/cancel-booking/${booking.token}`;
    emailService.sendBookingConfirmationEmail(booking, cancellationUrl)
      .catch((error) => {
        console.error('Failed to send confirmation email:', error);
        // Don't throw - booking was created successfully
      });

    res.status(201).json(booking);
  } catch (error) {
    console.log(`Error trying to POST a new booking: ${error}`);
    res.status(500).send('Unexpected error trying to create a new booking');
  }
});

router.put('/:id', async function (req, res) {
  const id = checkId(req.params.id);
  if (id == null) {
    res.status(400).send('Booking id is not valid.');
  }
  const bookingItem = req.body;
  if (bookingItem.id !== undefined && bookingItem.id !== id) {
    res.status(400).send('Booking id parameter and id in request body must match.');
    return;
  }
  bookingItem.id = id;
  if (!checkPutItemFields(bookingItem, mainModel.bookings)) {
    res.status(400).send('Booking does not have required fields.');
    return;
  }
  try {
    const existing = await mainModel.bookings.getById(bookingItem.id);
    if (existing == null) {
      res.status(404).send('No such booking');
      return;
    }
    const result = await mainModel.bookings.update(req.body);
    res.json(result);
  } catch (error) {
    console.log(`Error trying to PUT a booking: ${error}`);
    res.status(500).send('Unexpected error trying to update a booking');
  }
});

router.delete('/:id', async function (req, res) {
  const id = checkId(req.params.id);
  if (id == null) {
    res.status(400).send('Booking id is not valid.');
    return;
  }
  try {
    const result = await mainModel.bookings.deleteWhere({ id: id });
    const status = result === 0 ? 204 : 200;
    res.status(status).json(result);
  } catch (error) {
    console.log(`Error trying to DELETE a booking: ${error}`);
    res.status(500).send('Unexpected error trying to delete a booking');
  }
});

router.post('/cancel/:token', async function (req, res) {
  const token = req.params.token;
  if (!token || token.trim() === '') {
    res.status(400).send('Token is required.');
    return;
  }
  try {
    const booking = await mainModel.bookings.getByToken(token);
    if (booking == null) {
      res.status(404).send('No booking found with this token.');
      return;
    }
    if (booking.cancelled === true) {
      res.status(400).send('This booking has already been cancelled.');
      return;
    }

    await mainModel.bookings.update({ id: booking.id, cancelled: true });
    const cancelledBooking = { ...booking, cancelled: true };

    // Cancellation must succeed even if loading the resource or sending the
    // notification email fails.
    try {
      const resource = await mainModel.resources.getById(booking.resourceId);
      if (resource != null) {
        cancelledBooking.resourceName = resource.name;
      }
    } catch (error) {
      console.error('Failed to load resource for cancellation notification:', error);
    }

    emailService.sendBookingCancellationNotificationEmail(cancelledBooking)
      .catch((error) => {
        console.error('Failed to send cancellation notification email:', error);
      });

    res.status(200).json({ message: 'Booking cancelled successfully.', booking: cancelledBooking });
  } catch (error) {
    console.log(`Error trying to cancel booking: ${error}`);
    res.status(500).send('Unexpected error trying to cancel booking');
  }
});
