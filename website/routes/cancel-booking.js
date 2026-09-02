const express = require('express');
const axios = require('axios');
const utilities = require('../utilities');
const settings = require('../settings');

const apiUrl = settings.apiUrl;
const router = express.Router();
module.exports = router;

/**
 * Converts an API error into a message suitable for the cancellation page.
 *
 * @param {Error} error - The Axios error returned by the API
 * @param {string} defaultMessage - The fallback message
 * @returns {string} The message to display
 */
function apiErrorMessage (error, defaultMessage) {
  if (!error.response) {
    return defaultMessage;
  }
  if (error.response.status === 404) {
    return 'No booking found with this cancellation link.';
  }
  if (error.response.status === 400) {
    return typeof error.response.data === 'string'
      ? error.response.data
      : 'This booking has already been cancelled or the link is invalid.';
  }
  return typeof error.response.data === 'string' ? error.response.data : defaultMessage;
}

router.get('/cancel-booking/:token', function (req, res) {
  const token = req.params.token;
  if (!token || token.trim() === '') {
    return res.render('error.html', {
      safeErrorMessage: utilities.safeErrorMessage('Invalid cancellation link.')
    });
  }

  const encodedToken = encodeURIComponent(token);
  const bookingUrl = `${apiUrl}/bookings/cancel/${encodedToken}`;

  axios.get(bookingUrl)
    .then(function (response) {
      const booking = response.data;
      if (booking.cancelled === true) {
        return res.render('cancel-booking.html', {
          success: false,
          message: 'This booking has already been cancelled.'
        });
      }

      res.render('cancel-booking.html', {
        confirmation: true,
        booking: booking,
        cancellationUrl: `/cancel-booking/${encodedToken}`
      });
    })
    .catch(function (error) {
      console.log('Error loading booking for cancellation:', error);
      res.render('cancel-booking.html', {
        success: false,
        message: apiErrorMessage(error, 'An error occurred while loading your booking.')
      });
    });
});

router.post('/cancel-booking/:token', function (req, res) {
  const token = req.params.token;
  if (!token || token.trim() === '') {
    return res.render('error.html', {
      safeErrorMessage: utilities.safeErrorMessage('Invalid cancellation link.')
    });
  }

  const encodedToken = encodeURIComponent(token);
  const cancelUrl = `${apiUrl}/bookings/cancel/${encodedToken}`;

  axios.post(cancelUrl)
    .then(function () {
      res.render('cancel-booking.html', {
        success: true,
        message: 'Your booking has been cancelled successfully.'
      });
    })
    .catch(function (error) {
      console.log('Error cancelling booking:', error);
      res.render('cancel-booking.html', {
        success: false,
        message: apiErrorMessage(error, 'An error occurred while cancelling your booking.')
      });
    });
});
