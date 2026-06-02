const express = require('express');
const axios = require('axios');
const moment = require('moment');
const utilities = require('../utilities');
const settings = require('../settings');

const apiUrl = settings.apiUrl;
const router = express.Router();
module.exports = router;

router.post('/confirmation', function (req, res) {
  const resourceId = req.body.resourceId;
  const name = req.body.name;
  const email = req.body.email;
  const starts = req.body.starts;
  const ends = req.body.ends;
  const notes = req.body.notes;
  if (resourceId === undefined || name === undefined || starts === undefined ||
      ends === undefined || notes === undefined) {
    res.status(500).end();
    return;
  }
  const bookingsUrl = `${apiUrl}/bookings`;
  const postData = {
    resourceId: resourceId,
    name: name,
    email: email,
    starts: moment(starts),
    ends: moment(ends),
    notes: notes
  };

  axios.post(bookingsUrl, postData)
    .then(function (response) {
      const booking = response.data;
      
      // Format dates for display
      const friendlyStartTime = moment(booking.starts).format('llll');
      const friendlyEndTime = moment(booking.ends).format('llll');
      
      // Build cancellation URL
      const cancellationUrl = `${settings.websiteBaseUrl}/cancel-booking/${booking.token}`;
      
      // Prepare template variables
      const templateVariables = {
        booking: booking,
        resourceName: booking.resourceName || 'your booking',
        friendlyStartTime: friendlyStartTime,
        friendlyEndTime: friendlyEndTime,
        cancellationUrl: cancellationUrl
      };
      
      res.render('confirmation.html', templateVariables);
    })
    .catch(function (error) {
      console.log('Error creating booking:', error);
      
      // Extract proper error message from API response
      let errorMessage = 'An unexpected error occurred while creating your booking. Please try again.';
      
      if (error.response) {
        // API responded with an error status
        const status = error.response.status;
        const apiMessage = error.response.data;
        
        // Use the API's error message if available
        if (typeof apiMessage === 'string' && apiMessage.trim()) {
          errorMessage = apiMessage;
        } else if (status === 409) {
          errorMessage = 'This time slot is already fully booked. Please select another time.';
        } else if (status === 400) {
          errorMessage = 'Invalid booking details. Please check your information and try again.';
        } else if (status === 404) {
          errorMessage = 'The requested resource was not found. Please try again.';
        } else if (status === 500) {
          errorMessage = 'A server error occurred. Please try again later.';
        }
      } else if (error.request) {
        // Request was made but no response received
        errorMessage = 'Unable to connect to the server. Please check your internet connection and try again.';
      }
      
      res.render('error.html', {
        safeErrorMessage: utilities.safeErrorMessage(errorMessage)
      });
    });
});
